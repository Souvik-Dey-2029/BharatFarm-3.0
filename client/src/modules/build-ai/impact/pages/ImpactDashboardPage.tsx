import React, { useState, useEffect } from 'react';
import { ImpactSummaryData } from '../types.js';
import { ImpactClientService } from '../impact.service.js';
import { ImpactKpiGrid } from '../components/ImpactKpiGrid.js';
import { ImpactTrajectoryChart } from '../components/ImpactTrajectoryChart.js';
import { ImpactMetricsTable } from '../components/ImpactMetricsTable.js';
import { BuildAiShell } from '../../components/BuildAiShell.js';

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
    <BuildAiShell activeRoute="/build-ai/impact">
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
            <span className="material-symbols-outlined" style={{ color: '#DB2777', fontSize: '24px' }}>analytics</span>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
              Impact & Evaluation Dashboard
            </h1>
          </div>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748B', fontWeight: 500 }}>
            Proven outcome tracking for yield gains, soil organic carbon, water saved & climate risk reduction
          </p>
        </div>

        {/* Target Field Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700 }}>Select Field:</label>
          <select
            value={fieldId}
            onChange={(e) => setFieldId(e.target.value)}
            style={{
              background: '#FFFFFF',
              border: '1.5px solid #CBD5E1',
              borderRadius: '8px',
              padding: '0.45rem 0.75rem',
              color: '#0F172A',
              fontSize: '0.85rem',
              fontWeight: 700,
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="field_demo_paddy_01">North Paddy Plot (Demo Farm)</option>
            <option value="field_demo_wheat_02">East Wheat Parcel</option>
            <option value="field_unmonitored_03">Unmonitored South Field</option>
          </select>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          padding: '3rem 1.5rem',
          textAlign: 'center',
          border: '1px solid #E2E8F0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}>
          <div className="spin" style={{ display: 'inline-block', fontSize: '2rem', marginBottom: '0.5rem' }}>⌛</div>
          <div style={{ fontWeight: 700, color: '#334155' }}>Loading Impact Evaluation Telemetry...</div>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div style={{
          background: '#FEF2F2',
          border: '1px solid #FCA5A5',
          color: '#991B1B',
          padding: '1.25rem',
          borderRadius: '12px',
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <p style={{ margin: '0 0 0.5rem 0', fontWeight: 800 }}>Failed to load impact metrics</p>
          <p style={{ margin: 0, fontSize: '0.85rem' }}>{error}</p>
        </div>
      )}

      {/* Dashboard Display */}
      {!loading && !error && impactData && (
        <>
          {impactData.totalMetricsTracked > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <ImpactKpiGrid kpis={impactData.kpis} />
              <ImpactTrajectoryChart data={impactData.timeSeries} />
              <ImpactMetricsTable metrics={impactData.metrics} />
            </div>
          ) : (
            <div style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '16px',
              padding: '3rem',
              textAlign: 'center',
              color: '#64748B'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📉</div>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#0F172A', fontWeight: 800 }}>Not enough measured impact data yet</h4>
              <p style={{ margin: '0 0 1rem 0', fontSize: '0.85rem' }}>
                No harvest records, soil tests, or telemetry logs are linked to this field ID yet.
              </p>
              <button
                onClick={() => setFieldId('field_demo_paddy_01')}
                style={{
                  background: '#16A34A',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '0.55rem 1.25rem',
                  borderRadius: '8px',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                View North Paddy Plot Demo Dataset
              </button>
            </div>
          )}
        </>
      )}
    </BuildAiShell>
  );
};
