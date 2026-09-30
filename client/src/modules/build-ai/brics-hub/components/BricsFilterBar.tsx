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
      borderRadius: '14px',
      padding: '0.9rem 1rem',
      marginBottom: '1rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.85rem'
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
              background: '#F8FAFC',
              border: '1.5px solid #CBD5E1',
              borderRadius: '8px',
              padding: '0.55rem 0.85rem',
              color: '#0F172A',
              fontSize: '0.88rem',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* View mode toggle */}
        <div style={{
          display: 'flex',
          background: '#F1F5F9',
          borderRadius: '8px',
          padding: '3px',
          border: '1px solid #E2E8F0'
        }}>
          <button
            onClick={() => onToggleViewMode('grid')}
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: '6px',
              border: 'none',
              background: viewMode === 'grid' ? '#FFFFFF' : 'transparent',
              color: viewMode === 'grid' ? '#15803D' : '#64748B',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              boxShadow: viewMode === 'grid' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease'
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
              background: viewMode === 'comparison' ? '#FFFFFF' : 'transparent',
              color: viewMode === 'comparison' ? '#15803D' : '#64748B',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              boxShadow: viewMode === 'comparison' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            ⚖️ Cross-Country Compare
          </button>
        </div>
      </div>

      {/* Country Tabs */}
      <div>
        <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#64748B', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '0.04em' }}>
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
                  padding: '0.4rem 0.8rem',
                  borderRadius: '20px',
                  border: active ? '1.5px solid #16A34A' : '1px solid #CBD5E1',
                  background: active ? '#DCFCE7' : '#F8FAFC',
                  color: active ? '#15803D' : '#475569',
                  fontSize: '0.82rem',
                  fontWeight: active ? 800 : 600,
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
          <label style={{ display: 'block', fontSize: '0.75rem', color: '#475569', fontWeight: 700, marginBottom: '0.3rem' }}>
            Topic Domain:
          </label>
          <select
            value={filters.topic || 'ALL'}
            onChange={(e) => onChange({ ...filters, topic: e.target.value as any })}
            style={{
              width: '100%',
              background: '#F8FAFC',
              border: '1.5px solid #CBD5E1',
              borderRadius: '8px',
              padding: '0.5rem 0.75rem',
              color: '#0F172A',
              fontSize: '0.85rem',
              fontWeight: 600,
              outline: 'none',
              boxSizing: 'border-box'
            }}
          >
            {TOPICS.map(t => (
              <option key={t.code} value={t.code}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div style={{ flex: '1 1 200px' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', color: '#475569', fontWeight: 700, marginBottom: '0.3rem' }}>
            Crop Filter:
          </label>
          <select
            value={filters.crop || 'ALL'}
            onChange={(e) => onChange({ ...filters, crop: e.target.value })}
            style={{
              width: '100%',
              background: '#F8FAFC',
              border: '1.5px solid #CBD5E1',
              borderRadius: '8px',
              padding: '0.5rem 0.75rem',
              color: '#0F172A',
              fontSize: '0.85rem',
              fontWeight: 600,
              outline: 'none',
              boxSizing: 'border-box'
            }}
          >
            <option value="ALL">All Crops</option>
            <option value="Rice">Rice (Paddy)</option>
            <option value="Wheat">Wheat</option>
            <option value="Soybean">Soybean</option>
            <option value="Corn">Corn (Maize)</option>
            <option value="Cotton">Cotton</option>
            <option value="Citrus">Citrus</option>
            <option value="Sugarcane">Sugarcane</option>
          </select>
        </div>
      </div>
    </div>
  );
};
