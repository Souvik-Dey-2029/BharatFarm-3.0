import { Response } from 'express';
import { AuthenticatedRequest } from '../../../middleware/auth.middleware.js';
import { ApiResponse } from '../../../utils/apiResponse.js';
import { bricsKnowledgeService } from './brics.service.js';
import { BricsCountryCode, BricsTopicCategory } from './brics.types.js';

export const getBricsRecords = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const country = req.query.country as BricsCountryCode | 'ALL';
    const crop = req.query.crop as string;
    const topic = req.query.topic as BricsTopicCategory | 'ALL';
    const search = req.query.search as string;

    const data = bricsKnowledgeService.getRecords({ country, crop, topic, search });
    return ApiResponse.success(res, data, 'BRICS knowledge records retrieved successfully');
  } catch (error: any) {
    return ApiResponse.error(res, error.message || 'Failed to retrieve BRICS records', 'SERVER_ERROR', 500);
  }
};

export const getBricsComparison = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const country = req.query.country as BricsCountryCode | 'ALL';
    const crop = req.query.crop as string;
    const topic = req.query.topic as BricsTopicCategory | 'ALL';
    const search = req.query.search as string;

    const data = bricsKnowledgeService.getComparisonView({ country, crop, topic, search });
    return ApiResponse.success(res, data, 'BRICS comparison groups generated successfully');
  } catch (error: any) {
    return ApiResponse.error(res, error.message || 'Failed to generate BRICS comparison view', 'SERVER_ERROR', 500);
  }
};

export const summarizeBricsRecords = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { records, userQuery, targetCrop } = req.body;
    const summary = await bricsKnowledgeService.generateAiSummary({ records, userQuery, targetCrop });
    return ApiResponse.success(res, summary, 'BRICS knowledge AI synthesis completed');
  } catch (error: any) {
    return ApiResponse.error(res, error.message || 'Failed to summarize BRICS records', 'SERVER_ERROR', 500);
  }
};
