import { Router } from 'express';
import * as userController from '../controllers/user.controller';

const router = Router();

router.post('/sync', userController.syncProfile);
router.get('/:id', userController.getProfile);
router.patch('/:id', userController.updateProfile);

export default router;
