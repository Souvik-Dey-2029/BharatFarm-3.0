import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middleware/auth.middleware.js';
import { ApiResponse } from '../../../utils/apiResponse.js';
import { soilService } from './soil.service.js';

export const analyzeSoilHealth = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { fieldId, fieldName, crop, ph, nitrogen, phosphorus, potassium, organicCarbon } = req.body;

    const result = await soilService.analyzeSoil({
      fieldId,
      fieldName,
      crop,
      ph: ph != null ? parseFloat(String(ph)) : undefined,
      nitrogen: nitrogen != null ? parseFloat(String(nitrogen)) : undefined,
      phosphorus: phosphorus != null ? parseFloat(String(phosphorus)) : undefined,
      potassium: potassium != null ? parseFloat(String(potassium)) : undefined,
      organicCarbon: organicCarbon != null ? parseFloat(String(organicCarbon)) : undefined
    });

    return ApiResponse.success(res, result, 'Soil health analysis completed successfully');
  } catch (error: any) {
    return ApiResponse.error(res, error.message || 'Failed to analyze soil health', 'SERVER_ERROR', 500);
  }
};

export const getSoilHistory = async (req: AuthenticatedRequest, res: Response) => {
  const { fieldId } = req.params;
  if (!fieldId) {
    return ApiResponse.error(res, 'Field ID is required', 'VALIDATION_ERROR', 400);
  }

  try {
    const history = soilService.getHistory(fieldId);
    return ApiResponse.success(res, { history }, 'Soil analysis history fetched');
  } catch (error: any) {
    return ApiResponse.error(res, error.message || 'Failed to fetch soil history', 'SERVER_ERROR', 500);
  }
};

export const getSampleSoilData = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const sampleResult = await soilService.analyzeSoil({
      fieldId: 'field_demo_paddy_01',
      fieldName: 'North Paddy Plot',
      crop: 'Rice (Paddy)',
      ph: 6.5,
      nitrogen: 220,
      phosphorus: 18,
      potassium: 195,
      organicCarbon: 0.62
    });

    return ApiResponse.success(res, sampleResult, 'Pre-seeded sample soil lab report loaded');
  } catch (error: any) {
    return ApiResponse.error(res, error.message || 'Failed to load sample soil data', 'SERVER_ERROR', 500);
  }
};
