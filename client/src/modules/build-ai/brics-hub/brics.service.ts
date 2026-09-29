import { ApiClient } from '../../../services/apiClient.js';
import {
  BricsKnowledgeRecord,
  BricsQueryFilters,
  BricsComparisonGroup,
  BricsAiSummaryResponse
} from './types.js';

export interface BricsRecordsResponse {
  records: BricsKnowledgeRecord[];
  total: number;
}

export class BricsKnowledgeService {
  /**
   * Fetch BRICS knowledge records with optional filters.
   */
  static async getRecords(filters: BricsQueryFilters = {}): Promise<BricsRecordsResponse> {
    const params = new URLSearchParams();
    if (filters.country && filters.country !== 'ALL') params.append('country', filters.country);
    if (filters.crop && filters.crop !== 'ALL') params.append('crop', filters.crop);
    if (filters.topic && filters.topic !== 'ALL') params.append('topic', filters.topic);
    if (filters.search) params.append('search', filters.search);

    const res = await ApiClient.get<BricsRecordsResponse>(`/build-ai/brics/records?${params.toString()}`);

    if (res.success && res.data) {
      return res.data;
    }

    throw new Error(res.error?.message || 'Failed to fetch BRICS knowledge records');
  }

  /**
   * Fetch comparison view grouped by topic.
   */
  static async getComparisonView(filters: BricsQueryFilters = {}): Promise<BricsComparisonGroup[]> {
    const params = new URLSearchParams();
    if (filters.country && filters.country !== 'ALL') params.append('country', filters.country);
    if (filters.crop && filters.crop !== 'ALL') params.append('crop', filters.crop);
    if (filters.topic && filters.topic !== 'ALL') params.append('topic', filters.topic);
    if (filters.search) params.append('search', filters.search);

    const res = await ApiClient.get<BricsComparisonGroup[]>(`/build-ai/brics/comparison?${params.toString()}`);

    if (res.success && res.data) {
      return res.data;
    }

    throw new Error(res.error?.message || 'Failed to fetch comparison view');
  }

  /**
   * Request AI synthesis from retrieved records.
   */
  static async summarizeRecords(records: BricsKnowledgeRecord[], targetCrop?: string): Promise<BricsAiSummaryResponse> {
    const res = await ApiClient.post<BricsAiSummaryResponse>('/build-ai/brics/summarize', {
      records,
      targetCrop
    });

    if (res.success && res.data) {
      return res.data;
    }

    throw new Error(res.error?.message || 'Failed to generate AI synthesis summary');
  }
}
