import { Router } from 'express';
import * as marketplaceController from '../controllers/marketplace.controller';

const router = Router();

router.get('/products', marketplaceController.getProducts);
router.post('/products', marketplaceController.createProduct);
router.post('/orders', marketplaceController.createOrder);
router.get('/analytics', marketplaceController.getAnalytics);

export default router;
