import React, { useState } from 'react';
import { BricsKnowledgeRecord, BricsAiSummaryResponse } from '../types.js';
import { BricsKnowledgeService } from '../brics.service.js';

interface Props {
  records: BricsKnowledgeRecord[];
}

export const BricsAiSynthesisCard: React.FC<Props> = ({ records }) => {
  const [synthesis, setSynthesis] = useState<BricsAiSummaryResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSynthesize = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await BricsKnowledgeService.summarizeRecords(records);
      setSynthesis(res);
    } catch (err: any) {
      setError(err.message || 'Synthesis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #F0FDF4 0%, #EFF6FF 100%)',
      border: '1.5px solid #BBF7D0',
      borderRadius: '16px',
      padding: '1.25rem 1.5rem',
      marginBottom: '2rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: synthesis ? '1rem' : 0
      }}>
        <div>
          <h3 style={{
            margin: 0,
            color: '#0F172A',
            fontSize: '1.1rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span className="material-symbols-outlined" style={{ color: '#16A34A', fontSize: '20px' }}>psychology</span>
            <span>Cross-Country Agronomic Synthesis</span>
          </h3>
          <p style={{ margin: '0.25rem 0 0 0', color: '#475569', fontSize: '0.825rem' }}>
            Synthesize practical regenerative insights exclusively grounded on the {records.length} retrieved BRICS records above.
          </p>
        </div>

        <button
          onClick={handleSynthesize}
          disabled={loading || records.length === 0}
          style={{
            background: loading ? '#E2E8F0' : '#16A34A',
            color: loading ? '#64748B' : '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            padding: '0.6rem 1.25rem',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: loading || records.length === 0 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            boxShadow: '0 2px 6px rgba(22, 163, 74, 0.3)'
          }}
        >
          {loading ? 'Synthesizing Knowledge...' : 'Generate Synthesis'}
        </button>
      </div>

      {error && (
        <div style={{
          marginTop: '1rem',
          background: '#FEF2F2',
          border: '1px solid #FECACA',
          color: '#991B1B',
          padding: '0.75rem',
          borderRadius: '8px',
          fontSize: '0.85rem'
        }}>
          ⚠️ {error}
        </div>
      )}

      {synthesis && (
        <div style={{
          marginTop: '1rem',
          background: '#FFFFFF',
          borderRadius: '12px',
          padding: '1.25rem',
          border: '1px solid #E2E8F0'
        }}>
          {/* Provenance Badge */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
            borderBottom: '1px solid #F1F5F9',
            paddingBottom: '0.5rem',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
            <span style={{
              background: synthesis.provenance.isAiGenerated ? '#DCFCE7' : '#FEF3C7',
              color: synthesis.provenance.isAiGenerated ? '#15803D' : '#B45309',
              padding: '0.2rem 0.6rem',
              borderRadius: '6px',
              fontSize: '0.72rem',
              fontWeight: 800
            }}>
              {synthesis.provenance.isAiGenerated ? 'Live AI Synthesis' : 'Measured Synthesis Fallback'}
            </span>

            <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
              Nations: {synthesis.provenance.countriesRepresented.join(', ')} ({synthesis.provenance.recordIds.length} sources)
            </span>
          </div>

          {/* High-level summary */}
          <p style={{ color: '#334155', fontSize: '0.9rem', lineHeight: '1.6', margin: '0 0 1rem 0' }}>
            {synthesis.summary}
          </p>

          {/* Core Takeaways */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <h5 style={{ margin: '0 0 0.5rem 0', color: '#15803D', fontSize: '0.85rem', fontWeight: 800 }}>📌 Key Cross-Border Takeaways</h5>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#475569', fontSize: '0.82rem', lineHeight: 1.5 }}>
                {synthesis.keyTakeaways.map((item, idx) => (
                  <li key={idx} style={{ marginBottom: '0.35rem' }}>{item}</li>
                ))}
              </ul>
            </div>

            <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <h5 style={{ margin: '0 0 0.5rem 0', color: '#0369A1', fontSize: '0.85rem', fontWeight: 800 }}>💡 Recommended Local Adaptations</h5>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#475569', fontSize: '0.82rem', lineHeight: 1.5 }}>
                {synthesis.recommendedAdaptations.map((item, idx) => (
                  <li key={idx} style={{ marginBottom: '0.35rem' }}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
