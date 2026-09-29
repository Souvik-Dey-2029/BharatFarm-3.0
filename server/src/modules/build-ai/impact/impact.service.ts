import { DEMO_IMPACT_METRICS, DEMO_IMPACT_SUMMARY } from './impact.seed.js';
import { ImpactMetricRecord, ImpactSummaryData } from './impact.types.js';

export class ImpactService {
  private metricsStore: ImpactMetricRecord[] = [...DEMO_IMPACT_METRICS];

  /**
   * Get normalized impact evaluation metrics summary for a target field.
   */
  async getFieldImpactSummary(fieldId: string): Promise<ImpactSummaryData> {
    const fieldMetrics = this.metricsStore.filter(m => m.fieldId === fieldId || fieldId === 'field_demo_paddy_01');

    if (fieldMetrics.length === 0) {
      return {
        fieldId,
        fieldName: 'Target Field',
        totalMetricsTracked: 0,
        kpis: {
          yieldImprovementPercent: 0,
          soilHealthScore: 0,
          waterSavedLitersPerHa: 0,
          riskReductionIndexPercent: 0,
          estimatedCarbonOffsetTons: 0
        },
        metrics: [],
        timeSeries: []
      };
    }

    return {
      ...DEMO_IMPACT_SUMMARY,
      fieldId,
      metrics: fieldMetrics
    };
  }

  /**
   * Add a user-entered or sensor-derived impact metric record.
   */
  async addMetricRecord(record: Partial<ImpactMetricRecord>): Promise<ImpactMetricRecord> {
    const newRecord: ImpactMetricRecord = {
      id: `imp_${Date.now()}`,
      fieldId: record.fieldId || 'field_demo_paddy_01',
      fieldName: record.fieldName || 'North Paddy Plot',
      category: record.category || 'YIELD',
      metricName: record.metricName || 'Custom Impact Metric',
      value: typeof record.value === 'number' ? record.value : 0,
      previousValue: record.previousValue,
      unit: record.unit || 'units',
      changePercentage: record.previousValue ? Math.round(((record.value! - record.previousValue) / record.previousValue) * 1000) / 10 : 0,
      trend: record.trend || 'UP',
      sourceType: record.sourceType || 'user-entered',
      sourceLabel: record.sourceLabel || 'Manual Entry',
      measuredAt: record.measuredAt || new Date().toISOString().split('T')[0],
      notes: record.notes
    };

    this.metricsStore.unshift(newRecord);
    return newRecord;
  }
}

export const impactService = new ImpactService();
