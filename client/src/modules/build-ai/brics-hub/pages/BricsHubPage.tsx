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

export const BricsHubPage: React.FC = () => {
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
      setError(err.message || 'Failed to load BRICS Knowledge Hub data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters, viewMode]);

  return (
    <BuildAiShell activeRoute="/build-ai/brics-hub">
      {/* Page Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <span className="material-symbols-outlined" style={{ color: '#16A34A', fontSize: '24px' }}>public</span>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
              BRICS Regenerative Knowledge Hub
            </h1>
          </div>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748B', fontWeight: 500 }}>
            Curated regenerative practices across India, Brazil, Russia, China, and South Africa
          </p>
        </div>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '5px 14px',
          borderRadius: '9999px',
          fontSize: '0.8rem',
          fontWeight: 800,
          background: '#DCFCE7',
          color: '#15803D',
          border: '1px solid #BBF7D0'
        }}>
          <span>🌐 MULTI-NATION REPOSITORY</span>
        </div>
      </div>

      {/* Filter controls */}
      <BricsFilterBar
        filters={filters}
        onChange={setFilters}
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
      />

      {/* AI Synthesis Component */}
      <BricsAiSynthesisCard records={records} />

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
          <div style={{ fontWeight: 700, color: '#334155' }}>Loading BRICS Knowledge Repository...</div>
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
          <p style={{ margin: '0 0 0.5rem 0', fontWeight: 800 }}>Failed to load knowledge records</p>
          <p style={{ margin: 0, fontSize: '0.85rem' }}>{error}</p>
          <button
            onClick={fetchData}
            style={{
              marginTop: '1rem',
              background: '#EF4444',
              color: '#ffffff',
              border: 'none',
              padding: '0.4rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 700
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Content Display */}
      {!loading && !error && (
        <>
          {viewMode === 'grid' ? (
            records.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '1.25rem'
              }}>
                {records.map(record => (
                  <BricsKnowledgeCard key={record.id} record={record} />
                ))}
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
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔍</div>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#0F172A', fontWeight: 800 }}>No matching BRICS practices found</h4>
                <p style={{ margin: 0, fontSize: '0.85rem' }}>Try relaxing your country, crop, or search term filters.</p>
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
