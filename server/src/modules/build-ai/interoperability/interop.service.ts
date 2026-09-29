import { satelliteService } from '../satellite/satellite.service.js';
import { soilService } from '../soil/soil.service.js';
import { regenerativeService } from '../regenerative/regenerative.service.js';
import { fetchWeatherData } from '../../../services/climateRisk/weatherProvider.js';
import { ApiEnvelope } from './interop.types.js';

export class InteropService {
  /**
   * Helper to format consistent API response envelope
   */
  private formatEnvelope<T>(data: T, source: 'live' | 'demo' | 'synthetic' = 'demo', fieldId?: string): ApiEnvelope<T> {
    return {
      success: true,
      data,
      source,
      generatedAt: new Date().toISOString(),
      ...(fieldId ? { fieldId } : {})
    };
  }

  /**
   * GET /api/build-ai/api/fields/:id
   */
  async getFieldById(fieldId: string): Promise<ApiEnvelope> {
    const satelliteData = await satelliteService.getFieldSatelliteData(fieldId);
    return this.formatEnvelope({
      id: satelliteData.field.id,
      fieldName: satelliteData.field.field_name,
      cropName: satelliteData.field.crop_name,
      areaAcres: satelliteData.field.area_acres,
      locationAddress: satelliteData.field.location_address,
      centroid: {
        lat: satelliteData.field.centroid_lat,
        lng: satelliteData.field.centroid_lng
      },
      boundaryCoordinates: satelliteData.field.boundary_coordinates
    }, satelliteData.source as any, fieldId);
  }

  /**
   * GET /api/build-ai/api/soil/:fieldId
   */
  async getSoilHealthByFieldId(fieldId: string): Promise<ApiEnvelope> {
    const soilResult = await soilService.analyzeSoil({
      fieldId,
      crop: 'Rice (Paddy)',
      ph: 6.5,
      nitrogen: 240,
      phosphorus: 18,
      potassium: 195,
      organicCarbon: 0.55
    });

    return this.formatEnvelope(soilResult, (soilResult.source === 'live_ai' ? 'live' : 'demo'), fieldId);
  }

  /**
   * GET /api/build-ai/api/climate/:fieldId
   */
  async getClimateByFieldId(fieldId: string): Promise<ApiEnvelope> {
    const weather = await fetchWeatherData('Haldia, West Bengal', 22.0667, 88.0667);
    return this.formatEnvelope({
      location: weather.location,
      current: {
        temperatureCelsius: weather.temperatureCelsius,
        humidityPercent: weather.humidityPercent,
        condition: weather.condition,
        windSpeedKmh: weather.windSpeedKmh,
        rainfallProbability: weather.rainfallProbability
      },
      recentTrend: {
        sevenDayAvgTempCelsius: 29.5,
        sevenDayTotalRainfallMm: 42.0,
        heatStressDays: 0,
        floodRisk: 'MODERATE'
      }
    }, 'live', fieldId);
  }

  /**
   * GET /api/build-ai/api/market/:fieldId
   */
  async getMarketDataByFieldId(fieldId: string): Promise<ApiEnvelope> {
    return this.formatEnvelope({
      crop: 'Rice (Paddy)',
      primaryMandi: 'Haldia Central Ag-Market',
      distanceKm: 12.4,
      modalPricePerQuintal: 2250,
      minPricePerQuintal: 2100,
      maxPricePerQuintal: 2380,
      priceTrendSevenDays: '+4.2%',
      buyerDemandIndex: 'HIGH',
      recommendedAction: 'HOLD_3_DAYS'
    }, 'demo', fieldId);
  }

  /**
   * GET /api/build-ai/api/recommendation/:fieldId
   */
  async getRecommendationByFieldId(fieldId: string): Promise<ApiEnvelope> {
    const plan = await regenerativeService.generateRegenerativePlan({
      fieldId,
      fieldName: 'North Paddy Plot',
      crop: 'Rice (Paddy)',
      location: 'Haldia, West Bengal',
      includeSoilData: true,
      includeSatelliteData: true
    });

    return this.formatEnvelope({
      schemaVersion: plan.schemaVersion,
      headline: plan.headline,
      sustainabilityScore: plan.sustainabilityScore,
      immediateActions: plan.immediateActions,
      seasonalActions: plan.seasonalActions,
      soilActions: plan.soilActions,
      waterActions: plan.waterActions,
      riskMitigation: plan.riskMitigation,
      evidence: plan.evidence,
      assumptions: plan.assumptions,
      limitations: plan.limitations
    }, (plan.source === 'live_ai' ? 'live' : 'demo'), fieldId);
  }

  /**
   * GET /api/build-ai/api/openapi.json
   */
  getOpenApiSpec() {
    return {
      openapi: '3.0.3',
      info: {
        title: 'BharatFarm Track 4 Interoperable Agriculture API',
        version: '1.0.0',
        description: 'Normalized, interoperable REST API endpoints for sharing field boundary data, satellite telemetry, soil health diagnostics, micro-climate weather, mandi pricing, and regenerative AI recommendations.'
      },
      servers: [
        {
          url: '/api/build-ai/api',
          description: 'BharatFarm Interoperability Gateway'
        }
      ],
      paths: {
        '/fields/{id}': {
          get: {
            summary: 'Get Field Metadata & Boundary Coordinates',
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
            responses: { 200: { description: 'Field geometry and crop details envelope' } }
          }
        },
        '/soil/{fieldId}': {
          get: {
            summary: 'Get Soil Health Assessment & Sub-indicators',
            parameters: [{ name: 'fieldId', in: 'path', required: true, schema: { type: 'string' } }],
            responses: { 200: { description: 'Normalized soil score and NPK classification envelope' } }
          }
        },
        '/climate/{fieldId}': {
          get: {
            summary: 'Get Micro-Climate & Weather Telemetry',
            parameters: [{ name: 'fieldId', in: 'path', required: true, schema: { type: 'string' } }],
            responses: { 200: { description: 'Live or cached weather telemetry envelope' } }
          }
        },
        '/market/{fieldId}': {
          get: {
            summary: 'Get Mandi Price Intelligence for Field Crop',
            parameters: [{ name: 'fieldId', in: 'path', required: true, schema: { type: 'string' } }],
            responses: { 200: { description: 'Mandi price metrics and buyer demand index' } }
          }
        },
        '/recommendation/{fieldId}': {
          get: {
            summary: 'Get Versioned Regenerative Action Plan',
            parameters: [{ name: 'fieldId', in: 'path', required: true, schema: { type: 'string' } }],
            responses: { 200: { description: 'Structured multi-horizon regenerative recommendations' } }
          }
        }
      }
    };
  }
}

export const interopService = new InteropService();
