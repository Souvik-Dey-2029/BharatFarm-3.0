import React from 'react';
import { useLanguage } from '../../../../context/LanguageContext.js';

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
  const { t } = useLanguage();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.25rem' }}>
      {/* Evidence Provenance Table */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '14px',
        padding: '1.1rem',
        border: '1.5px solid #EFEAE2',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
      }}>
        <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.88rem', color: '#0F172A', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span className="material-symbols-outlined" style={{ color: '#16A34A', fontSize: '18px' }}>fact_check</span>
          <span>{t('buildAi.regenerative.evidenceTitle')}</span>
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {evidence.map((ev, idx) => (
            <div key={idx} style={{
              background: '#FDFBF7',
              padding: '0.65rem 0.85rem',
              borderRadius: '8px',
              border: '1px solid #EFEAE2',
              fontSize: '0.8rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px', flexWrap: 'wrap', gap: '0.3rem' }}>
                <strong style={{ color: '#15803D' }}>{ev.parameter}</strong>
                <span style={{ color: '#0F172A', fontWeight: 700 }}>{ev.value}</span>
              </div>
              <div style={{ color: '#475569', fontSize: '0.75rem', lineHeight: 1.4 }}>
                {ev.impactOnPlan}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Assumptions & Limitations Transparency Card */}
      <div style={{
        background: '#FDFBF7',
        borderRadius: '12px',
        padding: '0.9rem',
        border: '1px solid #EFEAE2'
      }}>
        <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.55rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#64748B' }}>info</span>
          <span>{t('buildAi.regenerative.guidanceTitle')}</span>
        </div>

        <div style={{ marginBottom: '0.65rem' }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#0369A1', marginBottom: '0.2rem' }}>
            {t('buildAi.regenerative.systemAssumptions')}
          </div>
          <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.74rem', color: '#475569', lineHeight: 1.45 }}>
            {assumptions.map((a, idx) => (
              <li key={idx}>{a}</li>
            ))}
          </ul>
        </div>

        <div>
          <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#B91C1C', marginBottom: '0.2rem' }}>
            {t('buildAi.regenerative.farmerGuidelines')}
          </div>
          <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.74rem', color: '#475569', lineHeight: 1.45 }}>
            {limitations.map((l, idx) => (
              <li key={idx}>{l}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
