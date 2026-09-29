import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ImpactSummaryData } from '../types.js';
import { ImpactClientService } from '../impact.service.js';
import { ImpactKpiGrid } from '../components/ImpactKpiGrid.js';
import { ImpactTrajectoryChart } from '../components/ImpactTrajectoryChart.js';
import { ImpactMetricsTable } from '../components/ImpactMetricsTable.js';

export const ImpactDashboardPage: React.FC = () => {
  const [fieldId, setFieldId] = useState<string>('field_demo_paddy_01');
  const [impactData, setImpactData] = useState<ImpactSummaryData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchImpact = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ImpactClientService.getFieldImpact(fieldId);
      setImpactData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load impact evaluation data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImpact();
  }, [fieldId]);

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
          <span style={{ color: '#9ca3af' }}>Impact & Evaluation Dashboard</span>
        </div>

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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{
                background: 'rgba(244, 114, 182, 0.2)',
                color: '#f472b6',
                padding: '0.2rem 0.6rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 600
              }}>
                Feature 6
              </span>
              <span style={{
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#34d399',
                padding: '0.2rem 0.6rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 500
              }}>
                Track 4 Outcomes
              </span>
            </div>
            <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700, color: '#ffffff' }}>
              📊 Impact & Evaluation Dashboard
            </h1>
            <p style={{ margin: '0.35rem 0 0 0', color: '#9ca3af', fontSize: '0.9rem' }}>
              Rigorous evaluation metrics tracking yield gains, soil health restoration, water conservation, climate risk reduction, and carbon sequestration with clear source provenance labels.
            </p>
          </div>

          {/* Target Field Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Select Field:</label>
            <select
              value={fieldId}
              onChange={(e) => setFieldId(e.target.value)}
              style={{
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '8px',
                padding: '0.45rem 0.75rem',
                color: '#ffffff',
                fontSize: '0.85rem'
              }}
            >
              <option value="field_demo_paddy_01" style={{ background: '#111827' }}>North Paddy Plot (Demo Farm)</option>
              <option value="field_demo_wheat_02" style={{ background: '#111827' }}>East Wheat Parcel</option>
              <option value="field_unmonitored_03" style={{ background: '#111827' }}>Unmonitored South Field</option>
            </select>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#10b981' }}>
            <div className="spin" style={{ display: 'inline-block', fontSize: '2rem', marginBottom: '0.5rem' }}>⌛</div>
            <div>Loading Impact Evaluation Telemetry...</div>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            padding: '1.25rem',
            borderRadius: '12px',
            textAlign: 'center',
            marginBottom: '2rem'
          }}>
            <p style={{ margin: '0 0 0.5rem 0', fontWeight: 600 }}>Failed to load impact metrics</p>
            <p style={{ margin: 0, fontSize: '0.85rem' }}>{error}</p>
          </div>
        )}

        {/* Dashboard Display */}
        {!loading && !error && impactData && (
          <>
            {impactData.totalMetricsTracked > 0 ? (
              <>
                <ImpactKpiGrid kpis={impactData.kpis} />
                <ImpactTrajectoryChart data={impactData.timeSeries} />
                <ImpactMetricsTable metrics={impactData.metrics} />
              </>
            ) : (
              <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px border-dashed rgba(255,255,255,0.1)',
                borderRadius: '16px',
                padding: '3rem',
                textAlign: 'center',
                color: '#9ca3af'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📉</div>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#ffffff' }}>Not enough measured impact data yet</h4>
                <p style={{ margin: '0 0 1rem 0', fontSize: '0.85rem' }}>
                  No harvest records, soil tests, or telemetry logs are linked to this field ID yet.
                </p>
                <button
                  onClick={() => setFieldId('field_demo_paddy_01')}
                  style={{
                    background: '#10b981',
                    color: '#0b1d12',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  View North Paddy Plot Demo Dataset
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
