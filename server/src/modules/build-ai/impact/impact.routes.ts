import { Router } from 'express';
import { authenticateToken } from '../../../middleware/auth.middleware.js';
import { getFieldImpact, addImpactMetric } from './impact.controller.js';

const router = Router();

router.get('/fields/:fieldId', authenticateToken, getFieldImpact);
router.post('/metrics', authenticateToken, addImpactMetric);

export default router;
