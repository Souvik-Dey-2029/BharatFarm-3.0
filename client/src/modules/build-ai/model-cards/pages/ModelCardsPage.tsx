import React, { useState } from 'react';
import { MODEL_CARDS_REGISTRY, ModelCategory } from '../types.js';
import { ModelCardDetail } from '../components/ModelCardDetail.js';
import { BuildAiShell } from '../../components/BuildAiShell.js';

const CATEGORIES: { code: ModelCategory | 'ALL'; label: string }[] = [
  { code: 'ALL', label: 'All Systems' },
  { code: 'AI_LLM', label: 'AI & LLMs' },
  { code: 'SATELLITE', label: 'Satellite' },
  { code: 'WEATHER', label: 'Weather Telemetry' },
  { code: 'MARKET', label: 'Market ML' },
  { code: 'ML_COMPUTER_VISION', label: 'Computer Vision' },
  { code: 'KNOWLEDGE', label: 'BRICS Knowledge' }
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
    <BuildAiShell activeRoute="/build-ai/model-cards">
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <span className="material-symbols-outlined" style={{ color: '#64748B', fontSize: '24px' }}>description</span>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
              Data Sources & Model Cards Registry
            </h1>
          </div>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748B', fontWeight: 500 }}>
            Transparent documentation of all AI, machine learning, satellite, weather & market models
          </p>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '16px',
        padding: '1.25rem',
        marginBottom: '1.5rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
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
              background: '#F8FAFC',
              border: '1.5px solid #CBD5E1',
              borderRadius: '8px',
              padding: '0.6rem 0.85rem',
              color: '#0F172A',
              fontSize: '0.875rem',
              fontWeight: 600,
              outline: 'none'
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
                  border: active ? '1.5px solid #16A34A' : '1px solid #E2E8F0',
                  background: active ? '#DCFCE7' : '#F8FAFC',
                  color: active ? '#15803D' : '#475569',
                  fontSize: '0.825rem',
                  fontWeight: active ? 800 : 600,
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
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '16px',
          padding: '3rem',
          textAlign: 'center',
          color: '#64748B'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔍</div>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#0F172A', fontWeight: 800 }}>No matching model cards found</h4>
          <p style={{ margin: 0, fontSize: '0.85rem' }}>Try clearing your search query or selecting another category filter.</p>
        </div>
      )}
    </BuildAiShell>
  );
};
