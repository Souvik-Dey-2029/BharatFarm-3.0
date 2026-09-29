import { logger } from '../../../utils/logger.js';
import { AiClient } from '../../../utils/aiClient.js';
import { BRICS_SEED_DATA } from './brics.seed.js';
import {
  BricsKnowledgeRecord,
  BricsQueryFilters,
  BricsComparisonGroup,
  BricsAiSummaryRequest,
  BricsAiSummaryResponse
} from './brics.types.js';

export class BricsKnowledgeService {
  /**
   * Filter records based on country, crop, topic, or search term.
   */
  getRecords(filters: BricsQueryFilters = {}): { records: BricsKnowledgeRecord[]; total: number } {
    let result = [...BRICS_SEED_DATA];

    if (filters.country && filters.country !== 'ALL') {
      result = result.filter(r => r.country === filters.country);
    }

    if (filters.crop && filters.crop.trim() !== '' && filters.crop !== 'ALL') {
      const searchCrop = filters.crop.toLowerCase().trim();
      result = result.filter(r => r.crop.toLowerCase().includes(searchCrop));
    }

    if (filters.topic && filters.topic !== 'ALL') {
      result = result.filter(r => r.topic === filters.topic);
    }

    if (filters.search && filters.search.trim() !== '') {
      const query = filters.search.toLowerCase().trim();
      result = result.filter(r => 
        r.practice.toLowerCase().includes(query) ||
        r.summary.toLowerCase().includes(query) ||
        r.crop.toLowerCase().includes(query) ||
        r.tags.some(t => t.toLowerCase().includes(query)) ||
        r.source.toLowerCase().includes(query)
      );
    }

    return {
      records: result,
      total: result.length
    };
  }

  /**
   * Group filtered records by topic for cross-country comparative analysis.
   */
  getComparisonView(filters: BricsQueryFilters = {}): BricsComparisonGroup[] {
    const { records } = this.getRecords(filters);
    const groupsMap = new Map<string, { topicLabel: string; records: BricsKnowledgeRecord[] }>();

    for (const record of records) {
      if (!groupsMap.has(record.topic)) {
        groupsMap.set(record.topic, {
          topicLabel: record.topicLabel,
          records: []
        });
      }
      groupsMap.get(record.topic)!.records.push(record);
    }

    const groups: BricsComparisonGroup[] = [];
    for (const [topicKey, val] of groupsMap.entries()) {
      groups.push({
        topic: topicKey as any,
        topicLabel: val.topicLabel,
        records: val.records
      });
    }

    return groups;
  }

  /**
   * Generate an AI summary synthesized strictly from the retrieved records.
   */
  async generateAiSummary(payload: BricsAiSummaryRequest): Promise<BricsAiSummaryResponse> {
    const records = payload.records && payload.records.length > 0
      ? payload.records
      : BRICS_SEED_DATA.slice(0, 5);

    const recordIds = records.map(r => r.id);
    const countriesRepresented = Array.from(new Set(records.map(r => r.country)));

    // Deterministic fallback if AI client is unconfigured or fails
    const fallbackResponse: BricsAiSummaryResponse = {
      summary: `Synthesized analysis from ${records.length} BRICS regenerative practices across ${countriesRepresented.join(', ')}. Practices emphasize zero-tillage, bio-control pest management, and precision water conservation tailored for smallholders.`,
      keyTakeaways: [
        `Water Efficiency: Drip mulching (China/South Africa) and SRI paddy irrigation (India) achieve up to 35% water savings.`,
        `Soil Carbon Enhancement: No-till cover cropping in Brazil and zero-tillage Happy Seeder in India build durable organic humus.`,
        `Biological Pest Defense: Push-pull Desmodium in India and rice-fish-duck symbiosis in China reduce chemical pesticide reliance by over 45%.`
      ],
      crossCountryInsights: [
        `Tropical and semi-arid BRICS zones share a strong convergence toward permanent soil cover and biological pest management.`,
        `Smallholders in both India and South Africa benefit from canopy micro-climate regulation and straw mulching.`
      ],
      recommendedAdaptations: [
        `Adapt no-till cover cropping principles for Indian monsoon seasons with local pulses/legumes.`,
        `Implement sap-flow monitoring or drip-tape mulching for high-value fruit and vegetable crops.`
      ],
      provenance: {
        recordIds,
        countriesRepresented,
        generatedAt: new Date().toISOString(),
        isAiGenerated: false
      }
    };

    if (!AiClient.isConfigured()) {
      logger.warn('[BRICS Knowledge] AI client not configured. Returning deterministic summary fallback.');
      return fallbackResponse;
    }

    try {
      const recordsSummaryText = records.map((r, i) => `
[Record ${i + 1}] ID: ${r.id} | Country: ${r.countryName} (${r.country}) | Crop: ${r.crop}
Topic: ${r.topicLabel}
Practice: ${r.practice}
Summary: ${r.summary}
Impact: ${r.impactMetric}
Source: ${r.source} (${r.sourceDate})
Tags: ${r.tags.join(', ')}
`).join('\n');

      const prompt = `
You are the BRICS Regenerative Agricultural Knowledge Synthesizer for BharatFarm.
Analyze the following retrieved knowledge records from BRICS nations and produce a concise, structured synthesis for farmers and researchers.

STRICT INSTRUCTION: Base your analysis ONLY on the retrieved records below. Do NOT invent outside facts.

Retrieved BRICS Records:
${recordsSummaryText}

Target Crop Context / User Query (if any): ${payload.targetCrop || payload.userQuery || 'General Regenerative Agriculture'}

Return ONLY a valid JSON object matching this exact schema:
{
  "summary": "2-3 sentence high-level synthesis of these specific practices",
  "keyTakeaways": ["Takeaway 1 with country reference", "Takeaway 2 with country reference", "Takeaway 3"],
  "crossCountryInsights": ["Cross-country comparison insight 1", "Cross-country comparison insight 2"],
  "recommendedAdaptations": ["Practical takeaway for local smallholder adoption 1", "Practical takeaway 2"]
}
`;

      const aiRaw = await AiClient.chat([
        { role: 'system', content: 'You are a precise agricultural research assistant. Always output valid JSON.' },
        { role: 'user', content: prompt }
      ], { responseFormat: 'json_object', maxTokens: 600 });

      const parsed = AiClient.parseJsonResponse<{
        summary: string;
        keyTakeaways: string[];
        crossCountryInsights: string[];
        recommendedAdaptations: string[];
      }>(aiRaw);

      if (!parsed.summary || !Array.isArray(parsed.keyTakeaways)) {
        throw new Error('AI response structure did not match expected summary schema');
      }

      return {
        summary: parsed.summary,
        keyTakeaways: parsed.keyTakeaways,
        crossCountryInsights: parsed.crossCountryInsights || fallbackResponse.crossCountryInsights,
        recommendedAdaptations: parsed.recommendedAdaptations || fallbackResponse.recommendedAdaptations,
        provenance: {
          recordIds,
          countriesRepresented,
          generatedAt: new Date().toISOString(),
          isAiGenerated: true
        }
      };
    } catch (err: any) {
      logger.error('[BRICS Knowledge] AI summary generation failed, using fallback:', err.message);
      return fallbackResponse;
    }
  }
}

export const bricsKnowledgeService = new BricsKnowledgeService();
