import { SatelliteFieldData, SatelliteObservation, NdviSummary, FieldZoneDetail } from './satellite.types.js';
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
 * Produces realistic NDVI metrics, time-series observations, zone details, and agricultural insights.
 */
export class DemoSatelliteAdapter implements SatelliteProviderAdapter {
  name: 'demo' = 'demo';

  async getSatelliteData(
    fieldId: string,
    fieldMeta?: { field_name?: string; crop_name?: string; area_acres?: number; centroid_lat?: number; centroid_lng?: number; boundary_coordinates?: Array<{ lat: number; lng: number }> },
    fromDate?: string,
    toDate?: string
  ): Promise<SatelliteFieldData> {
    const isPaddy = fieldId.includes('paddy') || fieldMeta?.crop_name?.toLowerCase().includes('rice') || fieldMeta?.crop_name?.toLowerCase().includes('paddy');
    const isVegetable = fieldId.includes('vegetable') || fieldId.includes('mustard') || fieldMeta?.crop_name?.toLowerCase().includes('vegetable');

    // Deterministic characteristics per demo field
    let name = fieldMeta?.field_name || (isPaddy ? 'North Paddy Plot' : isVegetable ? 'South Vegetable Plot' : 'East Wheat Parcel');
    let crop = fieldMeta?.crop_name || (isPaddy ? 'Rice (Paddy)' : isVegetable ? 'Vegetables' : 'Wheat');
    let acres = fieldMeta?.area_acres || (isPaddy ? 2.4 : isVegetable ? 1.8 : 3.8);
    let lat = fieldMeta?.centroid_lat || (isPaddy ? 22.0667 : isVegetable ? 22.0610 : 30.9010);
    let lng = fieldMeta?.centroid_lng || (isPaddy ? 88.0667 : isVegetable ? 88.0620 : 75.8573);

    const boundary = fieldMeta?.boundary_coordinates && fieldMeta.boundary_coordinates.length >= 3
      ? fieldMeta.boundary_coordinates
      : [
          { lat: lat + 0.0015, lng: lng - 0.0015 },
          { lat: lat + 0.0018, lng: lng + 0.0012 },
          { lat: lat - 0.0012, lng: lng + 0.0018 },
          { lat: lat - 0.0016, lng: lng - 0.0011 }
        ];

    // Seeded observations based on field:
    // North Paddy Plot: Healthy north/central zones with a stressed South-East zone (NDVI 0.62 overall, recent slight drop)
    // East Wheat Parcel: Vigorous growth (NDVI 0.74, improving trend)
    // South Vegetable Plot: Moderate growth (NDVI 0.52, watch status)
    const currentNdvi = isPaddy ? 0.62 : isVegetable ? 0.52 : 0.74;
    const prevNdvi = isPaddy ? 0.68 : isVegetable ? 0.49 : 0.70;
    const trend: 'IMPROVING' | 'STABLE' | 'DECLINING' = isPaddy ? 'DECLINING' : 'IMPROVING';

    const observations: SatelliteObservation[] = isPaddy ? [
      { date: '2026-03-15', ndvi: 0.35, vegetationHealth: 'MODERATE', cloudCover: 2.1, statusDescription: 'Initial tillering stage' },
      { date: '2026-04-15', ndvi: 0.54, vegetationHealth: 'HEALTHY', cloudCover: 1.8, statusDescription: 'Active vegetative growth' },
      { date: '2026-05-15', ndvi: 0.68, vegetationHealth: 'HEALTHY', cloudCover: 3.2, statusDescription: 'Peak canopy development' },
      { date: '2026-06-15', ndvi: 0.62, vegetationHealth: 'MODERATE', cloudCover: 1.5, statusDescription: 'Localized moisture stress in SE corner' }
    ] : isVegetable ? [
      { date: '2026-03-15', ndvi: 0.30, vegetationHealth: 'MODERATE', cloudCover: 1.4 },
      { date: '2026-04-15', ndvi: 0.42, vegetationHealth: 'MODERATE', cloudCover: 2.0 },
      { date: '2026-05-15', ndvi: 0.49, vegetationHealth: 'MODERATE', cloudCover: 1.1 },
      { date: '2026-06-15', ndvi: 0.52, vegetationHealth: 'HEALTHY', cloudCover: 0.9 }
    ] : [
      { date: '2026-03-15', ndvi: 0.45, vegetationHealth: 'MODERATE', cloudCover: 1.9 },
      { date: '2026-04-15', ndvi: 0.60, vegetationHealth: 'HEALTHY', cloudCover: 1.2 },
      { date: '2026-05-15', ndvi: 0.70, vegetationHealth: 'EXCELLENT', cloudCover: 0.8 },
      { date: '2026-06-15', ndvi: 0.74, vegetationHealth: 'EXCELLENT', cloudCover: 1.1 }
    ];

    // Interactive Field Zones for Demo
    const zones: FieldZoneDetail[] = isPaddy ? [
      {
        id: 'zone_nw',
        name: 'North-West Zone',
        ndvi: 0.74,
        vegetation: 'Healthy',
        status: 'Good',
        color: '#16A34A',
        description: 'Dense, uniform canopy cover with optimal water retention.',
        moisturePercent: 78
      },
      {
        id: 'zone_ne',
        name: 'North-East Zone',
        ndvi: 0.72,
        vegetation: 'Healthy',
        status: 'Good',
        color: '#16A34A',
        description: 'Vigorous vegetative growth and balanced nitrogen absorption.',
        moisturePercent: 74
      },
      {
        id: 'zone_sw',
        name: 'South-West Zone',
        ndvi: 0.58,
        vegetation: 'Moderate',
        status: 'Watch',
        color: '#D97706',
        description: 'Moderate crop density. Check for light drainage unevenness.',
        moisturePercent: 62
      },
      {
        id: 'zone_se',
        name: 'South-East Zone',
        ndvi: 0.28,
        vegetation: 'Stressed',
        status: 'Needs attention',
        color: '#DC2626',
        description: 'Low vegetation vigor. Irregular water distribution detected.',
        moisturePercent: 34
      }
    ] : [
      {
        id: 'zone_nw',
        name: 'North Zone',
        ndvi: 0.76,
        vegetation: 'Healthy',
        status: 'Good',
        color: '#16A34A',
        description: 'Healthy vegetation across top rows.',
        moisturePercent: 75
      },
      {
        id: 'zone_ne',
        name: 'Central Zone',
        ndvi: 0.72,
        vegetation: 'Healthy',
        status: 'Good',
        color: '#16A34A',
        description: 'Consistent canopy development.',
        moisturePercent: 72
      },
      {
        id: 'zone_sw',
        name: 'South Zone',
        ndvi: 0.65,
        vegetation: 'Healthy',
        status: 'Good',
        color: '#16A34A',
        description: 'Uniform tillering with good soil moisture.',
        moisturePercent: 68
      }
    ];

    const ndviSummary: NdviSummary = {
      currentNdvi,
      previousNdvi: prevNdvi,
      changePercentage: Math.round(((currentNdvi - prevNdvi) / prevNdvi) * 100 * 10) / 10,
      trend,
      healthStatus: currentNdvi >= 0.70 ? 'HEALTHY' : currentNdvi >= 0.50 ? 'MODERATE' : 'STRESSED',
      lastObservationDate: observations[observations.length - 1].date
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
      zones,
      interpretation: {
        headline: isPaddy
          ? 'Vegetation health is weaker than expected in the southern part of this field.'
          : `Steady Growth & Uniform Canopy (${crop})`,
        summary: isPaddy
          ? 'Most of your field has healthy vegetation, but a smaller southern section is showing lower vegetation activity.'
          : 'Satellite observations indicate balanced canopy greenness across the parcel.',
        recommendations: isPaddy
          ? [
              'Check irrigation in the stressed southern section for uneven water pooling or dryness.',
              'Review soil nutrient condition to see if phosphorus or nitrogen top-dressing is required.'
            ]
          : [
              'Maintain normal watering schedule.',
              'Proceed to soil health review for mid-season nutrient planning.'
            ],
        waterStatus: isPaddy ? 'Irregular in South-East Corner' : 'Adequate Soil Moisture',
        nitrogenLevel: isPaddy ? 'Moderate Canopy Coverage' : 'Good Canopy Cover (Sufficient N)',
        actionPriority: isPaddy ? 'HIGH' : 'LOW'
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
