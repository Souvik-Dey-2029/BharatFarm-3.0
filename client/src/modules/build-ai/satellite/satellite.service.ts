import { ApiClient } from '../../../services/apiClient.js';
import { ApiResponse } from '@bharatfarm/shared';
import { SatelliteFieldData, FieldZoneDetail } from '../types.js';
import { fieldMappingService, FieldRecord } from '../../sih/field-mapping/fieldMapping.service.js';

export class SatelliteClientService {
  /**
   * Fetch user fields combined with default satellite demo fields
   */
  async getAvailableFields(): Promise<Array<{ id: string; field_name: string; crop_name: string; area_acres: number; centroid_lat?: number; centroid_lng?: number; boundary_coordinates?: Array<{ lat: number; lng: number }> }>> {
    const savedFields: FieldRecord[] = await fieldMappingService.getSavedFields();

    const formattedSaved = savedFields.map(f => ({
      id: f.id || `field_${Date.now()}`,
      field_name: f.field_name,
      crop_name: f.crop_name,
      area_acres: f.area_acres || 2.4,
      centroid_lat: f.centroid_lat || f.latitude || 22.0667,
      centroid_lng: f.centroid_lng || f.longitude || 88.0667,
      boundary_coordinates: f.boundary_coordinates
    }));

    const defaultDemoFields = [
      {
        id: 'field_demo_paddy_01',
        field_name: 'North Paddy Plot',
        crop_name: 'Rice (Paddy)',
        area_acres: 2.4,
        centroid_lat: 22.0667,
        centroid_lng: 88.0667
      },
      {
        id: 'field_demo_vegetable_02',
        field_name: 'South Vegetable Plot',
        crop_name: 'Vegetables',
        area_acres: 1.8,
        centroid_lat: 22.0610,
        centroid_lng: 88.0620
      },
      {
        id: 'field_demo_wheat_03',
        field_name: 'East Wheat Parcel',
        crop_name: 'Wheat',
        area_acres: 3.8,
        centroid_lat: 30.9010,
        centroid_lng: 75.8573
      }
    ];

    // Combine user's saved fields with demo fields, keeping unique by id
    const combinedMap = new Map();
    [...formattedSaved, ...defaultDemoFields].forEach(f => {
      if (!combinedMap.has(f.id)) {
        combinedMap.set(f.id, f);
      }
    });

    return Array.from(combinedMap.values());
  }

  /**
   * Fetch satellite observation data from server API endpoint
   */
  async getSatelliteData(
    fieldId: string,
    meta?: { field_name?: string; crop_name?: string; area_acres?: number; centroid_lat?: number; centroid_lng?: number }
  ): Promise<ApiResponse<SatelliteFieldData>> {
    const query = new URLSearchParams();
    if (meta?.field_name) query.append('field_name', meta.field_name);
    if (meta?.crop_name) query.append('crop_name', meta.crop_name);
    if (meta?.area_acres) query.append('area_acres', String(meta.area_acres));
    if (meta?.centroid_lat) query.append('centroid_lat', String(meta.centroid_lat));
    if (meta?.centroid_lng) query.append('centroid_lng', String(meta.centroid_lng));

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const res = await ApiClient.get<SatelliteFieldData>(`/build-ai/satellite/fields/${fieldId}${queryString}`);

    if (res.success && res.data) {
      return res;
    }

    // Client-side offline fallback
    return {
      success: true,
      data: this.getOfflineDemoFallback(fieldId, meta)
    };
  }

  private getOfflineDemoFallback(
    fieldId: string,
    meta?: { field_name?: string; crop_name?: string; area_acres?: number; centroid_lat?: number; centroid_lng?: number }
  ): SatelliteFieldData {
    const isPaddy = fieldId.includes('paddy') || meta?.crop_name?.toLowerCase().includes('rice');
    const isVegetable = fieldId.includes('vegetable');

    const name = meta?.field_name || (isPaddy ? 'North Paddy Plot' : isVegetable ? 'South Vegetable Plot' : 'East Wheat Parcel');
    const crop = meta?.crop_name || (isPaddy ? 'Rice (Paddy)' : isVegetable ? 'Vegetables' : 'Wheat');
    const acres = meta?.area_acres || (isPaddy ? 2.4 : isVegetable ? 1.8 : 3.8);
    const lat = meta?.centroid_lat || 22.0667;
    const lng = meta?.centroid_lng || 88.0667;

    const currentNdvi = isPaddy ? 0.62 : isVegetable ? 0.52 : 0.74;
    const prevNdvi = isPaddy ? 0.68 : isVegetable ? 0.49 : 0.70;

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

    return {
      field: {
        id: fieldId,
        field_name: name,
        crop_name: crop,
        area_acres: acres,
        centroid_lat: lat,
        centroid_lng: lng,
        boundary_coordinates: [
          { lat: lat + 0.0015, lng: lng - 0.0015 },
          { lat: lat + 0.0018, lng: lng + 0.0012 },
          { lat: lat - 0.0012, lng: lng + 0.0018 },
          { lat: lat - 0.0016, lng: lng - 0.0011 }
        ],
        location_address: 'Haldia Ag-Zone, West Bengal (Offline Demo)'
      },
      observations: [
        { date: '2026-03-15', ndvi: 0.35, vegetationHealth: 'MODERATE', cloudCover: 2.1 },
        { date: '2026-04-15', ndvi: 0.54, vegetationHealth: 'HEALTHY', cloudCover: 1.8 },
        { date: '2026-05-15', ndvi: 0.68, vegetationHealth: 'HEALTHY', cloudCover: 3.2 },
        { date: '2026-06-15', ndvi: 0.62, vegetationHealth: 'MODERATE', cloudCover: 1.5 }
      ],
      ndviSummary: {
        currentNdvi,
        previousNdvi: prevNdvi,
        changePercentage: -8.8,
        trend: isPaddy ? 'DECLINING' : 'IMPROVING',
        healthStatus: currentNdvi >= 0.70 ? 'HEALTHY' : currentNdvi >= 0.50 ? 'MODERATE' : 'STRESSED',
        lastObservationDate: '2026-06-15'
      },
      zones,
      interpretation: {
        headline: isPaddy
          ? 'Vegetation health is weaker than expected in part of this field.'
          : `Steady Growth & Uniform Canopy (${crop})`,
        summary: isPaddy
          ? 'Most of your field has healthy vegetation, but a smaller southern section is showing lower vegetation activity.'
          : 'Satellite observations indicate balanced canopy greenness across the parcel.',
        recommendations: isPaddy
          ? [
              'Check irrigation in the stressed southern area for uneven watering.',
              'Review soil nutrient condition to check nitrogen and organic matter levels.'
            ]
          : [
              'Maintain normal watering schedule.',
              'Check soil nutrient levels for upcoming top-dressing.'
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

export const satelliteClientService = new SatelliteClientService();
