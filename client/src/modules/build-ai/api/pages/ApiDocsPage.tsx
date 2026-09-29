import React, { useState } from 'react';
import { ENDPOINT_DOCS, InteropClientService } from '../interop.service.js';
import { EndpointDoc } from '../types.js';
import { BuildAiShell } from '../../components/BuildAiShell.js';

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
    <BuildAiShell activeRoute="/build-ai/api">
      {/* Page Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <span className="material-symbols-outlined" style={{ color: '#0284C7', fontSize: '24px' }}>api</span>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
              Interoperable Agricultural API Layer
            </h1>
          </div>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748B', fontWeight: 500 }}>
            Normalized REST API endpoints for field geometry, satellite observation indices, soil health & recommendations
          </p>
        </div>

        <a
          href="/api/build-ai/api/openapi.json"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: '#F0F9FF',
            border: '1px solid #BAE6FD',
            color: '#0369A1',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: 800,
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>description</span>
          <span>View OpenAPI 3.0 Spec JSON</span>
        </a>
      </div>

      {/* Main Grid split: Sidebar of endpoints + Interactive doc runner */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        alignItems: 'start'
      }}>
        {/* Endpoint List Sidebar */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '16px',
          padding: '1.25rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#0F172A', fontSize: '1rem', fontWeight: 800 }}>
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
                  background: active ? '#F0F9FF' : '#F8FAFC',
                  border: active ? '1.5px solid #0284C7' : '1px solid #E2E8F0',
                  borderRadius: '10px',
                  padding: '0.85rem 1rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.3rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{
                    background: '#0284C7',
                    color: '#FFFFFF',
                    padding: '0.15rem 0.4rem',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    fontWeight: 800
                  }}>
                    {ep.method}
                  </span>
                  <span style={{ color: active ? '#0F172A' : '#334155', fontSize: '0.875rem', fontWeight: 700 }}>
                    {ep.summary}
                  </span>
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: active ? '#0369A1' : '#64748B' }}>
                  {ep.path}
                </div>
              </button>
            );
          })}
        </div>

        {/* Interactive Endpoint Tester & Documentation */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>
          {/* Header info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{
                background: '#0284C7',
                color: '#FFFFFF',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontWeight: 800
              }}>
                {selectedEndpoint.method}
              </span>
              <span style={{ fontFamily: 'monospace', fontSize: '0.95rem', color: '#0284C7', fontWeight: 700 }}>
                {selectedEndpoint.path}
              </span>
            </div>
            <h2 style={{ margin: '0 0 0.4rem 0', color: '#0F172A', fontSize: '1.2rem', fontWeight: 800 }}>
              {selectedEndpoint.summary}
            </h2>
            <p style={{ margin: 0, color: '#475569', fontSize: '0.875rem', lineHeight: 1.5, fontWeight: 500 }}>
              {selectedEndpoint.description}
            </p>
          </div>

          {/* Parameter Input & Try Demo Button */}
          <div style={{
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            {selectedEndpoint.id !== 'openapi' && (
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#64748B', fontWeight: 700, marginBottom: '0.4rem' }}>
                  Target Field ID Parameter:
                </label>
                <input
                  type="text"
                  value={fieldIdInput}
                  onChange={(e) => setFieldIdInput(e.target.value)}
                  placeholder="Enter Field ID..."
                  style={{
                    width: '100%',
                    background: '#FFFFFF',
                    border: '1.5px solid #CBD5E1',
                    borderRadius: '8px',
                    padding: '0.55rem 0.85rem',
                    color: '#0F172A',
                    fontSize: '0.875rem',
                    fontFamily: 'monospace',
                    fontWeight: 600,
                    outline: 'none'
                  }}
                />
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: selectedEndpoint.requiresAuth ? '#D97706' : '#16A34A' }}>
                {selectedEndpoint.requiresAuth ? '🔒 Requires Authorization Header' : '🌐 Public Endpoint'}
              </span>

              <button
                onClick={handleRunDemo}
                disabled={loading}
                style={{
                  background: '#0284C7',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.55rem 1.25rem',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 2px 8px rgba(2, 132, 199, 0.25)'
                }}
              >
                {loading ? 'Executing API Call...' : '▶️ Test Live Endpoint'}
              </button>
            </div>
          </div>

          {/* Live Test Response Output */}
          {testResult && (
            <div>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#16A34A', fontSize: '0.875rem', fontWeight: 800 }}>
                ⚡ Live API Response Envelope:
              </h4>
              <pre style={{
                background: '#0F172A',
                border: '1px solid #1E293B',
                borderRadius: '10px',
                padding: '1rem',
                color: '#4ADE80',
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
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#64748B', fontSize: '0.85rem', fontWeight: 700 }}>
                📋 Sample Response Schema Envelope:
              </h4>
              <pre style={{
                background: '#0F172A',
                border: '1px solid #1E293B',
                borderRadius: '10px',
                padding: '1rem',
                color: '#E2E8F0',
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
    </BuildAiShell>
  );
};
