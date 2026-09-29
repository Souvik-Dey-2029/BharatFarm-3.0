import { Router } from 'express';
import { authenticateToken } from '../../../middleware/auth.middleware.js';
import { analyzeSoilHealth, getSoilHistory, getSampleSoilData } from './soil.controller.js';

const router = Router();

router.post('/analyze', authenticateToken, analyzeSoilHealth);
router.get('/history/:fieldId', authenticateToken, getSoilHistory);
router.get('/sample', authenticateToken, getSampleSoilData);

export default router;
