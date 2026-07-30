import { Router } from 'express';
import * as analyticsController from '../controllers/analytics.controller';

const router = Router();

router.post('/events', analyticsController.logEvent);
router.get('/events', analyticsController.getEvents);
router.get('/retention', analyticsController.getRetention);

export default router;
