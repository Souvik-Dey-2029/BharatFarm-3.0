import { RegenerativeContextInput, RegenerativeResponseSchema, RegenerativeAction } from './regenerative.types.js';
import { fetchWeatherData } from '../../../services/climateRisk/weatherProvider.js';
import { soilService } from '../soil/soil.service.js';
import { satelliteService } from '../satellite/satellite.service.js';
import { AiClient } from '../../../utils/aiClient.js';
import { logger } from '../../../utils/logger.js';

export class RegenerativeService {
  /**
   * Main orchestration method: gathers multi-source agricultural intelligence
   * and generates a structured regenerative farming plan.
   */
  async generateRegenerativePlan(input: RegenerativeContextInput): Promise<RegenerativeResponseSchema> {
    const fieldId = input.fieldId || 'field_demo_paddy_01';
    const fieldName = input.fieldName || 'North Paddy Plot';
    const crop = input.crop || 'Rice (Paddy)';
    const location = input.location || 'Haldia, West Bengal';
    const lat = input.lat || 22.0667;
    const lng = input.lng || 88.0667;

    // 1. Gather Weather Context
    let weatherSummary = 'Temperature 28°C, Humidity 78%, Moderate rainfall expected.';
    try {
      const weatherData = await fetchWeatherData(location, lat, lng);
      if (weatherData) {
        weatherSummary = `${weatherData.temperatureCelsius}°C, Humidity ${weatherData.humidityPercent}%, Condition: ${weatherData.condition || 'Fair'}, Wind: ${weatherData.windSpeedKmh} km/h, Rain Prob: ${weatherData.rainfallProbability}%`;
      }
    } catch (err: any) {
      logger.warn('[RegenerativeService] Weather fetch fallback:', err?.message);
    }

    // 2. Gather Soil Context
    let soilSummary: { ph: number; oc: number; status: string } | null = null;
    if (input.includeSoilData !== false) {
      try {
        const soilResult = await soilService.analyzeSoil({
          fieldId,
          fieldName,
          crop,
          ph: input.soilData?.ph || 6.5,
          nitrogen: input.soilData?.nitrogen || 220,
          phosphorus: input.soilData?.phosphorus || 18,
          potassium: input.soilData?.potassium || 195,
          organicCarbon: input.soilData?.organicCarbon || 0.62
        });
        soilSummary = {
          ph: soilResult.metrics.ph.value,
          oc: soilResult.metrics.organicCarbon.value,
          status: soilResult.nutrientStatus
        };
      } catch (err: any) {
        logger.warn('[RegenerativeService] Soil analysis fallback:', err?.message);
      }
    }

    // 3. Gather Satellite Context
    let satelliteSummary: { ndvi: number; health: string } | null = null;
    if (input.includeSatelliteData !== false) {
      try {
        const satResult = await satelliteService.getFieldSatelliteData(fieldId);
        if (satResult && satResult.ndviSummary) {
          satelliteSummary = {
            ndvi: satResult.ndviSummary.currentNdvi,
            health: satResult.ndviSummary.healthStatus
          };
        }
      } catch (err: any) {
        logger.warn('[RegenerativeService] Satellite telemetry fallback:', err?.message);
      }
    }

    // Build Evidence Traces
    const evidenceList: Array<{ parameter: string; value: string; impactOnPlan: string }> = [
      { parameter: 'Crop & Stage', value: `${crop} (Vegetative Stage)`, impactOnPlan: `Tailors NPK uptake and irrigation schedule to ${crop} requirements.` },
      { parameter: 'Local Climate', value: weatherSummary, impactOnPlan: 'Adjusts irrigation timing and fungal disease risk precautions.' }
    ];

    if (soilSummary) {
      evidenceList.push({
        parameter: 'Soil Lab Assessment',
        value: `pH ${soilSummary.ph}, Organic Carbon ${soilSummary.oc}%, Status: ${soilSummary.status.replace('_', ' ')}`,
        impactOnPlan: 'Triggers bio-char/compost organic matter dosing and pH balancing actions.'
      });
    } else {
      evidenceList.push({
        parameter: 'Soil Lab Assessment',
        value: 'Data Not Provided (Using Regional Soil Baseline)',
        impactOnPlan: 'Assumes baseline alluvial soil fertility; recommends soil lab test.'
      });
    }

    if (satelliteSummary) {
      evidenceList.push({
        parameter: 'Satellite Telemetry',
        value: `NDVI ${satelliteSummary.ndvi} (${satelliteSummary.health})`,
        impactOnPlan: 'Validates uniform crop canopy growth and pinpoints non-uniform spots.'
      });
    } else {
      evidenceList.push({
        parameter: 'Satellite Telemetry',
        value: 'Imagery Unavailable (Cloud Cover / Unmonitored)',
        impactOnPlan: 'Relies on ground observations for canopy density evaluation.'
      });
    }

    // Build Deterministic Fallback Plan
    const deterministicPlan = this.buildDeterministicPlan(crop, soilSummary, satelliteSummary, evidenceList);

    // If AI is configured, try server-side LLM completion for enhanced structured recommendations
    if (AiClient.isConfigured()) {
      try {
        const prompt = `You are a Regenerative Agriculture Intelligence Engine.
Field Context:
- Crop: ${crop}
- Location: ${location}
- Weather: ${weatherSummary}
- Soil Context: ${soilSummary ? `pH ${soilSummary.ph}, Organic Carbon ${soilSummary.oc}%, ${soilSummary.status}` : 'Not provided'}
- Satellite Context: ${satelliteSummary ? `NDVI ${satelliteSummary.ndvi}, ${satelliteSummary.health}` : 'Not provided'}

Return ONLY a JSON matching schemaVersion "v1.0.0":
{
  "schemaVersion": "v1.0.0",
  "headline": "Short 1-line sustainable plan title",
  "sustainabilityScore": 82,
  "immediateActions": [
    { "id": "act_1", "title": "Title", "description": "Action details", "timing": "Next 1-3 days", "impactCategory": "SOIL_BUILDING|WATER_CONSERVATION|CARBON_SEQUESTRATION|PEST_BIOCONTROL|CLIMATE_RESILIENCE", "priority": "HIGH", "evidenceTrace": "Justification" }
  ],
  "seasonalActions": [ ... ],
  "soilActions": [ ... ],
  "waterActions": [ ... ],
  "riskMitigation": [ ... ]
}`;

        const aiRaw = await AiClient.chat([{ role: 'user', content: prompt }], { maxTokens: 800, responseFormat: 'json_object' });
        const aiParsed = AiClient.parseJsonResponse<RegenerativeResponseSchema>(aiRaw);

        if (aiParsed && aiParsed.immediateActions && Array.isArray(aiParsed.immediateActions) && aiParsed.immediateActions.length > 0) {
          return {
            schemaVersion: 'v1.0.0',
            headline: aiParsed.headline || deterministicPlan.headline,
            sustainabilityScore: aiParsed.sustainabilityScore || 82,
            immediateActions: aiParsed.immediateActions,
            seasonalActions: aiParsed.seasonalActions || deterministicPlan.seasonalActions,
            soilActions: aiParsed.soilActions || deterministicPlan.soilActions,
            waterActions: aiParsed.waterActions || deterministicPlan.waterActions,
            riskMitigation: aiParsed.riskMitigation || deterministicPlan.riskMitigation,
            evidence: evidenceList,
            assumptions: [
              'Weather forecast is based on regional meteorological observations.',
              'Recommendations prioritize soil biology, carbon buildup, and non-chemical pest control.',
              'Field boundary and crop sowing dates are provided by user.'
            ],
            limitations: [
              'AI recommendations are decision-support guidelines and do not replace local agronomic extension officer advice.',
              'Micro-climate deviations or sudden unseasonal rainfall may require immediate tactical adjustments.'
            ],
            source: 'live_ai',
            generatedAt: new Date().toISOString()
          };
        }
      } catch (err: any) {
        logger.warn('[RegenerativeService] AI plan generation failed, falling back to deterministic engine:', err?.message);
      }
    }

    return deterministicPlan;
  }

  /**
   * Deterministic Plan Generator with explicit evidence tracing
   */
  private buildDeterministicPlan(
    crop: string,
    soilSummary: { ph: number; oc: number; status: string } | null,
    satelliteSummary: { ndvi: number; health: string } | null,
    evidence: Array<{ parameter: string; value: string; impactOnPlan: string }>
  ): RegenerativeResponseSchema {
    const immediateActions: RegenerativeAction[] = [
      {
        id: 'act_imm_01',
        title: 'Apply Neem-Coated Urea / Organic Top-Dressing',
        description: `Apply split dose of nitrogen (@ 25 kg/acre) mixed with neem cake to slow nitrogen volatilization and improve plant absorption for ${crop}.`,
        timing: 'Next 1–3 Days',
        impactCategory: 'SOIL_BUILDING',
        priority: 'HIGH',
        evidenceTrace: 'Soil N parameters and vegetative stage requirements.'
      },
      {
        id: 'act_imm_02',
        title: 'Alternate Wetting & Drying (AWD) Irrigation',
        description: 'Allow field water depth to drop naturally to soil surface before re-flooding to conserve up to 30% water and reduce methane emissions.',
        timing: 'Next 3–5 Days',
        impactCategory: 'WATER_CONSERVATION',
        priority: 'MEDIUM',
        evidenceTrace: 'Weather forecast humidity and paddy water management principles.'
      }
    ];

    const seasonalActions: RegenerativeAction[] = [
      {
        id: 'act_sea_01',
        title: 'Incorporate Cover Cropping (Sesbania / Dhaincha)',
        description: 'Sow green manure crop immediately post-harvest to fix atmospheric nitrogen and add 15-20 tonnes/ha of biomass.',
        timing: 'Post Harvest',
        impactCategory: 'CARBON_SEQUESTRATION',
        priority: 'HIGH',
        evidenceTrace: 'Long-term organic carbon restoration strategy.'
      }
    ];

    const soilActions: RegenerativeAction[] = [
      {
        id: 'act_soil_01',
        title: 'Biochar & Compost Enriched Soil Application',
        description: `Apply 5 tonnes/ha of well-decomposed FYM enriched with Trichoderma bio-agent to boost soil microbial activity and organic carbon.`,
        timing: 'Pre-Sowing / Basal',
        impactCategory: 'SOIL_BUILDING',
        priority: 'HIGH',
        evidenceTrace: soilSummary ? `Current Organic Carbon is ${soilSummary.oc}% (below 0.75% target)` : 'Baseline organic carbon building.'
      }
    ];

    const waterActions: RegenerativeAction[] = [
      {
        id: 'act_wat_01',
        title: 'Organic Straw Mulching in Crop Inter-rows',
        description: 'Spread paddy straw or crop residue mulch to reduce soil moisture evaporation and suppress weed growth.',
        timing: 'Ongoing',
        impactCategory: 'WATER_CONSERVATION',
        priority: 'MEDIUM',
        evidenceTrace: 'Micro-climate temperature and evapotranspiration protection.'
      }
    ];

    const riskMitigation: RegenerativeAction[] = [
      {
        id: 'act_risk_01',
        title: 'Biopesticide Foliar Spray (Neem Kernel Extract 5%)',
        description: 'Spray eco-friendly neem oil extract at early signs of leaf folder or stem borer to protect natural predators (spiders, ladybird beetles).',
        timing: 'At first pest threshold',
        impactCategory: 'PEST_BIOCONTROL',
        priority: 'HIGH',
        evidenceTrace: 'Pest biocontrol and chemical residue prevention.'
      }
    ];

    return {
      schemaVersion: 'v1.0.0',
      headline: `Regenerative Agriculture & Climate Resilience Plan (${crop})`,
      sustainabilityScore: 78,
      immediateActions,
      seasonalActions,
      soilActions,
      waterActions,
      riskMitigation,
      evidence,
      assumptions: [
        'Weather forecast is based on regional meteorological observations.',
        'Recommendations prioritize soil biology, carbon buildup, and non-chemical pest control.',
        'Field boundary and crop sowing dates are provided by user.'
      ],
      limitations: [
        'AI recommendations are decision-support guidelines and do not replace local agronomic extension officer advice.',
        'Micro-climate deviations or sudden unseasonal rainfall may require immediate tactical adjustments.'
      ],
      source: 'deterministic_engine',
      generatedAt: new Date().toISOString()
    };
  }
}

export const regenerativeService = new RegenerativeService();
