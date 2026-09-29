import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middleware/auth.middleware.js';
import { ApiResponse } from '../../../utils/apiResponse.js';
import { regenerativeService } from './regenerative.service.js';

export const generateRegenerativePlan = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { fieldId, fieldName, crop, location, lat, lng, includeSoilData, includeSatelliteData, soilData, satelliteData } = req.body;

    const plan = await regenerativeService.generateRegenerativePlan({
      fieldId,
      fieldName,
      crop,
      location,
      lat: lat != null ? parseFloat(String(lat)) : undefined,
      lng: lng != null ? parseFloat(String(lng)) : undefined,
      includeSoilData: includeSoilData !== false,
      includeSatelliteData: includeSatelliteData !== false,
      soilData,
      satelliteData
    });

    return ApiResponse.success(res, plan, 'Regenerative AI plan generated successfully');
  } catch (error: any) {
    return ApiResponse.error(res, error.message || 'Failed to generate regenerative AI plan', 'SERVER_ERROR', 500);
  }
};

export const getSampleRegenerativePlan = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const samplePlan = await regenerativeService.generateRegenerativePlan({
      fieldId: 'field_demo_paddy_01',
      fieldName: 'North Paddy Plot',
      crop: 'Rice (Paddy)',
      location: 'Haldia, West Bengal',
      includeSoilData: true,
      includeSatelliteData: true
    });

    return ApiResponse.success(res, samplePlan, 'Pre-seeded sample regenerative AI plan loaded');
  } catch (error: any) {
    return ApiResponse.error(res, error.message || 'Failed to load sample plan', 'SERVER_ERROR', 500);
  }
};
