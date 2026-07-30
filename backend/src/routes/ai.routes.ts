import { Router } from 'express';
import * as aiController from '../controllers/ai.controller';

const router = Router();

router.post('/ceo/decide', aiController.decide);
router.post('/agent/execute', aiController.executeAgent);
router.post('/holas/audit', aiController.auditSecurity);

export default router;
