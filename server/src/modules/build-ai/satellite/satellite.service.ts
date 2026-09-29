import { SatelliteFieldData } from './satellite.types.js';
import { LiveSatelliteAdapter, DemoSatelliteAdapter } from './providerAdapter.js';

export class SatelliteService {
  private liveAdapter = new LiveSatelliteAdapter();
  private demoAdapter = new DemoSatelliteAdapter();

  /**
   * Fetch satellite observation telemetry & vegetation index for a field.
   * Tries Live adapter first if key exists; falls back cleanly to seeded Demo adapter.
   */
  async getFieldSatelliteData(
    fieldId: string,
    fieldMeta?: { field_name?: string; crop_name?: string; area_acres?: number; centroid_lat?: number; centroid_lng?: number; boundary_coordinates?: Array<{ lat: number; lng: number }> },
    fromDate?: string,
    toDate?: string
  ): Promise<SatelliteFieldData> {
    try {
      if ((process.env as any).SATELLITE_API_KEY || (process.env as any).SENTINEL_API_KEY) {
        return await this.liveAdapter.getSatelliteData(fieldId, fieldMeta, fromDate, toDate);
      }
    } catch (err) {
      console.warn('[SatelliteService] Live adapter failed or unconfigured, falling back to Demo adapter:', (err as any)?.message);
    }

    return await this.demoAdapter.getSatelliteData(fieldId, fieldMeta, fromDate, toDate);
  }

  /**
   * Get default available satellite-monitored fields
   */
  getDefaultFields(): Array<{ id: string; field_name: string; crop_name: string; area_acres: number; location_address: string }> {
    return [
      {
        id: 'field_demo_paddy_01',
        field_name: 'North Paddy Plot',
        crop_name: 'Rice (Paddy)',
        area_acres: 5.2,
        location_address: 'Haldia Ag-Zone, West Bengal'
      },
      {
        id: 'field_demo_wheat_02',
        field_name: 'East Wheat Parcel',
        crop_name: 'Wheat',
        area_acres: 3.8,
        location_address: 'Ludhiana Ag-District, Punjab'
      },
      {
        id: 'field_demo_mustard_03',
        field_name: 'South Mustard Field',
        crop_name: 'Mustard',
        area_acres: 4.1,
        location_address: 'Jaipur Rural, Rajasthan'
      }
    ];
  }
}

export const satelliteService = new SatelliteService();
