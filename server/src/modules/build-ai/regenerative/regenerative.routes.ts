import { Router } from 'express';
import { authenticateToken } from '../../../middleware/auth.middleware.js';
import { generateRegenerativePlan, getSampleRegenerativePlan } from './regenerative.controller.js';

const router = Router();

router.post('/plan', authenticateToken, generateRegenerativePlan);
router.get('/sample', authenticateToken, getSampleRegenerativePlan);

export default router;
