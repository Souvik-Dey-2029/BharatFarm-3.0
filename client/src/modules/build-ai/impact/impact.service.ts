import { ApiClient } from '../../../services/apiClient.js';
import { ImpactSummaryData, ImpactMetricRecord } from './types.js';

export class ImpactClientService {
  /**
   * Fetch impact evaluation summary for a specific field
   */
  static async getFieldImpact(fieldId: string): Promise<ImpactSummaryData> {
    const res = await ApiClient.get<ImpactSummaryData>(`/build-ai/impact/fields/${fieldId}`);
    if (res.success && res.data) {
      return res.data;
    }
    throw new Error(res.error?.message || 'Failed to fetch impact data');
  }

  /**
   * Submit a new user-entered or sensor-derived impact metric record
   */
  static async addMetric(record: Partial<ImpactMetricRecord>): Promise<ImpactMetricRecord> {
    const res = await ApiClient.post<ImpactMetricRecord>('/build-ai/impact/metrics', record);
    if (res.success && res.data) {
      return res.data;
    }
    throw new Error(res.error?.message || 'Failed to add impact metric');
  }
}
