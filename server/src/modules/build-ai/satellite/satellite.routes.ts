import { Router } from 'express';
import { authenticateToken } from '../../../middleware/auth.middleware.js';
import { getSatelliteFields, getFieldSatelliteData } from './satellite.controller.js';

const router = Router();

router.get('/fields', authenticateToken, getSatelliteFields);
router.get('/fields/:fieldId', authenticateToken, getFieldSatelliteData);

export default router;
