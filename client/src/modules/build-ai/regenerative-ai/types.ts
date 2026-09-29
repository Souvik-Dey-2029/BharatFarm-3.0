export interface RegenerativeContextInput {
  fieldId?: string;
  fieldName?: string;
  crop?: string;
  location?: string;
  lat?: number;
  lng?: number;
  includeSoilData?: boolean;
  includeSatelliteData?: boolean;
  soilData?: {
    ph: number;
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    organicCarbon: number;
  };
  satelliteData?: {
    currentNdvi: number;
    trend: string;
  };
}

export interface RegenerativeAction {
  id: string;
  title: string;
  description: string;
  timing: string;
  impactCategory: 'SOIL_BUILDING' | 'WATER_CONSERVATION' | 'CARBON_SEQUESTRATION' | 'PEST_BIOCONTROL' | 'CLIMATE_RESILIENCE';
  priority: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
  evidenceTrace: string;
}

export interface RegenerativeResponseSchema {
  schemaVersion: 'v1.0.0';
  headline: string;
  sustainabilityScore: number;
  immediateActions: RegenerativeAction[];
  seasonalActions: RegenerativeAction[];
  soilActions: RegenerativeAction[];
  waterActions: RegenerativeAction[];
  riskMitigation: RegenerativeAction[];
  evidence: Array<{ parameter: string; value: string; impactOnPlan: string }>;
  assumptions: string[];
  limitations: string[];
  source: 'live_ai' | 'deterministic_engine';
  generatedAt: string;
}
