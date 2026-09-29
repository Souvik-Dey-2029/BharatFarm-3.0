import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ENDPOINT_DOCS, InteropClientService } from '../interop.service.js';
import { EndpointDoc } from '../types.js';

export const ApiDocsPage: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointDoc>(ENDPOINT_DOCS[0]);
  const [fieldIdInput, setFieldIdInput] = useState<string>(ENDPOINT_DOCS[0].sampleFieldId);
  const [loading, setLoading] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<any | null>(null);

  const handleSelectEndpoint = (ep: EndpointDoc) => {
    setSelectedEndpoint(ep);
    setFieldIdInput(ep.sampleFieldId);
    setTestResult(null);
  };

  const handleRunDemo = async () => {
    setLoading(true);
    setTestResult(null);
    try {
      const res = await InteropClientService.testEndpoint(selectedEndpoint, fieldIdInput);
      setTestResult(res);
    } catch (err: any) {
      setTestResult({
        success: false,
        error: err.message || 'Failed to call API endpoint'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--surface-bg, #0b1d12)',
      color: 'var(--text-primary, #ffffff)',
      padding: '1.5rem',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Navigation Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
          <Link to="/build-ai" style={{ color: '#10b981', textDecoration: 'none', fontWeight: 500 }}>
            ← Build with AI
          </Link>
          <span style={{ color: '#6b7280' }}>/</span>
          <span style={{ color: '#9ca3af' }}>Interoperable API Layer</span>
        </div>

        {/* Page Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{
                background: 'rgba(56, 189, 248, 0.2)',
                color: '#38bdf8',
                padding: '0.2rem 0.6rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 600
              }}>
                Feature 5
              </span>
              <span style={{
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#34d399',
                padding: '0.2rem 0.6rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 500
              }}>
                Track 4 Interoperability
              </span>
            </div>
            <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700, color: '#ffffff' }}>
              🔗 Interoperable Agricultural API Layer
            </h1>
            <p style={{ margin: '0.35rem 0 0 0', color: '#9ca3af', fontSize: '0.9rem' }}>
              Standardized REST API endpoints for sharing normalized field geometry, satellite observation indices, soil health, climate risk telemetry, and recommendations.
            </p>
          </div>

          <a
            href="/api/build-ai/api/openapi.json"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              color: '#38bdf8',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            📄 View OpenAPI 3.0 Spec JSON
          </a>
        </div>

        {/* Main Grid split: Sidebar of endpoints + Main interactive doc runner */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          alignItems: 'start'
        }}>
          {/* Endpoint List Sidebar */}
          <div style={{
            background: 'rgba(17, 24, 39, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#ffffff', fontSize: '1rem', fontWeight: 600 }}>
              Available REST Endpoints
            </h3>

            {ENDPOINT_DOCS.map((ep) => {
              const active = selectedEndpoint.id === ep.id;
              return (
                <button
                  key={ep.id}
                  onClick={() => handleSelectEndpoint(ep)}
                  style={{
                    textAlign: 'left',
                    background: active ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255,255,255,0.03)',
                    border: active ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '10px',
                    padding: '0.85rem 1rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.3rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{
                      background: '#0284c7',
                      color: '#ffffff',
                      padding: '0.15rem 0.4rem',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      fontWeight: 700
                    }}>
                      {ep.method}
                    </span>
                    <span style={{ color: active ? '#ffffff' : '#d1d5db', fontSize: '0.875rem', fontWeight: 600 }}>
                      {ep.summary}
                    </span>
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: active ? '#38bdf8' : '#9ca3af' }}>
                    {ep.path}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Interactive Endpoint Tester & Documentation */}
          <div style={{
            background: 'rgba(17, 24, 39, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}>
            {/* Header info */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{
                  background: '#0284c7',
                  color: '#ffffff',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}>
                  {selectedEndpoint.method}
                </span>
                <span style={{ fontFamily: 'monospace', fontSize: '0.95rem', color: '#38bdf8', fontWeight: 600 }}>
                  {selectedEndpoint.path}
                </span>
              </div>
              <h2 style={{ margin: '0 0 0.4rem 0', color: '#ffffff', fontSize: '1.25rem', fontWeight: 700 }}>
                {selectedEndpoint.summary}
              </h2>
              <p style={{ margin: 0, color: '#9ca3af', fontSize: '0.875rem', lineHeight: '1.5' }}>
                {selectedEndpoint.description}
              </p>
            </div>

            {/* Parameter Input & Try Demo Button */}
            <div style={{
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              {selectedEndpoint.id !== 'openapi' && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.4rem' }}>
                    Target Field ID Parameter:
                  </label>
                  <input
                    type="text"
                    value={fieldIdInput}
                    onChange={(e) => setFieldIdInput(e.target.value)}
                    placeholder="Enter Field ID..."
                    style={{
                      width: '100%',
                      background: 'rgba(0, 0, 0, 0.4)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '8px',
                      padding: '0.55rem 0.85rem',
                      color: '#ffffff',
                      fontSize: '0.875rem',
                      fontFamily: 'monospace'
                    }}
                  />
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: selectedEndpoint.requiresAuth ? '#fbbf24' : '#34d399' }}>
                  {selectedEndpoint.requiresAuth ? '🔒 Requires JWT Authorization Header' : '🌐 Public Endpoint'}
                </span>

                <button
                  onClick={handleRunDemo}
                  disabled={loading}
                  style={{
                    background: loading ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.55rem 1.25rem',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)'
                  }}
                >
                  {loading ? 'Executing API Call...' : '▶️ Test Live API Endpoint'}
                </button>
              </div>
            </div>

            {/* Live Test Response Output */}
            {testResult && (
              <div>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#34d399', fontSize: '0.875rem' }}>
                  ⚡ Live API Response:
                </h4>
                <pre style={{
                  background: '#090d16',
                  border: '1px solid rgba(52, 211, 153, 0.3)',
                  borderRadius: '10px',
                  padding: '1rem',
                  color: '#34d399',
                  fontSize: '0.8rem',
                  fontFamily: 'monospace',
                  overflowX: 'auto',
                  maxHeight: '320px'
                }}>
                  {JSON.stringify(testResult, null, 2)}
                </pre>
              </div>
            )}

            {/* Static Expected Response Example */}
            {!testResult && (
              <div>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#9ca3af', fontSize: '0.85rem' }}>
                  📋 Sample Response Schema Envelope:
                </h4>
                <pre style={{
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '10px',
                  padding: '1rem',
                  color: '#d1d5db',
                  fontSize: '0.8rem',
                  fontFamily: 'monospace',
                  overflowX: 'auto'
                }}>
                  {selectedEndpoint.expectedResponseSnippet}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
