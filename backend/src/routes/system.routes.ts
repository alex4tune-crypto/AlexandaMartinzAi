import { Router } from 'express';
import * as systemController from '../controllers/system.controller';

const router = Router();

router.get('/stats', systemController.getStats);
router.get('/health', systemController.getHealth);

export default router;
