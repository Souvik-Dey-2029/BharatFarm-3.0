import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middleware/auth.middleware.js';
import { ApiResponse } from '../../../utils/apiResponse.js';
import { satelliteService } from './satellite.service.js';

export const getSatelliteFields = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const fields = satelliteService.getDefaultFields();
    return ApiResponse.success(res, { fields }, 'Available satellite fields fetched');
  } catch (error: any) {
    return ApiResponse.error(res, error.message || 'Failed to fetch satellite fields', 'SERVER_ERROR', 500);
  }
};

export const getFieldSatelliteData = async (req: AuthenticatedRequest, res: Response) => {
  const { fieldId } = req.params;
  const { from, to, field_name, crop_name, area_acres, centroid_lat, centroid_lng } = req.query;

  if (!fieldId) {
    return ApiResponse.error(res, 'Field ID is required', 'VALIDATION_ERROR', 400);
  }

  try {
    const fieldMeta = {
      field_name: field_name ? String(field_name) : undefined,
      crop_name: crop_name ? String(crop_name) : undefined,
      area_acres: area_acres ? parseFloat(String(area_acres)) : undefined,
      centroid_lat: centroid_lat ? parseFloat(String(centroid_lat)) : undefined,
      centroid_lng: centroid_lng ? parseFloat(String(centroid_lng)) : undefined
    };

    const data = await satelliteService.getFieldSatelliteData(
      fieldId,
      fieldMeta,
      from ? String(from) : undefined,
      to ? String(to) : undefined
    );

    return ApiResponse.success(res, data, 'Field satellite telemetry data fetched successfully');
  } catch (error: any) {
    return ApiResponse.error(res, error.message || 'Failed to retrieve satellite telemetry', 'SERVER_ERROR', 500);
  }
};
