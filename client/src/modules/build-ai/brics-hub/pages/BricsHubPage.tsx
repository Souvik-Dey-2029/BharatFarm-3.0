import React, { useState, useEffect } from 'react';
import {
  BricsKnowledgeRecord,
  BricsQueryFilters,
  BricsComparisonGroup
} from '../types.js';
import { BricsKnowledgeService } from '../brics.service.js';
import { BricsFilterBar } from '../components/BricsFilterBar.js';
import { BricsKnowledgeCard } from '../components/BricsKnowledgeCard.js';
import { BricsComparisonTable } from '../components/BricsComparisonTable.js';
import { BricsAiSynthesisCard } from '../components/BricsAiSynthesisCard.js';
import { BuildAiShell } from '../../components/BuildAiShell.js';
import { useLanguage } from '../../../../context/LanguageContext.js';

export const BricsHubPage: React.FC = () => {
  const { t } = useLanguage();
  const [filters, setFilters] = useState<BricsQueryFilters>({
    country: 'ALL',
    crop: 'ALL',
    topic: 'ALL',
    search: ''
  });
  const [viewMode, setViewMode] = useState<'grid' | 'comparison'>('grid');

  const [records, setRecords] = useState<BricsKnowledgeRecord[]>([]);
  const [comparisonGroups, setComparisonGroups] = useState<BricsComparisonGroup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (viewMode === 'grid') {
        const res = await BricsKnowledgeService.getRecords(filters);
        setRecords(res.records);
      } else {
        const res = await BricsKnowledgeService.getComparisonView(filters);
        setComparisonGroups(res);
        const recRes = await BricsKnowledgeService.getRecords(filters);
        setRecords(recRes.records);
      }
    } catch (err: any) {
      setError(err.message || t('buildAi.generalError'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters, viewMode]);

  return (
    <BuildAiShell activeRoute="/build-ai/brics-hub" pageTitle={t('buildAi.bricsKnowledge')}>
      {/* Filter controls: [ Country ▼ ] [ Crop ▼ ] */}
      <BricsFilterBar
        filters={filters}
        onChange={setFilters}
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
      />

      {/* AI Synthesis Summary Card */}
      <BricsAiSynthesisCard records={records} />

      {/* Loading state */}
      {loading && (
        <div style={{
          background: '#FFFFFF',
          borderRadius: '14px',
          padding: '2rem 1rem',
          textAlign: 'center',
          border: '1.5px solid #EFEAE2',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}>
          <div style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>⌛</div>
          <div style={{ fontWeight: 800, color: '#334155', fontSize: '0.85rem' }}>{t('common.loading')}</div>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div style={{
          background: '#FEF2F2',
          border: '1px solid #FCA5A5',
          color: '#991B1B',
          padding: '0.85rem',
          borderRadius: '12px',
          textAlign: 'center',
          marginBottom: '1rem',
          fontSize: '0.82rem'
        }}>
          <div>{error}</div>
          <button
            onClick={fetchData}
            style={{
              marginTop: '0.5rem',
              background: '#EF4444',
              color: '#ffffff',
              border: 'none',
              padding: '0.35rem 0.75rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 800,
              fontSize: '0.74rem'
            }}
          >
            {t('buildAi.retryBtn')}
          </button>
        </div>
      )}

      {/* Content Display: 2-Column Responsive Card Grid */}
      {!loading && !error && (
        <>
          {viewMode === 'grid' ? (
            records.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '0.65rem'
              }}>
                {records.map(record => (
                  <BricsKnowledgeCard key={record.id} record={record} />
                ))}
              </div>
            ) : (
              <div style={{
                background: '#FFFFFF',
                border: '1.5px solid #EFEAE2',
                borderRadius: '14px',
                padding: '2rem 1rem',
                textAlign: 'center',
                color: '#64748B'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>🔍</div>
                <div style={{ color: '#0F172A', fontWeight: 800, fontSize: '0.9rem' }}>{t('buildAi.brics.noMatchesTitle')}</div>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem' }}>{t('buildAi.brics.noMatchesSub')}</p>
              </div>
            )
          ) : (
            <BricsComparisonTable groups={comparisonGroups} />
          )}
        </>
      )}
    </BuildAiShell>
  );
};
