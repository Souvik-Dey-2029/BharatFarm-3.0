import React from 'react';
import { BricsCountryCode, BricsTopicCategory, BricsQueryFilters } from '../types.js';

interface Props {
  filters: BricsQueryFilters;
  onChange: (updated: BricsQueryFilters) => void;
  viewMode: 'grid' | 'comparison';
  onToggleViewMode: (mode: 'grid' | 'comparison') => void;
}

const COUNTRIES: { code: BricsCountryCode | 'ALL'; flag: string; label: string }[] = [
  { code: 'ALL', flag: '🌍', label: 'All BRICS' },
  { code: 'IN', flag: '🇮🇳', label: 'India' },
  { code: 'BR', flag: '🇧🇷', label: 'Brazil' },
  { code: 'RU', flag: '🇷🇺', label: 'Russia' },
  { code: 'CN', flag: '🇨🇳', label: 'China' },
  { code: 'ZA', flag: '🇿🇦', label: 'South Africa' }
];

const TOPICS: { code: BricsTopicCategory | 'ALL'; label: string }[] = [
  { code: 'ALL', label: 'All Topics' },
  { code: 'SOIL_HEALTH', label: 'Soil Health' },
  { code: 'WATER_CONSERVATION', label: 'Water Conservation' },
  { code: 'INTEGRATED_PEST_MGMT', label: 'Pest Management' },
  { code: 'CROP_DIVERSIFICATION', label: 'Crop Diversification' },
  { code: 'CARBON_SEQUESTRATION', label: 'Carbon Sequestration' },
  { code: 'AGROFORESTRY', label: 'Agroforestry' }
];

export const BricsFilterBar: React.FC<Props> = ({
  filters,
  onChange,
  viewMode,
  onToggleViewMode
}) => {
  return (
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
      {/* Top row: Search input & View Mode toggle */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{ flex: '1 1 240px', position: 'relative' }}>
          <input
            type="text"
            placeholder="Search practices, crops, sources..."
            value={filters.search || ''}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
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

        {/* View mode toggle */}
        <div style={{
          display: 'flex',
          background: 'rgba(0,0,0,0.4)',
          borderRadius: '8px',
          padding: '3px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <button
            onClick={() => onToggleViewMode('grid')}
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: '6px',
              border: 'none',
              background: viewMode === 'grid' ? '#10b981' : 'transparent',
              color: viewMode === 'grid' ? '#0b1d12' : '#9ca3af',
              fontWeight: 600,
              fontSize: '0.825rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            📋 Practice Cards
          </button>
          <button
            onClick={() => onToggleViewMode('comparison')}
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: '6px',
              border: 'none',
              background: viewMode === 'comparison' ? '#10b981' : 'transparent',
              color: viewMode === 'comparison' ? '#0b1d12' : '#9ca3af',
              fontWeight: 600,
              fontSize: '0.825rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            ⚖️ Cross-Country Compare
          </button>
        </div>
      </div>

      {/* Country Tabs */}
      <div>
        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#9ca3af', fontWeight: 600, marginBottom: '0.5rem' }}>
          Select BRICS Nation:
        </div>
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '0.25rem'
        }}>
          {COUNTRIES.map(c => {
            const active = (filters.country || 'ALL') === c.code;
            return (
              <button
                key={c.code}
                onClick={() => onChange({ ...filters, country: c.code })}
                style={{
                  padding: '0.4rem 0.75rem',
                  borderRadius: '20px',
                  border: active ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                  background: active ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.03)',
                  color: active ? '#34d399' : '#d1d5db',
                  fontSize: '0.85rem',
                  fontWeight: active ? 600 : 400,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <span>{c.flag}</span>
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Topic Filters */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 200px' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.3rem' }}>
            Topic Domain:
          </label>
          <select
            value={filters.topic || 'ALL'}
            onChange={(e) => onChange({ ...filters, topic: e.target.value as any })}
            style={{
              width: '100%',
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '8px',
              padding: '0.5rem 0.75rem',
              color: '#ffffff',
              fontSize: '0.85rem'
            }}
          >
            {TOPICS.map(t => (
              <option key={t.code} value={t.code} style={{ background: '#111827' }}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div style={{ flex: '1 1 200px' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.3rem' }}>
            Crop Filter:
          </label>
          <select
            value={filters.crop || 'ALL'}
            onChange={(e) => onChange({ ...filters, crop: e.target.value })}
            style={{
              width: '100%',
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '8px',
              padding: '0.5rem 0.75rem',
              color: '#ffffff',
              fontSize: '0.85rem'
            }}
          >
            <option value="ALL" style={{ background: '#111827' }}>All Crops</option>
            <option value="Rice" style={{ background: '#111827' }}>Rice (Paddy)</option>
            <option value="Wheat" style={{ background: '#111827' }}>Wheat</option>
            <option value="Soybean" style={{ background: '#111827' }}>Soybean</option>
            <option value="Corn" style={{ background: '#111827' }}>Corn (Maize)</option>
            <option value="Cotton" style={{ background: '#111827' }}>Cotton</option>
            <option value="Citrus" style={{ background: '#111827' }}>Citrus</option>
            <option value="Sugarcane" style={{ background: '#111827' }}>Sugarcane</option>
          </select>
        </div>
      </div>
    </div>
  );
};
