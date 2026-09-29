import { Router } from 'express';
import { authenticateToken } from '../../../middleware/auth.middleware.js';
import { getBricsRecords, getBricsComparison, summarizeBricsRecords } from './brics.controller.js';

const router = Router();

// Route endpoints for BRICS Data & Knowledge Hub
router.get('/records', authenticateToken, getBricsRecords);
router.get('/comparison', authenticateToken, getBricsComparison);
router.post('/summarize', authenticateToken, summarizeBricsRecords);

export default router;
