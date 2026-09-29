export type BricsCountryCode = 'IN' | 'BR' | 'RU' | 'CN' | 'ZA';

export type BricsTopicCategory = 
  | 'SOIL_HEALTH' 
  | 'WATER_CONSERVATION' 
  | 'CROP_DIVERSIFICATION' 
  | 'INTEGRATED_PEST_MGMT' 
  | 'CARBON_SEQUESTRATION' 
  | 'AGROFORESTRY';

export interface BricsKnowledgeRecord {
  id: string;
  country: BricsCountryCode;
  countryName: string;
  crop: string;
  topic: BricsTopicCategory;
  topicLabel: string;
  practice: string;
  summary: string;
  impactMetric: string;
  source: string;
  sourceUrl?: string;
  sourceDate: string;
  tags: string[];
}

export interface BricsQueryFilters {
  country?: BricsCountryCode | 'ALL';
  crop?: string;
  topic?: BricsTopicCategory | 'ALL';
  search?: string;
}

export interface BricsComparisonGroup {
  topic: BricsTopicCategory;
  topicLabel: string;
  records: BricsKnowledgeRecord[];
}

export interface BricsAiSummaryResponse {
  summary: string;
  keyTakeaways: string[];
  crossCountryInsights: string[];
  recommendedAdaptations: string[];
  provenance: {
    recordIds: string[];
    countriesRepresented: BricsCountryCode[];
    generatedAt: string;
    isAiGenerated: boolean;
  };
}
