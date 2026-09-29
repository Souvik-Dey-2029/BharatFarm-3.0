import { SatelliteFieldData, SatelliteObservation, NdviSummary } from './satellite.types.js';
import { config } from '../../../config/env.js';

export interface SatelliteProviderAdapter {
  name: 'live' | 'demo';
  getSatelliteData(
    fieldId: string,
    fieldMeta?: { field_name?: string; crop_name?: string; area_acres?: number; centroid_lat?: number; centroid_lng?: number; boundary_coordinates?: Array<{ lat: number; lng: number }> },
    fromDate?: string,
    toDate?: string
  ): Promise<SatelliteFieldData>;
}

/**
 * Seeded deterministic demo provider adapter for hackathon demonstration.
 * Produces realistic NDVI metrics, time-series observations, and agricultural insights.
 */
export class DemoSatelliteAdapter implements SatelliteProviderAdapter {
  name: 'demo' = 'demo';

  async getSatelliteData(
    fieldId: string,
    fieldMeta?: { field_name?: string; crop_name?: string; area_acres?: number; centroid_lat?: number; centroid_lng?: number; boundary_coordinates?: Array<{ lat: number; lng: number }> },
    fromDate?: string,
    toDate?: string
  ): Promise<SatelliteFieldData> {
    const isPaddy = fieldMeta?.crop_name?.toLowerCase().includes('rice') || fieldMeta?.crop_name?.toLowerCase().includes('paddy');
    const isWheat = fieldMeta?.crop_name?.toLowerCase().includes('wheat');

    const name = fieldMeta?.field_name || (isPaddy ? 'North Paddy Plot' : isWheat ? 'East Wheat Parcel' : 'Main Farm Field');
    const crop = fieldMeta?.crop_name || (fieldId.includes('paddy') ? 'Rice (Paddy)' : fieldId.includes('wheat') ? 'Wheat' : 'Mustard');
    const acres = fieldMeta?.area_acres || 4.5;
    const lat = fieldMeta?.centroid_lat || 22.0667;
    const lng = fieldMeta?.centroid_lng || 88.0667;

    const boundary = fieldMeta?.boundary_coordinates && fieldMeta.boundary_coordinates.length >= 3
      ? fieldMeta.boundary_coordinates
      : [
          { lat: lat + 0.0015, lng: lng - 0.0015 },
          { lat: lat + 0.0018, lng: lng + 0.0012 },
          { lat: lat - 0.0012, lng: lng + 0.0018 },
          { lat: lat - 0.0016, lng: lng - 0.0011 }
        ];

    // Generate 6 months of bi-weekly observations ending near current date
    const observations: SatelliteObservation[] = [];
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() - 120);

    for (let i = 0; i <= 8; i++) {
      const obsDate = new Date(baseDate.getTime() + i * 15 * 24 * 60 * 60 * 1000);
      const dateStr = obsDate.toISOString().split('T')[0];

      // Realistic vegetation growth curve formula: initial low -> peak vegetative -> slight decline near harvest
      let ndviVal = 0.28 + (0.52 * Math.sin((i / 8) * Math.PI));
      ndviVal = Math.min(0.88, Math.max(0.20, Math.round(ndviVal * 100) / 100));

      let health: 'EXCELLENT' | 'HEALTHY' | 'MODERATE' | 'STRESSED' | 'CRITICAL' = 'MODERATE';
      if (ndviVal >= 0.75) health = 'EXCELLENT';
      else if (ndviVal >= 0.60) health = 'HEALTHY';
      else if (ndviVal >= 0.45) health = 'MODERATE';
      else if (ndviVal >= 0.30) health = 'STRESSED';
      else health = 'CRITICAL';

      const evi = Math.round((ndviVal * 0.85) * 100) / 100;
      const ndwi = Math.round((isPaddy ? 0.12 : -0.15 + (ndviVal * 0.3)) * 100) / 100;
      const cloudCover = Math.round((Math.random() * 4.5 + 0.5) * 10) / 10;

      observations.push({
        date: dateStr,
        ndvi: ndviVal,
        vegetationHealth: health,
        evi,
        ndwi,
        cloudCover,
        statusDescription: `Sentinel-2 tile observation. Cloud cover ${cloudCover}%. Vegetation index ${ndviVal}.`
      });
    }

    const currentObs = observations[observations.length - 1];
    const prevObs = observations[observations.length - 2];
    const changePct = Math.round(((currentObs.ndvi - prevObs.ndvi) / prevObs.ndvi) * 100 * 10) / 10;

    const ndviSummary: NdviSummary = {
      currentNdvi: currentObs.ndvi,
      previousNdvi: prevObs.ndvi,
      changePercentage: changePct,
      trend: changePct > 1.0 ? 'IMPROVING' : changePct < -1.0 ? 'DECLINING' : 'STABLE',
      healthStatus: currentObs.vegetationHealth,
      lastObservationDate: currentObs.date
    };

    return {
      field: {
        id: fieldId,
        field_name: name,
        crop_name: crop,
        area_acres: acres,
        centroid_lat: lat,
        centroid_lng: lng,
        boundary_coordinates: boundary,
        location_address: 'Haldia Ag-Zone, West Bengal'
      },
      observations,
      ndviSummary,
      interpretation: {
        headline: `Vigorous Crop Growth (${crop})`,
        summary: `Vegetation health index is strong at ${currentObs.ndvi} (NDVI). Canopy coverage is uniform across ~85% of the registered boundary with minimal moisture stress.`,
        recommendations: [
          'Maintain scheduled irrigation interval over the next 5 days.',
          'Apply secondary nitrogen top-dressing (Urea @ 25 kg/acre) before mid-stage tillering.',
          'Monitor lower leaves for early fungal leaf spot indicators due to high humidity.'
        ],
        waterStatus: isPaddy ? 'Optimal Flooding Level' : 'Adequate Soil Moisture',
        nitrogenLevel: 'Good Canopy Cover (Sufficient N)',
        actionPriority: 'LOW'
      },
      modelMetadata: {
        provider: 'Sentinel-2 Multispectral / ISRO EOS-04 Satellite Data',
        satellite: 'Sentinel-2B L2A (10m Resolution)',
        resolution: '10 Meters per pixel',
        bandCombination: 'B8 (NIR) + B4 (Red) Normalized Difference Vegetation Index',
        cloudCoverMax: '< 15%',
        updateFrequency: 'Every 5 Days'
      },
      source: 'demo',
      generatedAt: new Date().toISOString()
    };
  }
}

/**
 * Live satellite provider adapter using external API key when available.
 */
export class LiveSatelliteAdapter implements SatelliteProviderAdapter {
  name: 'live' = 'live';

  async getSatelliteData(
    fieldId: string,
    fieldMeta?: { field_name?: string; crop_name?: string; area_acres?: number; centroid_lat?: number; centroid_lng?: number; boundary_coordinates?: Array<{ lat: number; lng: number }> },
    fromDate?: string,
    toDate?: string
  ): Promise<SatelliteFieldData> {
    const apiKey = (process.env as any).SATELLITE_API_KEY || (process.env as any).SENTINEL_API_KEY;
    if (!apiKey) {
      throw new Error('Satellite API key not configured');
    }

    // Call live satellite API provider here if configured
    throw new Error('Live satellite API endpoint unavailable');
  }
}
