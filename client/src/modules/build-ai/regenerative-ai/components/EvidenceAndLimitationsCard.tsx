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
        background: 'var(--surface-card, #12281a)',
        borderRadius: '16px',
        padding: '1.25rem',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.25)'
      }}>
        <h4 style={{ margin: '0 0 0.85rem 0', fontSize: '1rem', color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          🔍 Grounding Evidence & Ingested Intelligence
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {evidence.map((ev, idx) => (
            <div key={idx} style={{
              background: 'rgba(0,0,0,0.25)',
              padding: '0.75rem 0.9rem',
              borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.05)',
              fontSize: '0.8rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                <strong style={{ color: '#34D399' }}>{ev.parameter}</strong>
                <span style={{ color: '#FBBF24', fontWeight: 600 }}>{ev.value}</span>
              </div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.76rem', lineHeight: 1.4 }}>
                {ev.impactOnPlan}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Assumptions & Limitations Transparency Card */}
      <div style={{
        background: 'rgba(0,0,0,0.3)',
        borderRadius: '14px',
        padding: '1.25rem',
        border: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'rgba(255,255,255,0.9)', marginBottom: '0.75rem' }}>
          📌 Model Assumptions & Advisory Limitations
        </div>

        <div style={{ marginBottom: '0.85rem' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#38BDF8', marginBottom: '0.3rem' }}>
            Underlying System Assumptions:
          </div>
          <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.78rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.45 }}>
            {assumptions.map((a, idx) => (
              <li key={idx}>{a}</li>
            ))}
          </ul>
        </div>

        <div>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#F87171', marginBottom: '0.3rem' }}>
            Advisory Limitations & Disclaimers:
          </div>
          <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.78rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.45 }}>
            {limitations.map((l, idx) => (
              <li key={idx}>{l}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
