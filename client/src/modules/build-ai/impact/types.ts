export type ImpactSourceType = 'measured' | 'user-entered' | 'api-derived' | 'model-estimated' | 'demo';

export type ImpactCategory = 'YIELD' | 'SOIL_HEALTH' | 'WATER_EFFICIENCY' | 'RISK_REDUCTION' | 'CARBON_SEQUESTRATION';

export interface ImpactMetricRecord {
  id: string;
  fieldId: string;
  fieldName: string;
  category: ImpactCategory;
  metricName: string;
  value: number;
  previousValue?: number;
  unit: string;
  changePercentage: number;
  trend: 'UP' | 'DOWN' | 'STABLE';
  sourceType: ImpactSourceType;
  sourceLabel: string;
  measuredAt: string;
  notes?: string;
}

export interface ImpactSummaryData {
  fieldId: string;
  fieldName: string;
  totalMetricsTracked: number;
  kpis: {
    yieldImprovementPercent: number;
    soilHealthScore: number;
    waterSavedLitersPerHa: number;
    riskReductionIndexPercent: number;
    estimatedCarbonOffsetTons: number;
  };
  metrics: ImpactMetricRecord[];
  timeSeries: Array<{
    month: string;
    yieldIndex: number;
    soilScore: number;
    waterEfficiencyPercent: number;
    riskIndex: number;
  }>;
}
