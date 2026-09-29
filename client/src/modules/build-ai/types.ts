export interface SatelliteObservation {
  date: string;
  ndvi: number;
  vegetationHealth: 'EXCELLENT' | 'HEALTHY' | 'MODERATE' | 'STRESSED' | 'CRITICAL';
  evi?: number;
  ndwi?: number;
  cloudCover?: number;
  statusDescription?: string;
}

export interface NdviSummary {
  currentNdvi: number;
  previousNdvi: number;
  changePercentage: number;
  trend: 'IMPROVING' | 'STABLE' | 'DECLINING';
  healthStatus: 'EXCELLENT' | 'HEALTHY' | 'MODERATE' | 'STRESSED' | 'CRITICAL';
  lastObservationDate: string;
}

export interface SatelliteFieldSummary {
  id: string;
  field_name: string;
  crop_name: string;
  area_acres: number;
  centroid_lat: number;
  centroid_lng: number;
  boundary_coordinates: Array<{ lat: number; lng: number }>;
  location_address?: string;
}

export interface SatelliteFieldData {
  field: SatelliteFieldSummary;
  observations: SatelliteObservation[];
  ndviSummary: NdviSummary;
  interpretation: {
    headline: string;
    summary: string;
    recommendations: string[];
    waterStatus: string;
    nitrogenLevel: string;
    actionPriority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  };
  modelMetadata: {
    provider: string;
    satellite: string;
    resolution: string;
    bandCombination: string;
    cloudCoverMax: string;
    updateFrequency: string;
  };
  source: 'live' | 'demo';
  generatedAt: string;
}
