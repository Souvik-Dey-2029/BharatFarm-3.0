import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
        // Also fetch underlying flat records for AI synthesis card
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
          <span style={{ color: '#9ca3af' }}>BRICS Data & Knowledge Hub</span>
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
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#34d399',
                padding: '0.2rem 0.6rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 600
              }}>
                Feature 4
              </span>
              <span style={{
                background: 'rgba(59, 130, 246, 0.2)',
                color: '#60a5fa',
                padding: '0.2rem 0.6rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 500
              }}>
                Track 4 Multi-Nation Data
              </span>
            </div>
            <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700, color: '#ffffff' }}>
              🌐 BRICS Regenerative Knowledge Hub
            </h1>
            <p style={{ margin: '0.35rem 0 0 0', color: '#9ca3af', fontSize: '0.9rem' }}>
              Curated regenerative agricultural practices, soil health techniques, and water conservation models from India, Brazil, Russia, China, and South Africa.
            </p>
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
          <div style={{ padding: '3rem', textAlign: 'center', color: '#10b981' }}>
            <div className="spin" style={{ display: 'inline-block', fontSize: '2rem', marginBottom: '0.5rem' }}>⌛</div>
            <div>Loading BRICS Knowledge Repository...</div>
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
            <p style={{ margin: '0 0 0.5rem 0', fontWeight: 600 }}>Failed to load knowledge records</p>
            <p style={{ margin: 0, fontSize: '0.85rem' }}>{error}</p>
            <button
              onClick={fetchData}
              style={{
                marginTop: '1rem',
                background: '#ef4444',
                color: '#ffffff',
                border: 'none',
                padding: '0.4rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 600
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
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px border-dashed rgba(255,255,255,0.1)',
                  borderRadius: '16px',
                  padding: '3rem',
                  textAlign: 'center',
                  color: '#9ca3af'
                }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔍</div>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#ffffff' }}>No matching BRICS practices found</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem' }}>Try relaxing your country, crop, or search term filters.</p>
                </div>
              )
            ) : (
              <BricsComparisonTable groups={comparisonGroups} />
            )}
          </>
        )}
      </div>
    </div>
  );
};
