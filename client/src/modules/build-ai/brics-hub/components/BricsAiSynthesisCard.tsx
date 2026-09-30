import React, { useState } from 'react';
import { BricsKnowledgeRecord, BricsAiSummaryResponse } from '../types.js';
import { BricsKnowledgeService } from '../brics.service.js';
import { useLanguage } from '../../../../context/LanguageContext.js';

interface Props {
  records: BricsKnowledgeRecord[];
}

export const BricsAiSynthesisCard: React.FC<Props> = ({ records }) => {
  const { t } = useLanguage();
  const [synthesis, setSynthesis] = useState<BricsAiSummaryResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleSynthesize = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await BricsKnowledgeService.summarizeRecords(records);
      setSynthesis(res);
      setIsOpen(true);
    } catch (err: any) {
      setError(err.message || t('buildAi.generalError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: '#FDFBF7',
      border: '1.5px solid #EFEAE2',
      borderRadius: '14px',
      padding: '0.75rem 0.9rem',
      marginBottom: '0.75rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span className="material-symbols-outlined" style={{ color: '#16A34A', fontSize: '18px' }}>psychology</span>
          <div>
            <h4 style={{ margin: 0, color: '#0F172A', fontSize: '0.86rem', fontWeight: 800 }}>
              {t('buildAi.brics.summaryTitle')}
            </h4>
            <span style={{ fontSize: '0.7rem', color: '#64748B' }}>
              {t('buildAi.brics.summarySub').replace('{count}', records.length.toString())}
            </span>
          </div>
        </div>

        <button
          onClick={handleSynthesize}
          disabled={loading || records.length === 0}
          style={{
            background: loading ? '#E2E8F0' : '#16A34A',
            color: loading ? '#64748B' : '#FFFFFF',
            border: 'none',
            borderRadius: '6px',
            padding: '0.35rem 0.75rem',
            fontWeight: 800,
            fontSize: '0.74rem',
            cursor: loading || records.length === 0 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}
        >
          {loading ? t('buildAi.brics.summarizingBtn') : t('buildAi.brics.summarizeBtn')}
        </button>
      </div>

      {error && (
        <div style={{
          marginTop: '0.5rem',
          background: '#FEF2F2',
          border: '1px solid #FECACA',
          color: '#991B1B',
          padding: '0.45rem 0.65rem',
          borderRadius: '6px',
          fontSize: '0.74rem'
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>warning</span>
          <span>{error}</span>
        </div>
      )}

      {synthesis && isOpen && (
        <div style={{
          marginTop: '0.65rem',
          background: '#FFFFFF',
          borderRadius: '10px',
          padding: '0.75rem',
          border: '1px solid #EFEAE2'
        }}>
          <p style={{ color: '#334155', fontSize: '0.8rem', lineHeight: '1.45', margin: '0 0 0.6rem 0' }}>
            {synthesis.summary}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
            <div style={{ background: '#FDFBF7', padding: '0.6rem', borderRadius: '8px', border: '1px solid #EFEAE2' }}>
              <div style={{ margin: '0 0 0.35rem 0', color: '#15803D', fontSize: '0.76rem', fontWeight: 800 }}>
                {t('buildAi.brics.keyTakeaways')}
              </div>
              <ul style={{ margin: 0, paddingLeft: '1rem', color: '#475569', fontSize: '0.74rem', lineHeight: 1.4 }}>
                {synthesis.keyTakeaways.slice(0, 2).map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div style={{ background: '#FDFBF7', padding: '0.6rem', borderRadius: '8px', border: '1px solid #EFEAE2' }}>
              <div style={{ margin: '0 0 0.35rem 0', color: '#0369A1', fontSize: '0.76rem', fontWeight: 800 }}>
                {t('buildAi.brics.localAdaptation')}
              </div>
              <ul style={{ margin: 0, paddingLeft: '1rem', color: '#475569', fontSize: '0.74rem', lineHeight: 1.4 }}>
                {synthesis.recommendedAdaptations.slice(0, 2).map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
