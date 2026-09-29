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
      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(59, 130, 246, 0.08) 100%)',
      border: '1px solid rgba(16, 185, 129, 0.25)',
      borderRadius: '16px',
      padding: '1.25rem',
      marginBottom: '2rem'
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
            color: '#34d399',
            fontSize: '1.1rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            🤖 AI Multi-Nation Synthesis Engine
          </h3>
          <p style={{ margin: '0.25rem 0 0 0', color: '#9ca3af', fontSize: '0.825rem' }}>
            Synthesizes cross-border actionable insights exclusively from the {records.length} retrieved BRICS records above.
          </p>
        </div>

        <button
          onClick={handleSynthesize}
          disabled={loading || records.length === 0}
          style={{
            background: loading ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: loading ? '#9ca3af' : '#0b1d12',
            border: 'none',
            borderRadius: '8px',
            padding: '0.6rem 1.25rem',
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: loading || records.length === 0 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
          }}
        >
          {loading ? 'Synthesizing BRICS Data...' : '⚡ Generate AI Synthesis'}
        </button>
      </div>

      {error && (
        <div style={{
          marginTop: '1rem',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#f87171',
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
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '12px',
          padding: '1.25rem',
          border: '1px solid rgba(255,255,255,0.08)'
        }}>
          {/* Provenance Badge */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            paddingBottom: '0.5rem'
          }}>
            <span style={{
              background: synthesis.provenance.isAiGenerated ? 'rgba(59, 130, 246, 0.2)' : 'rgba(245, 158, 11, 0.2)',
              color: synthesis.provenance.isAiGenerated ? '#60a5fa' : '#fbbf24',
              padding: '0.15rem 0.5rem',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: 600
            }}>
              {synthesis.provenance.isAiGenerated ? '🤖 Live AI Generation' : '⚙️ Deterministic Synthesis Fallback'}
            </span>

            <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
              Nations: {synthesis.provenance.countriesRepresented.join(', ')} ({synthesis.provenance.recordIds.length} sources)
            </span>
          </div>

          {/* High-level summary */}
          <p style={{ color: '#e5e7eb', fontSize: '0.9rem', lineHeight: '1.6', margin: '0 0 1rem 0' }}>
            {synthesis.summary}
          </p>

          {/* Core Takeaways */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            <div>
              <h5 style={{ margin: '0 0 0.5rem 0', color: '#10b981', fontSize: '0.85rem' }}>📌 Key Cross-Border Takeaways</h5>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#d1d5db', fontSize: '0.8rem', lineHeight: '1.5' }}>
                {synthesis.keyTakeaways.map((item, idx) => (
                  <li key={idx} style={{ marginBottom: '0.35rem' }}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h5 style={{ margin: '0 0 0.5rem 0', color: '#60a5fa', fontSize: '0.85rem' }}>💡 Recommended Local Adaptations</h5>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#d1d5db', fontSize: '0.8rem', lineHeight: '1.5' }}>
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
