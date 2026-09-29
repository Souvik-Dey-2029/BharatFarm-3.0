import { ApiClient } from '../../../services/apiClient.js';
import { ApiEnvelope, EndpointDoc } from './types.js';

export const ENDPOINT_DOCS: EndpointDoc[] = [
  {
    id: 'fields',
    method: 'GET',
    path: '/api/build-ai/api/fields/:id',
    summary: 'Field Boundary & Geometry API',
    description: 'Returns normalized field geometry, centroid coordinates, polygon boundary points, and crop metadata.',
    requiresAuth: true,
    sampleFieldId: 'field_demo_paddy_01',
    expectedResponseSnippet: `{\n  "success": true,\n  "data": {\n    "id": "field_demo_paddy_01",\n    "fieldName": "North Paddy Plot",\n    "cropName": "Rice (Paddy)",\n    "areaAcres": 5.2\n  },\n  "source": "demo"\n}`
  },
  {
    id: 'soil',
    method: 'GET',
    path: '/api/build-ai/api/soil/:fieldId',
    summary: 'Soil Health Diagnostic API',
    description: 'Returns normalized NPK ratings, soil organic carbon index, sub-indicators, and transparent restoration priorities.',
    requiresAuth: true,
    sampleFieldId: 'field_demo_wheat_02',
    expectedResponseSnippet: `{\n  "success": true,\n  "data": {\n    "score": 72,\n    "classification": "Moderate Health",\n    "deficiencies": ["Low Nitrogen"]\n  },\n  "source": "live"\n}`
  },
  {
    id: 'climate',
    method: 'GET',
    path: '/api/build-ai/api/climate/:fieldId',
    summary: 'Micro-Climate Telemetry API',
    description: 'Provides real-time temperature, relative humidity, wind speed, rainfall probability, and 7-day trend metrics.',
    requiresAuth: true,
    sampleFieldId: 'field_demo_paddy_01',
    expectedResponseSnippet: `{\n  "success": true,\n  "data": {\n    "current": { "temperatureCelsius": 29.5, "humidityPercent": 78 }\n  },\n  "source": "live"\n}`
  },
  {
    id: 'market',
    method: 'GET',
    path: '/api/build-ai/api/market/:fieldId',
    summary: 'Smart Mandi Price Intelligence API',
    description: 'Returns local mandi price benchmarks, 7-day price trajectory, and buyer demand indexing for the target crop.',
    requiresAuth: true,
    sampleFieldId: 'field_demo_mustard_03',
    expectedResponseSnippet: `{\n  "success": true,\n  "data": {\n    "modalPricePerQuintal": 2250,\n    "buyerDemandIndex": "HIGH"\n  },\n  "source": "demo"\n}`
  },
  {
    id: 'recommendation',
    method: 'GET',
    path: '/api/build-ai/api/recommendation/:fieldId',
    summary: 'Versioned Regenerative Recommendation API',
    description: 'Delivers structured, multi-horizon regenerative action recommendations (immediate, seasonal, soil, water, risk).',
    requiresAuth: true,
    sampleFieldId: 'field_demo_paddy_01',
    expectedResponseSnippet: `{\n  "success": true,\n  "data": {\n    "immediateActions": ["Apply organic bio-stimulant"],\n    "schemaVersion": "v1.0.0"\n  },\n  "source": "demo"\n}`
  },
  {
    id: 'openapi',
    method: 'GET',
    path: '/api/build-ai/api/openapi.json',
    summary: 'OpenAPI 3.0 Machine Specification',
    description: 'Full machine-readable OpenAPI specification documentation for third-party developer integration.',
    requiresAuth: false,
    sampleFieldId: 'none',
    expectedResponseSnippet: `{\n  "openapi": "3.0.3",\n  "info": { "title": "BharatFarm Track 4 API" }\n}`
  }
];

export class InteropClientService {
  static async testEndpoint(endpoint: EndpointDoc, fieldId: string): Promise<ApiEnvelope> {
    let url = endpoint.path.replace(':id', fieldId).replace(':fieldId', fieldId);
    if (endpoint.id === 'openapi') {
      url = '/api/build-ai/api/openapi.json';
    }

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        'Content-Type': 'application/json'
      }
    });

    const json = await res.json();
    return json;
  }
}
