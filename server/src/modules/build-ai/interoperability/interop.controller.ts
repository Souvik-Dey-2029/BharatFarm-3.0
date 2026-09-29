import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middleware/auth.middleware.js';
import { ApiResponse } from '../../../utils/apiResponse.js';
import { interopService } from './interop.service.js';

export const getFieldById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (!id || id.trim() === '') {
      return ApiResponse.error(res, 'Field ID is required', 'VALIDATION_ERROR', 400);
    }
    const result = await interopService.getFieldById(id);
    return ApiResponse.success(res, result, 'Field interoperability data retrieved successfully');
  } catch (error: any) {
    return ApiResponse.error(res, error.message || 'Failed to fetch field data', 'SERVER_ERROR', 500);
  }
};

export const getSoilByFieldId = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { fieldId } = req.params;
    if (!fieldId || fieldId.trim() === '') {
      return ApiResponse.error(res, 'Field ID is required', 'VALIDATION_ERROR', 400);
    }
    const result = await interopService.getSoilHealthByFieldId(fieldId);
    return ApiResponse.success(res, result, 'Soil health interoperability data retrieved successfully');
  } catch (error: any) {
    return ApiResponse.error(res, error.message || 'Failed to fetch soil data', 'SERVER_ERROR', 500);
  }
};

export const getClimateByFieldId = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { fieldId } = req.params;
    if (!fieldId || fieldId.trim() === '') {
      return ApiResponse.error(res, 'Field ID is required', 'VALIDATION_ERROR', 400);
    }
    const result = await interopService.getClimateByFieldId(fieldId);
    return ApiResponse.success(res, result, 'Climate interoperability data retrieved successfully');
  } catch (error: any) {
    return ApiResponse.error(res, error.message || 'Failed to fetch climate data', 'SERVER_ERROR', 500);
  }
};

export const getMarketByFieldId = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { fieldId } = req.params;
    if (!fieldId || fieldId.trim() === '') {
      return ApiResponse.error(res, 'Field ID is required', 'VALIDATION_ERROR', 400);
    }
    const result = await interopService.getMarketDataByFieldId(fieldId);
    return ApiResponse.success(res, result, 'Market interoperability data retrieved successfully');
  } catch (error: any) {
    return ApiResponse.error(res, error.message || 'Failed to fetch market data', 'SERVER_ERROR', 500);
  }
};

export const getRecommendationByFieldId = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { fieldId } = req.params;
    if (!fieldId || fieldId.trim() === '') {
      return ApiResponse.error(res, 'Field ID is required', 'VALIDATION_ERROR', 400);
    }
    const result = await interopService.getRecommendationByFieldId(fieldId);
    return ApiResponse.success(res, result, 'Recommendation interoperability data retrieved successfully');
  } catch (error: any) {
    return ApiResponse.error(res, error.message || 'Failed to fetch recommendation data', 'SERVER_ERROR', 500);
  }
};

export const getOpenApiSpec = async (_req: any, res: Response) => {
  try {
    const spec = interopService.getOpenApiSpec();
    return res.status(200).json(spec);
  } catch (error: any) {
    return ApiResponse.error(res, error.message || 'Failed to generate OpenAPI spec', 'SERVER_ERROR', 500);
  }
};
