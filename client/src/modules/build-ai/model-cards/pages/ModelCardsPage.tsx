import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MODEL_CARDS_REGISTRY, ModelCategory } from '../types.js';
import { ModelCardDetail } from '../components/ModelCardDetail.js';

const CATEGORIES: { code: ModelCategory | 'ALL'; label: string }[] = [
  { code: 'ALL', label: 'All Intelligence Systems' },
  { code: 'AI_LLM', label: 'AI & LLMs' },
  { code: 'SATELLITE', label: 'Satellite & Remote Sensing' },
  { code: 'WEATHER', label: 'Weather Telemetry' },
  { code: 'MARKET', label: 'Market & Price ML' },
  { code: 'ML_COMPUTER_VISION', label: 'Computer Vision' },
  { code: 'KNOWLEDGE', label: 'BRICS Knowledge Base' }
];

export const ModelCardsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<ModelCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredCards = MODEL_CARDS_REGISTRY.filter((card) => {
    if (selectedCategory !== 'ALL' && card.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      return (
        card.name.toLowerCase().includes(q) ||
        card.purpose.toLowerCase().includes(q) ||
        card.modelProviderLibrary.toLowerCase().includes(q) ||
        card.dataSource.toLowerCase().includes(q)
      );
    }
    return true;
  });

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
          <span style={{ color: '#9ca3af' }}>Data Sources & Model Cards</span>
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
                background: 'rgba(156, 163, 175, 0.2)',
                color: '#d1d5db',
                padding: '0.2rem 0.6rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 600
              }}>
                Feature 7
              </span>
              <span style={{
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#34d399',
                padding: '0.2rem 0.6rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 500
              }}>
                Track 4 Transparency
              </span>
            </div>
            <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700, color: '#ffffff' }}>
              📋 Data Sources & Model Cards Registry
            </h1>
            <p style={{ margin: '0.35rem 0 0 0', color: '#9ca3af', fontSize: '0.9rem' }}>
              Transparent documentation of all AI, machine learning, satellite, weather, and market models deployed across BharatFarm.
            </p>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '1.25rem',
          marginBottom: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div style={{ flex: 1 }}>
            <input
              type="text"
              placeholder="Search model cards by name, provider, library, or data source..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                padding: '0.6rem 0.85rem',
                color: '#ffffff',
                fontSize: '0.9rem'
              }}
            />
          </div>

          {/* Category Pills */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            overflowX: 'auto',
            paddingBottom: '0.25rem'
          }}>
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.code;
              return (
                <button
                  key={cat.code}
                  onClick={() => setSelectedCategory(cat.code as any)}
                  style={{
                    padding: '0.4rem 0.85rem',
                    borderRadius: '20px',
                    border: active ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                    background: active ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.03)',
                    color: active ? '#34d399' : '#d1d5db',
                    fontSize: '0.825rem',
                    fontWeight: active ? 600 : 400,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Model Cards Grid */}
        {filteredCards.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '1.5rem'
          }}>
            {filteredCards.map((card) => (
              <ModelCardDetail key={card.id} card={card} />
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
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#ffffff' }}>No matching model cards found</h4>
            <p style={{ margin: 0, fontSize: '0.85rem' }}>Try clearing your search query or selecting another category filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};
