import { ImpactMetricRecord, ImpactSummaryData } from './impact.types.js';

export const DEMO_IMPACT_METRICS: ImpactMetricRecord[] = [
  {
    id: 'imp_yield_01',
    fieldId: 'field_demo_paddy_01',
    fieldName: 'North Paddy Plot',
    category: 'YIELD',
    metricName: 'Grain Yield per Hectare',
    value: 5.4,
    previousValue: 4.6,
    unit: 'tonnes/ha',
    changePercentage: 17.4,
    trend: 'UP',
    sourceType: 'user-entered',
    sourceLabel: 'Harvest Weighbridge Receipt',
    measuredAt: '2026-09-15',
    notes: 'Recorded after implementing Alternate Wetting & Drying (AWD) irrigation.'
  },
  {
    id: 'imp_soil_01',
    fieldId: 'field_demo_paddy_01',
    fieldName: 'North Paddy Plot',
    category: 'SOIL_HEALTH',
    metricName: 'Soil Organic Carbon (SOC)',
    value: 0.68,
    previousValue: 0.52,
    unit: '%',
    changePercentage: 30.7,
    trend: 'UP',
    sourceType: 'measured',
    sourceLabel: 'ICAR Accredited Soil Testing Lab',
    measuredAt: '2026-09-01',
    notes: 'Increased organic matter via Sesbania green manure incorporation.'
  },
  {
    id: 'imp_water_01',
    fieldId: 'field_demo_paddy_01',
    fieldName: 'North Paddy Plot',
    category: 'WATER_EFFICIENCY',
    metricName: 'Seasonal Water Usage Savings',
    value: 1250000,
    previousValue: 1800000,
    unit: 'Liters/ha',
    changePercentage: 30.5,
    trend: 'DOWN',
    sourceType: 'api-derived',
    sourceLabel: 'Smart Drip & Sap-Flow Telemetry',
    measuredAt: '2026-09-20',
    notes: '30.5% reduction in groundwater pumping energy costs.'
  },
  {
    id: 'imp_risk_01',
    fieldId: 'field_demo_paddy_01',
    fieldName: 'North Paddy Plot',
    category: 'RISK_REDUCTION',
    metricName: 'Climate & Flood Risk Index',
    value: 24,
    previousValue: 58,
    unit: 'Risk Score (0-100)',
    changePercentage: -58.6,
    trend: 'DOWN',
    sourceType: 'model-estimated',
    sourceLabel: 'BharatFarm Climate AI Engine',
    measuredAt: '2026-09-25',
    notes: 'Risk reduced due to drainage channel trenching and resilient seed strain.'
  },
  {
    id: 'imp_carbon_01',
    fieldId: 'field_demo_paddy_01',
    fieldName: 'North Paddy Plot',
    category: 'CARBON_SEQUESTRATION',
    metricName: 'Estimated Carbon Offset',
    value: 2.8,
    previousValue: 1.1,
    unit: 'tCO2e/ha/yr',
    changePercentage: 154.5,
    trend: 'UP',
    sourceType: 'model-estimated',
    sourceLabel: 'BRICS Biochar & Methane Model',
    measuredAt: '2026-09-22',
    notes: 'Methane emissions cut by 25% due to reduced soil flooding period.'
  }
];

export const DEMO_IMPACT_SUMMARY: ImpactSummaryData = {
  fieldId: 'field_demo_paddy_01',
  fieldName: 'North Paddy Plot',
  totalMetricsTracked: DEMO_IMPACT_METRICS.length,
  kpis: {
    yieldImprovementPercent: 17.4,
    soilHealthScore: 78,
    waterSavedLitersPerHa: 550000,
    riskReductionIndexPercent: 58.6,
    estimatedCarbonOffsetTons: 2.8
  },
  metrics: DEMO_IMPACT_METRICS,
  timeSeries: [
    { month: 'Apr', yieldIndex: 100, soilScore: 58, waterEfficiencyPercent: 60, riskIndex: 65 },
    { month: 'May', yieldIndex: 104, soilScore: 62, waterEfficiencyPercent: 68, riskIndex: 58 },
    { month: 'Jun', yieldIndex: 108, soilScore: 66, waterEfficiencyPercent: 74, riskIndex: 48 },
    { month: 'Jul', yieldIndex: 112, soilScore: 70, waterEfficiencyPercent: 82, riskIndex: 38 },
    { month: 'Aug', yieldIndex: 115, soilScore: 74, waterEfficiencyPercent: 88, riskIndex: 30 },
    { month: 'Sep', yieldIndex: 117.4, soilScore: 78, waterEfficiencyPercent: 91, riskIndex: 24 }
  ]
};
