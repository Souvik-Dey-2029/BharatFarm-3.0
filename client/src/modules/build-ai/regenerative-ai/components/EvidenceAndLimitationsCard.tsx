import React from 'react';

interface EvidenceAndLimitationsCardProps {
  evidence: Array<{ parameter: string; value: string; impactOnPlan: string }>;
  assumptions: string[];
  limitations: string[];
}

export const EvidenceAndLimitationsCard: React.FC<EvidenceAndLimitationsCardProps> = ({
  evidence,
  assumptions,
  limitations
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.5rem' }}>
      {/* Evidence Provenance Table */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        padding: '1.5rem',
        border: '1px solid #E2E8F0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
      }}>
        <h4 style={{ margin: '0 0 0.85rem 0', fontSize: '1rem', color: '#0F172A', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span className="material-symbols-outlined" style={{ color: '#16A34A', fontSize: '20px' }}>fact_check</span>
          <span>Field Context & Ingested Data Sources</span>
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {evidence.map((ev, idx) => (
            <div key={idx} style={{
              background: '#F8FAFC',
              padding: '0.85rem 1rem',
              borderRadius: '10px',
              border: '1px solid #E2E8F0',
              fontSize: '0.85rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', flexWrap: 'wrap', gap: '0.3rem' }}>
                <strong style={{ color: '#15803D' }}>{ev.parameter}</strong>
                <span style={{ color: '#0F172A', fontWeight: 700 }}>{ev.value}</span>
              </div>
              <div style={{ color: '#475569', fontSize: '0.8rem', lineHeight: 1.45 }}>
                {ev.impactOnPlan}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Assumptions & Limitations Transparency Card */}
      <div style={{
        background: '#F8FAFC',
        borderRadius: '14px',
        padding: '1.25rem',
        border: '1px solid #E2E8F0'
      }}>
        <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#64748B' }}>info</span>
          <span>Decision Context & Practical Guidance</span>
        </div>

        <div style={{ marginBottom: '0.85rem' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0369A1', marginBottom: '0.3rem' }}>
            System Assumptions:
          </div>
          <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.8rem', color: '#475569', lineHeight: 1.5 }}>
            {assumptions.map((a, idx) => (
              <li key={idx}>{a}</li>
            ))}
          </ul>
        </div>

        <div>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#B91C1C', marginBottom: '0.3rem' }}>
            Farmer Advisory Guidelines:
          </div>
          <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.8rem', color: '#475569', lineHeight: 1.5 }}>
            {limitations.map((l, idx) => (
              <li key={idx}>{l}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
