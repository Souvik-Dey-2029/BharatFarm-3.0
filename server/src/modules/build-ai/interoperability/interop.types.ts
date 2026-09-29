export interface ApiEnvelope<T = any> {
  success: boolean;
  data: T;
  source: 'live' | 'demo' | 'synthetic';
  generatedAt: string;
  fieldId?: string;
}

export interface ApiEndpointDoc {
  method: 'GET' | 'POST';
  path: string;
  summary: string;
  description: string;
  requiresAuth: boolean;
  sampleFieldId: string;
  responseExample: Record<string, any>;
}
