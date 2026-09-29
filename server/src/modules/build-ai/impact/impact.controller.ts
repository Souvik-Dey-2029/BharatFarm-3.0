import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middleware/auth.middleware.js';
import { ApiResponse } from '../../../utils/apiResponse.js';
import { impactService } from './impact.service.js';

export const getFieldImpact = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { fieldId } = req.params;
    const data = await impactService.getFieldImpactSummary(fieldId || 'field_demo_paddy_01');
    return ApiResponse.success(res, data, 'Field impact evaluation summary loaded successfully');
  } catch (error: any) {
    return ApiResponse.error(res, error.message || 'Failed to fetch impact metrics', 'SERVER_ERROR', 500);
  }
};

export const addImpactMetric = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const record = await impactService.addMetricRecord(req.body);
    return ApiResponse.success(res, record, 'New impact metric record added successfully');
  } catch (error: any) {
    return ApiResponse.error(res, error.message || 'Failed to add impact metric', 'SERVER_ERROR', 500);
  }
};
