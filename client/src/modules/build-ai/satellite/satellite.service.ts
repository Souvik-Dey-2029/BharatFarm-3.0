import { ApiClient } from '../../../services/apiClient.js';
import { ApiResponse } from '@bharatfarm/shared';
import { SatelliteFieldData } from '../types.js';
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
      area_acres: f.area_acres || 4.2,
      centroid_lat: f.centroid_lat || f.latitude || 22.0667,
      centroid_lng: f.centroid_lng || f.longitude || 88.0667,
      boundary_coordinates: f.boundary_coordinates
    }));

    const defaultDemoFields = [
      {
        id: 'field_demo_paddy_01',
        field_name: 'North Paddy Plot',
        crop_name: 'Rice (Paddy)',
        area_acres: 5.2,
        centroid_lat: 22.0667,
        centroid_lng: 88.0667
      },
      {
        id: 'field_demo_wheat_02',
        field_name: 'East Wheat Parcel',
        crop_name: 'Wheat',
        area_acres: 3.8,
        centroid_lat: 30.9010,
        centroid_lng: 75.8573
      },
      {
        id: 'field_demo_mustard_03',
        field_name: 'South Mustard Field',
        crop_name: 'Mustard',
        area_acres: 4.1,
        centroid_lat: 26.9124,
        centroid_lng: 75.7873
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
    const name = meta?.field_name || 'North Paddy Plot';
    const crop = meta?.crop_name || 'Rice (Paddy)';
    const acres = meta?.area_acres || 4.5;
    const lat = meta?.centroid_lat || 22.0667;
    const lng = meta?.centroid_lng || 88.0667;

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
        location_address: 'Haldia Ag-Zone, West Bengal (Offline Cached)'
      },
      observations: [
        { date: '2026-08-01', ndvi: 0.35, vegetationHealth: 'MODERATE', cloudCover: 3.2 },
        { date: '2026-08-15', ndvi: 0.52, vegetationHealth: 'HEALTHY', cloudCover: 2.1 },
        { date: '2026-09-01', ndvi: 0.68, vegetationHealth: 'HEALTHY', cloudCover: 1.5 },
        { date: '2026-09-15', ndvi: 0.74, vegetationHealth: 'EXCELLENT', cloudCover: 0.8 },
        { date: '2026-09-28', ndvi: 0.78, vegetationHealth: 'EXCELLENT', cloudCover: 1.2 }
      ],
      ndviSummary: {
        currentNdvi: 0.78,
        previousNdvi: 0.74,
        changePercentage: 5.4,
        trend: 'IMPROVING',
        healthStatus: 'EXCELLENT',
        lastObservationDate: '2026-09-28'
      },
      interpretation: {
        headline: `Strong Crop Canopy & Healthy Index (${crop})`,
        summary: `Vegetation health index is strong at 0.78 (NDVI). Canopy coverage is uniform across ~88% of the boundary with adequate moisture retention.`,
        recommendations: [
          'Maintain scheduled irrigation interval over the next 5 days.',
          'Apply secondary nitrogen top-dressing (Urea @ 25 kg/acre) before mid-stage tillering.',
          'Monitor lower leaves for early fungal leaf spot indicators due to high humidity.'
        ],
        waterStatus: 'Adequate Soil Moisture',
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

export const satelliteClientService = new SatelliteClientService();
