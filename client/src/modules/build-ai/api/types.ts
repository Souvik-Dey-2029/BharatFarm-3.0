export interface ApiEnvelope<T = any> {
  success: boolean;
  data: T;
  source: 'live' | 'demo' | 'synthetic';
  generatedAt: string;
  fieldId?: string;
}

export interface EndpointDoc {
  id: string;
  method: 'GET' | 'POST';
  path: string;
  summary: string;
  description: string;
  requiresAuth: boolean;
  sampleFieldId: string;
  expectedResponseSnippet: string;
}
