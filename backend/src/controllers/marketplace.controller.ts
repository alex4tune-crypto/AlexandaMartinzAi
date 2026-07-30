import { Request, Response } from 'express';
import prisma from '../services/prisma.service';
import { broadcast } from '../services/socket.service';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { updatedAt: 'desc' }
    });
    res.json({ success: true, products });
  } catch (error) {
    console.error("Fetch Products Error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch products" });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const productData = req.body;
    const newProduct = await prisma.product.create({
      data: {
        title: productData.title || "Custom AI Solution",
        category: productData.category || "Web Applications",
        firmName: productData.firmName || "Aether Web & App Development Lab",
        price: Number(productData.price) || 299,
        rating: 5.0,
        downloads: 1,
        description: productData.description || "Enterprise AI solution created by specialist firm.",
        features: productData.features || ["Production Quality Deliverable", "Verified Holas Compliance"],
        deliverableType: productData.deliverableType || "Source Code & Documentation",
        status: productData.status || "PUBLISHED",
        isFeatured: productData.isFeatured ?? true,
      }
    });
    res.json({ success: true, product: newProduct });
  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(500).json({ success: false, error: "Failed to create product" });
  }
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const orderData = req.body;
    const trackingNumber = `TRK-${Math.floor(10000 + Math.random() * 90000)}`;
    
    const newOrder = await prisma.order.create({
      data: {
        clientName: orderData.clientName || "Corporate Client",
        clientEmail: orderData.clientEmail || "client@company.com",
        selectedCategory: orderData.selectedCategory || "Web Applications",
        projectRequirements: orderData.projectRequirements || "Custom enterprise AI solution request.",
        budgetTier: orderData.budgetTier || "$10,000+",
        assignedNode: orderData.assignedNode || "Aether Web & App Development Lab",
        status: "PENDING",
        trackingNumber: trackingNumber,
        quoteAmount: 12500
      }
    });

    // Broadcast real-time update
    broadcast('new-order', newOrder);

    res.json({ success: true, order: newOrder });
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ success: false, error: "Failed to create order" });
  }
};

export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const [products, orders] = await Promise.all([
      prisma.product.findMany(),
      prisma.order.findMany()
    ]);

    const totalDownloads = products.reduce((sum, p) => sum + (p.downloads || 0), 0);
    const productRevenue = products.reduce((sum, p) => sum + (Number(p.price || 0) * (p.downloads || 1)), 0);
    const orderRevenue = orders.reduce((sum, o) => sum + Number(o.quoteAmount || 0), 0);
    const totalRevenue = productRevenue + orderRevenue;

    res.json({
      success: true,
      analytics: {
        totalRevenue,
        mrr: Math.round(totalRevenue * 0.42),
        quoteRequestsCount: orders.length,
        totalDownloads,
        totalProducts: products.length,
        topPerformingFirm: "Aether Web & App Development Lab",
        conversionRate: "8.4%",
        networkSecurityScore: 99
      }
    });
  } catch (error) {
    console.error("Analytics Error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch analytics" });
  }
};
