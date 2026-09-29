import { SoilAnalysisInput, SoilAnalysisResult, MetricDetail, NutrientLevelStatus, SoilRecommendation } from './soil.types.js';
import { AiClient } from '../../../utils/aiClient.js';
import { logger } from '../../../utils/logger.js';

export class SoilService {
  private reportHistory: Map<string, SoilAnalysisResult[]> = new Map();

  /**
   * Validate & normalize user input
   */
  validateInput(input: Partial<SoilAnalysisInput>): SoilAnalysisInput {
    const ph = typeof input.ph === 'number' ? Math.max(0, Math.min(14, input.ph)) : 6.5;
    const nitrogen = typeof input.nitrogen === 'number' ? Math.max(0, Math.min(1000, input.nitrogen)) : 240;
    const phosphorus = typeof input.phosphorus === 'number' ? Math.max(0, Math.min(500, input.phosphorus)) : 25;
    const potassium = typeof input.potassium === 'number' ? Math.max(0, Math.min(1000, input.potassium)) : 180;
    const organicCarbon = typeof input.organicCarbon === 'number' ? Math.max(0, Math.min(10, input.organicCarbon)) : 0.65;
    const crop = input.crop && input.crop.trim() ? input.crop.trim() : 'Rice (Paddy)';
    const fieldId = input.fieldId || 'field_demo_paddy_01';
    const fieldName = input.fieldName || 'North Paddy Plot';

    return {
      fieldId,
      fieldName,
      crop,
      ph,
      nitrogen,
      phosphorus,
      potassium,
      organicCarbon
    };
  }

  /**
   * Main soil analysis orchestration
   */
  async analyzeSoil(rawInput: Partial<SoilAnalysisInput>): Promise<SoilAnalysisResult> {
    const input = this.validateInput(rawInput);

    // Step 1: Deterministic metric scoring & status calculation
    const phMetric = this.evalPh(input.ph);
    const nMetric = this.evalNitrogen(input.nitrogen);
    const pMetric = this.evalPhosphorus(input.phosphorus);
    const kMetric = this.evalPotassium(input.potassium);
    const ocMetric = this.evalOrganicCarbon(input.organicCarbon);

    // Compute sub-scores & overall composite Soil Health Score (0-100)
    const phScore = phMetric.status === 'OPTIMAL' ? 100 : phMetric.status === 'MODERATE' ? 75 : 40;
    const npkScore = (
      (nMetric.status === 'OPTIMAL' ? 100 : nMetric.status === 'LOW' ? 60 : 40) +
      (pMetric.status === 'OPTIMAL' ? 100 : pMetric.status === 'LOW' ? 60 : 40) +
      (kMetric.status === 'OPTIMAL' ? 100 : kMetric.status === 'LOW' ? 60 : 40)
    ) / 3;
    const ocScore = ocMetric.status === 'OPTIMAL' ? 100 : ocMetric.status === 'MODERATE' ? 70 : 40;

    const compositeScore = Math.round((phScore * 0.25) + (npkScore * 0.50) + (ocScore * 0.25));

    let nutrientStatus: SoilAnalysisResult['nutrientStatus'] = 'MODERATE_FERTILITY';
    if (compositeScore >= 85) nutrientStatus = 'EXCELLENT';
    else if (compositeScore >= 70) nutrientStatus = 'HIGH_FERTILITY';
    else if (compositeScore >= 55) nutrientStatus = 'MODERATE_FERTILITY';
    else if (compositeScore >= 40) nutrientStatus = 'NEEDS_IMPROVEMENT';
    else nutrientStatus = 'DEGRADED';

    // Warnings detection
    const warnings: string[] = [];
    if (input.ph < 5.5) warnings.push(`Soil is strongly acidic (pH ${input.ph}). Nutrient availability (especially P & Mg) is restricted.`);
    if (input.ph > 8.5) warnings.push(`Soil is alkaline (pH ${input.ph}). Micronutrient deficiencies (Zinc, Iron) may occur.`);
    if (nMetric.status === 'LOW' || nMetric.status === 'CRITICAL_LOW') warnings.push('Nitrogen is below optimal threshold. Crop canopy expansion may be stunted.');
    if (pMetric.status === 'LOW' || pMetric.status === 'CRITICAL_LOW') warnings.push('Phosphorus deficiency detected. Root establishment and early tillering will be impaired.');
    if (ocMetric.status === 'LOW' || ocMetric.status === 'CRITICAL_LOW') warnings.push('Organic carbon is critical (< 0.5%). Soil microbial activity and water holding capacity are low.');

    // Default deterministic recommendations
    const defaultRecs: SoilRecommendation[] = [
      {
        type: 'ORGANIC_MATTER',
        title: 'Apply Farm Yard Manure (FYM)',
        description: 'Incorporate 5-8 tonnes/ha of well-decomposed compost or vermicompost prior to field preparation to build organic carbon.',
        actionPriority: ocScore < 70 ? 'HIGH' : 'MEDIUM'
      },
      {
        type: 'NUTRIENT_CORRECTION',
        title: 'Balanced NPK Basal Application',
        description: `Apply split dose of nitrogen (@ 50 kg N/ha) and full recommended phosphorus (@ 40 kg P2O5/ha) during final land preparation for ${input.crop}.`,
        actionPriority: npkScore < 70 ? 'HIGH' : 'MEDIUM'
      }
    ];

    if (input.ph < 6.0) {
      defaultRecs.push({
        type: 'PH_BALANCING',
        title: 'Agricultural Lime Application',
        description: 'Broadcast agricultural lime (calcium carbonate @ 500 kg/ha) 3 weeks before planting to neutralize acidity.',
        actionPriority: 'HIGH'
      });
    } else if (input.ph > 8.0) {
      defaultRecs.push({
        type: 'PH_BALANCING',
        title: 'Gypsum / Sulfur Soil Conditioning',
        description: 'Apply agricultural gypsum @ 1 tonne/ha and incorporate green manure (Dhaincha/Sesbania) to amend alkalinity.',
        actionPriority: 'HIGH'
      });
    }

    const cropName = input.crop || 'Rice (Paddy)';
    const fieldIdVal = input.fieldId || 'field_demo_paddy_01';

    const deterministicResult: SoilAnalysisResult = {
      score: compositeScore,
      metrics: {
        ph: phMetric,
        nitrogen: nMetric,
        phosphorus: pMetric,
        potassium: kMetric,
        organicCarbon: ocMetric
      },
      nutrientStatus,
      cropContext: {
        crop: cropName,
        suitabilityScore: Math.min(100, Math.max(50, compositeScore + 5)),
        summary: `Soil parameters are ${nutrientStatus.replace('_', ' ').toLowerCase()} for growing ${cropName}.`
      },
      recommendations: defaultRecs,
      warnings,
      source: 'deterministic',
      generatedAt: new Date().toISOString()
    };

    // Step 2: Try AI-enhanced explanation & recommendation via server-side AiClient if configured
    if (AiClient.isConfigured()) {
      try {
        const prompt = `You are a Soil Health AI Specialist for Indian Agriculture.
Analyze these soil lab parameters:
- Crop: ${cropName}
- pH: ${input.ph}
- Nitrogen (N): ${input.nitrogen} kg/ha
- Phosphorus (P): ${input.phosphorus} kg/ha
- Potassium (K): ${input.potassium} kg/ha
- Organic Carbon: ${input.organicCarbon}%
- Soil Health Score: ${compositeScore}/100

Return ONLY a valid JSON object matching this structure:
{
  "summary": "2 short sentences evaluating soil suitability for ${cropName}.",
  "recommendations": [
    {
      "type": "ORGANIC_MATTER|NUTRIENT_CORRECTION|PH_BALANCING|IRRIGATION|GENERAL",
      "title": "Short title",
      "description": "Specific actionable dosage advice for Indian farmers.",
      "actionPriority": "LOW|MEDIUM|HIGH|URGENT"
    }
  ]
}`;

        const aiRaw = await AiClient.chat([{ role: 'user', content: prompt }], { maxTokens: 400, responseFormat: 'json_object' });
        const aiParsed = AiClient.parseJsonResponse<{ summary: string; recommendations: SoilRecommendation[] }>(aiRaw);

        if (aiParsed && Array.isArray(aiParsed.recommendations) && aiParsed.recommendations.length > 0) {
          return {
            ...deterministicResult,
            cropContext: {
              crop: cropName,
              suitabilityScore: Math.min(100, Math.max(50, compositeScore + 5)),
              summary: aiParsed.summary || deterministicResult.cropContext.summary
            },
            recommendations: aiParsed.recommendations,
            source: 'live_ai'
          };
        }
      } catch (err: any) {
        logger.warn('[SoilService] AI explanation generation failed, using deterministic fallback:', err.message);
      }
    }

    // Save to in-memory history cache
    this.saveReportToHistory(fieldIdVal, deterministicResult);

    return deterministicResult;
  }

  /**
   * Save report to field history
   */
  private saveReportToHistory(fieldId: string, result: SoilAnalysisResult) {
    const list = this.reportHistory.get(fieldId) || [];
    list.unshift(result);
    this.reportHistory.set(fieldId, list.slice(0, 20));
  }

  /**
   * Get historical soil reports for a field
   */
  getHistory(fieldId: string): SoilAnalysisResult[] {
    return this.reportHistory.get(fieldId) || [];
  }

  // --- Metric Evaluators ---
  private evalPh(ph: number): MetricDetail {
    let status: NutrientLevelStatus = 'OPTIMAL';
    let desc = 'Slightly acidic to neutral pH — ideal for nutrient uptake.';
    if (ph < 5.0) { status = 'CRITICAL_LOW'; desc = 'Strongly acidic — lime application required.'; }
    else if (ph < 6.0) { status = 'LOW'; desc = 'Moderately acidic — monitor P availability.'; }
    else if (ph > 8.5) { status = 'EXCESSIVE'; desc = 'Strongly alkaline — gypsum/sulfur amendment required.'; }
    else if (ph > 7.5) { status = 'HIGH'; desc = 'Slightly alkaline — potential micronutrient tie-up.'; }

    return { value: ph, status, unit: 'pH', idealRange: '6.0 - 7.5', description: desc };
  }

  private evalNitrogen(n: number): MetricDetail {
    let status: NutrientLevelStatus = 'OPTIMAL';
    let desc = 'Sufficient available nitrogen for vegetative canopy growth.';
    if (n < 140) { status = 'CRITICAL_LOW'; desc = 'Deficient — yellowing of lower leaves expected.'; }
    else if (n < 240) { status = 'LOW'; desc = 'Below target — top-dressing urea recommended.'; }
    else if (n > 450) { status = 'EXCESSIVE'; desc = 'High N — risk of vegetative overgrowth & pest susceptibility.'; }

    return { value: n, status, unit: 'kg/ha', idealRange: '240 - 480 kg/ha', description: desc };
  }

  private evalPhosphorus(p: number): MetricDetail {
    let status: NutrientLevelStatus = 'OPTIMAL';
    let desc = 'Good available phosphorus for root and flower development.';
    if (p < 10) { status = 'CRITICAL_LOW'; desc = 'Deficient — weak root system and delayed maturity.'; }
    else if (p < 20) { status = 'LOW'; desc = 'Moderate — apply SSP/DAP basal fertilizer.'; }
    else if (p > 60) { status = 'HIGH'; desc = 'Abundant P stored in soil.'; }

    return { value: p, status, unit: 'kg/ha', idealRange: '20 - 50 kg/ha', description: desc };
  }

  private evalPotassium(k: number): MetricDetail {
    let status: NutrientLevelStatus = 'OPTIMAL';
    let desc = 'Adequate potassium for disease resistance and grain filling.';
    if (k < 110) { status = 'CRITICAL_LOW'; desc = 'Deficient — leaf margin necrosis & lodging risk.'; }
    else if (k < 180) { status = 'LOW'; desc = 'Moderate K level — apply MOP (Muriate of Potash).'; }
    else if (k > 350) { status = 'HIGH'; desc = 'Rich potassium reserves.'; }

    return { value: k, status, unit: 'kg/ha', idealRange: '180 - 320 kg/ha', description: desc };
  }

  private evalOrganicCarbon(oc: number): MetricDetail {
    let status: NutrientLevelStatus = 'OPTIMAL';
    let desc = 'Good organic matter content supporting soil biology.';
    if (oc < 0.4) { status = 'CRITICAL_LOW'; desc = 'Very low organic carbon — depleted soil biology.'; }
    else if (oc < 0.75) { status = 'LOW'; desc = 'Moderate OC — incorporate green manure & compost.'; }
    else if (oc >= 0.75) { status = 'OPTIMAL'; desc = 'Healthy organic carbon level.'; }

    return { value: oc, status, unit: '%', idealRange: '> 0.75 %', description: desc };
  }
}

export const soilService = new SoilService();
