import { Router } from 'express';
import { authenticateToken } from '../../../middleware/auth.middleware.js';
import { aiRateLimiter } from '../../../middleware/aiRateLimit.middleware.js';
import {
  getFieldById,
  getSoilByFieldId,
  getClimateByFieldId,
  getMarketByFieldId,
  getRecommendationByFieldId,
  getOpenApiSpec
} from './interop.controller.js';

const router = Router();

// OpenAPI Specification Endpoint (Public machine-readable spec)
router.get('/openapi.json', getOpenApiSpec);

// Rate-limited & Authenticated API Endpoints
const rateLimit = aiRateLimiter(60000, 30); // 30 req/min limit

router.get('/fields/:id', authenticateToken, rateLimit, getFieldById);
router.get('/soil/:fieldId', authenticateToken, rateLimit, getSoilByFieldId);
router.get('/climate/:fieldId', authenticateToken, rateLimit, getClimateByFieldId);
router.get('/market/:fieldId', authenticateToken, rateLimit, getMarketByFieldId);
router.get('/recommendation/:fieldId', authenticateToken, rateLimit, getRecommendationByFieldId);

export default router;
