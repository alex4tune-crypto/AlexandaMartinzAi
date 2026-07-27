import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  Firestore 
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { DigitalProduct } from '../../../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
      emailVerified: null,
      isAnonymous: null,
      tenantId: null,
      providerInfo: []
    },
    operationType,
    path
  };
  console.warn('Firestore Warning/Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export function getFirestoreDb(): Firestore | null {
  return db;
}

function cleanForFirestore<T extends Record<string, any>>(obj: T): Record<string, any> {
  const cleaned: Record<string, any> = {};
  for (const [key, val] of Object.entries(obj)) {
    if (val !== undefined) {
      cleaned[key] = val;
    }
  }
  return cleaned;
}

function mapDocToProduct(id: string, data: any): DigitalProduct {
  return {
    id: id || data.id || `prod-${Math.random().toString(36).substring(2, 9)}`,
    title: data.title || 'Untitled Product',
    category: data.category || 'Web Applications',
    firmName: data.firmName || 'Specialist AI Firm',
    price: Number(data.price) || 0,
    rating: Number(data.rating) || 5.0,
    downloads: Number(data.downloads) || 0,
    description: data.description || '',
    features: Array.isArray(data.features) ? data.features : [],
    deliverableType: data.deliverableType || 'Document',
    status: (data.status === 'PUBLISHED' || data.status === 'DRAFT' || data.status === 'ARCHIVED') ? data.status : 'PUBLISHED',
    isFeatured: Boolean(data.isFeatured),
    publishedToPortal: Boolean(data.publishedToPortal ?? true),
    updatedAt: data.updatedAt || new Date().toISOString(),
    pricingModel: data.pricingModel || 'ONE_TIME',
    viewsCount: data.viewsCount,
    inquiriesCount: data.inquiriesCount,
    badgeTag: data.badgeTag,
    imageUrl: data.imageUrl,
    previewContent: data.previewContent
  };
}

async function fetchProductsFromApiServer(): Promise<DigitalProduct[]> {
  try {
    const res = await fetch('/api/marketplace/products');
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return data.products || [];
  } catch (e) {
    console.error("Failed to fetch products from fallback server API:", e);
    return [];
  }
}

async function saveProductToServerApi(product: DigitalProduct): Promise<void> {
  try {
    await fetch('/api/marketplace/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
  } catch (e) {
    console.error("Failed to save product to fallback server API:", e);
  }
}

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Firestore query timed out after ${ms}ms`));
    }, ms);
    promise
      .then(res => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch(err => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

/**
 * Directly fetches real product documents from Firestore /products collection.
 */
export async function fetchProductsFromFirestore(): Promise<DigitalProduct[]> {
  const database = getFirestoreDb();
  const collectionPath = 'products';

  if (!database) {
    return fetchProductsFromApiServer();
  }

  try {
    const productsCol = collection(database, collectionPath);
    const snapshot = await withTimeout(getDocs(productsCol), 2500);
    
    if (snapshot.empty) {
      const serverProducts = await fetchProductsFromApiServer();
      if (serverProducts.length > 0) {
        seedFirestoreProductsIfEmpty(serverProducts).catch(() => {});
        return serverProducts;
      }
      return [];
    }

    const firestoreProducts: DigitalProduct[] = snapshot.docs.map(docSnap => {
      return mapDocToProduct(docSnap.id, docSnap.data());
    });

    return firestoreProducts;
  } catch (error) {
    console.warn("Firestore fetch timed out or failed; returning API server products fallback.");
    return fetchProductsFromApiServer();
  }
}

/**
 * Subscribes to real-time product updates from Firestore /products collection.
 */
export function subscribeToProductsFromFirestore(
  onProductsUpdated: (products: DigitalProduct[]) => void,
  onError?: (error: any) => void
): () => void {
  const database = getFirestoreDb();
  const collectionPath = 'products';

  if (!database) {
    fetchProductsFromApiServer().then(prods => onProductsUpdated(prods));
    return () => {};
  }

  let hasReceivedSnapshot = false;
  const timeoutId = setTimeout(async () => {
    if (!hasReceivedSnapshot) {
      console.warn("Firestore snapshot subscription timed out; falling back to API server products.");
      const serverProducts = await fetchProductsFromApiServer();
      onProductsUpdated(serverProducts);
    }
  }, 2500);

  try {
    const productsCol = collection(database, collectionPath);
    const unsubscribe = onSnapshot(
      productsCol,
      (snapshot) => {
        hasReceivedSnapshot = true;
        clearTimeout(timeoutId);
        if (snapshot.empty) {
          fetchProductsFromApiServer().then(serverProducts => {
            if (serverProducts.length > 0) {
              onProductsUpdated(serverProducts);
              seedFirestoreProductsIfEmpty(serverProducts).catch(() => {});
            } else {
              onProductsUpdated([]);
            }
          });
          return;
        }
        const products = snapshot.docs.map(docSnap => mapDocToProduct(docSnap.id, docSnap.data()));
        onProductsUpdated(products);
      },
      (error) => {
        console.warn("Firestore onSnapshot warning/error for products; using server fallback:", error);
        clearTimeout(timeoutId);
        if (onError) onError(error);
        fetchProductsFromApiServer().then(prods => onProductsUpdated(prods));
      }
    );
    return () => {
      clearTimeout(timeoutId);
      unsubscribe();
    };
  } catch (error) {
    console.warn("Failed to setup snapshot listener for products:", error);
    clearTimeout(timeoutId);
    fetchProductsFromApiServer().then(prods => onProductsUpdated(prods));
    return () => {};
  }
}

/**
 * Fetches a single real product document by ID from Firestore.
 */
export async function fetchProductByIdFromFirestore(productId: string): Promise<DigitalProduct | null> {
  const database = getFirestoreDb();

  if (!database) {
    const all = await fetchProductsFromApiServer();
    return all.find(p => p.id === productId) || null;
  }

  try {
    const docRef = doc(database, 'products', productId);
    const snapshot = await withTimeout(getDoc(docRef), 2500);
    if (!snapshot.exists()) {
      return null;
    }
    return mapDocToProduct(snapshot.id, snapshot.data());
  } catch (error) {
    console.warn(`Firestore getDoc for ${productId} timed out or failed; checking API server.`);
    const all = await fetchProductsFromApiServer();
    return all.find(p => p.id === productId) || null;
  }
}

/**
 * Saves or updates a product document in Firestore.
 */
export async function saveProductToFirestore(product: Partial<DigitalProduct>): Promise<DigitalProduct> {
  const database = getFirestoreDb();
  const productId = product.id || `prod-${Date.now()}`;
  const fullProduct: DigitalProduct = {
    id: productId,
    title: product.title || 'Custom AI Solution',
    category: product.category || 'Web Applications',
    firmName: product.firmName || 'Aether Web & App Development Lab',
    price: typeof product.price === 'number' ? product.price : 299,
    rating: product.rating || 5.0,
    downloads: product.downloads || 1,
    description: product.description || 'Enterprise solution created by specialist firm.',
    features: product.features || ['Production Quality Deliverable', 'Verified Holas Compliance'],
    deliverableType: product.deliverableType || 'Source Code & Documentation',
    status: product.status || 'PUBLISHED',
    isFeatured: product.isFeatured ?? true,
    publishedToPortal: product.publishedToPortal ?? true,
    updatedAt: new Date().toISOString(),
    pricingModel: product.pricingModel || 'ONE_TIME',
    ...(product.imageUrl ? { imageUrl: product.imageUrl } : {}),
    ...(product.badgeTag ? { badgeTag: product.badgeTag } : {}),
    ...(product.viewsCount !== undefined ? { viewsCount: product.viewsCount } : {}),
    ...(product.inquiriesCount !== undefined ? { inquiriesCount: product.inquiriesCount } : {}),
    ...(product.previewContent ? { previewContent: product.previewContent } : {})
  };

  if (!database) {
    console.warn("Firestore not available; saving product to API server.");
    await saveProductToServerApi(fullProduct);
    return fullProduct;
  }

  const docPath = `products/${productId}`;
  try {
    const docRef = doc(database, 'products', productId);
    const cleanedPayload = cleanForFirestore(fullProduct);
    await setDoc(docRef, cleanedPayload);
    // Also mirror to API server in-memory store
    saveProductToServerApi(fullProduct).catch(() => {});
    return fullProduct;
  } catch (error) {
    console.error("Error saving product document to Firestore:", error);
    try {
      handleFirestoreError(error, OperationType.WRITE, docPath);
    } catch {
      await saveProductToServerApi(fullProduct);
      return fullProduct;
    }
  }
}

/**
 * Updates the approval status of a product in Firestore.
 */
export async function updateProductStatusInFirestore(
  productId: string, 
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED'
): Promise<void> {
  const database = getFirestoreDb();
  const docPath = `products/${productId}`;

  if (!database) {
    return;
  }

  try {
    const docRef = doc(database, 'products', productId);
    await updateDoc(docRef, {
      status,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error(`Error updating product status for ${productId} in Firestore:`, error);
    try {
      handleFirestoreError(error, OperationType.UPDATE, docPath);
    } catch {}
  }
}

/**
 * Seeds Firestore with baseline product documents if the collection is empty.
 */
export async function seedFirestoreProductsIfEmpty(defaultProducts: DigitalProduct[]): Promise<void> {
  const database = getFirestoreDb();
  if (!database || !defaultProducts.length) return;

  try {
    const productsCol = collection(database, 'products');
    const snapshot = await getDocs(productsCol);
    if (snapshot.empty) {
      console.log("Seeding Firestore /products collection with baseline catalog...");
      for (const prod of defaultProducts) {
        const docRef = doc(database, 'products', prod.id);
        await setDoc(docRef, cleanForFirestore(prod));
      }
      console.log("Firestore product seeding complete.");
    }
  } catch (error) {
    console.warn("Could not seed initial products to Firestore:", error);
  }
}
