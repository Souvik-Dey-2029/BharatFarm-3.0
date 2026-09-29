export interface SoilAnalysisInput {
  fieldId?: string;
  fieldName?: string;
  crop?: string;
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  organicCarbon: number;
}

export type NutrientLevelStatus = 'CRITICAL_LOW' | 'LOW' | 'MODERATE' | 'OPTIMAL' | 'HIGH' | 'EXCESSIVE';

export interface MetricDetail {
  value: number;
  status: NutrientLevelStatus;
  unit: string;
  idealRange: string;
  description: string;
}

export interface SoilRecommendation {
  type: 'ORGANIC_MATTER' | 'NUTRIENT_CORRECTION' | 'PH_BALANCING' | 'IRRIGATION' | 'GENERAL';
  title: string;
  description: string;
  actionPriority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
}

export interface SoilAnalysisResult {
  score: number;
  metrics: {
    ph: MetricDetail;
    nitrogen: MetricDetail;
    phosphorus: MetricDetail;
    potassium: MetricDetail;
    organicCarbon: MetricDetail;
  };
  nutrientStatus: 'EXCELLENT' | 'HIGH_FERTILITY' | 'MODERATE_FERTILITY' | 'NEEDS_IMPROVEMENT' | 'DEGRADED';
  cropContext: {
    crop: string;
    suitabilityScore: number;
    summary: string;
  };
  recommendations: SoilRecommendation[];
  warnings: string[];
  source: 'live_ai' | 'deterministic';
  generatedAt: string;
}
