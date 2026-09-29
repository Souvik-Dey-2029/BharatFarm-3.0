export type ModelCategory = 'AI_LLM' | 'ML_COMPUTER_VISION' | 'WEATHER' | 'SATELLITE' | 'MARKET' | 'KNOWLEDGE';

export interface ModelCardItem {
  id: string;
  name: string;
  category: ModelCategory;
  categoryLabel: string;
  purpose: string;
  inputs: string[];
  outputs: string[];
  modelProviderLibrary: string;
  dataSource: string;
  updateFrequency: string;
  limitations: string[];
  responsibleUse: string;
  liveOrDemo: 'live' | 'demo' | 'hybrid';
  version: string;
  lastUpdated: string;
  canonicalRoute?: string;
}

export const MODEL_CARDS_REGISTRY: ModelCardItem[] = [
  {
    id: 'card_sat_01',
    name: 'Satellite Vegetation Telemetry (NDVI)',
    category: 'SATELLITE',
    categoryLabel: 'Satellite & Remote Sensing',
    purpose: 'Provides field-level vegetation health indices, canopy greenness tracking, and historical time-series telemetry.',
    inputs: ['Field Centroid Coordinates (Lat/Lng)', 'Polygon Boundary Geometry', 'Observation Date Range'],
    outputs: ['NDVI Index (0.00-1.00)', 'Vegetation Health Status', 'Cloud Cover Percentage', 'Change Trend %'],
    modelProviderLibrary: 'Sentinel-2 L2A Multispectral Instrument (B8 NIR + B4 Red Bands) / ISRO EOS-04',
    dataSource: 'Sentinel-2 Satellite Imagery / ISRO Earth Observation Data API',
    updateFrequency: 'Every 5 Days',
    limitations: [
      'Heavy cloud cover (>15%) during monsoon months reduces optical image clarity.',
      '10-meter spatial resolution may average pixel values for small holdings (< 0.2 acres).'
    ],
    responsibleUse: 'Satellite estimates serve as decision support and must be cross-verified with ground field scouting.',
    liveOrDemo: 'hybrid',
    version: 'v2.1.0',
    lastUpdated: '2026-09-28',
    canonicalRoute: '/build-ai/satellite'
  },
  {
    id: 'card_soil_02',
    name: 'Soil Health Assessment Engine',
    category: 'AI_LLM',
    categoryLabel: 'AI & Soil Science',
    purpose: 'Evaluates pH, NPK, and Organic Carbon lab values to calculate sub-indicators, composite health scores, and restoration advice.',
    inputs: ['Soil pH', 'Nitrogen (N kg/ha)', 'Phosphorus (P kg/ha)', 'Potassium (K kg/ha)', 'Organic Carbon (%)', 'Target Crop'],
    outputs: ['Soil Health Score (0-100)', 'Nutrient Status Classification', 'Crop Suitability Summary', 'Actionable Recommendations'],
    modelProviderLibrary: 'Deterministic Indian Soil Chemistry Matrix + OpenRouter (Gemini LLM Synthesis)',
    dataSource: 'ICAR Soil Testing Guidelines + User Soil Test Lab Reports',
    updateFrequency: 'On-Demand Per Test Submission',
    limitations: [
      'Accuracy relies on precise soil sampling depth (15-30 cm) and recent lab measurement.',
      'Does not automatically measure heavy metal contaminants or microbial bio-counts.'
    ],
    responsibleUse: 'Provides agronomic guidance for fertilizer dosing; always consult local KVK extension officers.',
    liveOrDemo: 'hybrid',
    version: 'v1.4.0',
    lastUpdated: '2026-09-29',
    canonicalRoute: '/build-ai/soil-health'
  },
  {
    id: 'card_regen_03',
    name: 'Regenerative AI Intelligence Engine',
    category: 'AI_LLM',
    categoryLabel: 'AI & Sustainable Agriculture',
    purpose: 'Orchestrates crop, soil, climate, and satellite telemetry into a versioned structured multi-horizon action plan.',
    inputs: ['Field & Crop Context', 'Weather Telemetry', 'Soil Lab Results', 'Satellite NDVI Index'],
    outputs: ['Immediate Actions (1-3 days)', 'Seasonal Practices', 'Soil & Water Actions', 'Risk Mitigation Plan', 'Evidence Traces'],
    modelProviderLibrary: 'OpenRouter (Gemini LLM with JSON Mode) + Deterministic Fallback Engine',
    dataSource: 'BharatFarm Knowledge Graph, Weather APIs, Field Observations',
    updateFrequency: 'Real-time On Demand',
    limitations: [
      'Generates decision-support guidelines, not legally binding extension guarantees.',
      'Unseasonal weather spikes require immediate tactical adjustment by the farmer.'
    ],
    responsibleUse: 'AI estimates are explicitly marked as decision-support guidelines and never represented as measured facts.',
    liveOrDemo: 'hybrid',
    version: 'v1.0.0',
    lastUpdated: '2026-09-29',
    canonicalRoute: '/build-ai/regenerative-ai'
  },
  {
    id: 'card_brics_04',
    name: 'BRICS Knowledge Repository & Synthesizer',
    category: 'KNOWLEDGE',
    categoryLabel: 'Multi-Nation Knowledge Base',
    purpose: 'Curates and synthesizes regenerative farming techniques across India, Brazil, Russia, China, and South Africa.',
    inputs: ['Country Code', 'Crop Name', 'Topic Category', 'Search Keyword'],
    outputs: ['Knowledge Records', 'Cross-Country Comparative View', 'AI Synthesis & Local Adaptations'],
    modelProviderLibrary: 'BRICS Knowledge Seed Database + OpenRouter Synthesis Engine',
    dataSource: 'ICAR (India), Embrapa (Brazil), RAS (Russia), CAAS (China), CRI (South Africa)',
    updateFrequency: 'Quarterly Knowledge Base Update',
    limitations: [
      'Synthesizes published agricultural practices; local soil micro-climates may vary.',
      'Practices require adaptation to local smallholder equipment availability.'
    ],
    responsibleUse: 'Promotes peer-to-peer knowledge sharing across BRICS nations with clear institutional source attribution.',
    liveOrDemo: 'live',
    version: 'v1.2.0',
    lastUpdated: '2026-09-29',
    canonicalRoute: '/build-ai/brics-hub'
  },
  {
    id: 'card_weather_05',
    name: 'Micro-Climate Telemetry & Risk Provider',
    category: 'WEATHER',
    categoryLabel: 'Climate Telemetry',
    purpose: 'Provides real-time temperature, humidity, rainfall probability, heat stress indicators, and 7-day weather forecasts.',
    inputs: ['Location Address', 'Latitude / Longitude Coordinates'],
    outputs: ['Temperature (°C)', 'Humidity (%)', 'Wind Speed (km/h)', 'Rainfall Probability (%)', 'Best Work Window'],
    modelProviderLibrary: 'Open-Meteo Weather API / IMD Weather Service Integration',
    dataSource: 'Indian Meteorological Department (IMD) / Open-Meteo Telemetry',
    updateFrequency: 'Hourly Updates',
    limitations: [
      'Micro-climate hyper-local microburst rain events may differ from regional station forecasts.'
    ],
    responsibleUse: 'Used for field planning (spraying, harvesting); check local skies before chemical applications.',
    liveOrDemo: 'live',
    version: 'v3.0.0',
    lastUpdated: '2026-09-29',
    canonicalRoute: '/sih/climate-risk'
  },
  {
    id: 'card_mandi_06',
    name: 'Smart Mandi Price & Demand ML Model',
    category: 'MARKET',
    categoryLabel: 'Market Intelligence',
    purpose: 'Forecasts 7-day Mandi price trajectories, modal price benchmarks, and buyer demand indexing across Indian markets.',
    inputs: ['Crop Commodity Name', 'Mandi Location', 'Historical Arrival Volumes'],
    outputs: ['Modal Price (₹/quintal)', 'Price Trajectory Trend (%)', 'Buyer Demand Index', 'Sell/Hold Advice'],
    modelProviderLibrary: 'Time-series Price Regression Model + Agmarknet Price Feeds',
    dataSource: 'Government Agmarknet Mandi Portal / Market Arrival Data',
    updateFrequency: 'Daily Market Closing',
    limitations: [
      'Unscheduled transport strikes or sudden import/export policy changes can disrupt short-term price predictions.'
    ],
    responsibleUse: 'Price forecasts provide price risk transparency for farmers prior to harvest sales.',
    liveOrDemo: 'live',
    version: 'v2.4.0',
    lastUpdated: '2026-09-28',
    canonicalRoute: '/sih/smart-mandi'
  },
  {
    id: 'card_scanner_07',
    name: 'Leaf Disease Vision Scanner',
    category: 'ML_COMPUTER_VISION',
    categoryLabel: 'Computer Vision ML',
    purpose: 'Analyzes leaf photographs to diagnose crop diseases, pest damage, and nutrient deficiency symptoms.',
    inputs: ['Leaf Photograph (JPEG/PNG Image Upload)'],
    outputs: ['Detected Disease / Pest Name', 'Diagnostic Confidence Score (%)', 'Treatment & Control Measures'],
    modelProviderLibrary: 'TensorFlow / MobileNet Crop Disease Classifier Model',
    dataSource: 'PlantVillage Dataset + Field Crop Specimen Database',
    updateFrequency: 'Versioned Model Checkpoints',
    limitations: [
      'Blurry photos, poor lighting, or extreme close-ups without leaf venation reduce diagnostic confidence.'
    ],
    responsibleUse: 'Camera diagnostic aid; verify severe pest outbreaks with agricultural officers.',
    liveOrDemo: 'live',
    version: 'v1.8.0',
    lastUpdated: '2026-09-25',
    canonicalRoute: '/scanner'
  }
];
