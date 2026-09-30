import React from 'react';
import { SoilAnalysisInput } from '../types.js';

interface SoilFormCardProps {
  input: SoilAnalysisInput;
  onChange: (updated: SoilAnalysisInput) => void;
  onSubmit: () => void;
  onLoadSample: () => void;
  isAnalyzing: boolean;
  fields: Array<{ id: string; field_name: string; crop_name: string }>;
}

export const SoilFormCard: React.FC<SoilFormCardProps> = ({
  input,
  onChange,
  onSubmit,
  onLoadSample,
  isAnalyzing,
  fields
}) => {
  const handleChange = (key: keyof SoilAnalysisInput, value: any) => {
    onChange({
      ...input,
      [key]: value
    });
  };

  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: '16px',
      padding: '1.5rem',
      border: '1px solid #E2E8F0',
      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
      marginBottom: '1.25rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0F172A', fontWeight: 800 }}>
            Enter Soil Test Parameters
          </h3>
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748B' }}>
            Input measured laboratory values or pre-fill sample values
          </p>
        </div>

        <button
          type="button"
          onClick={onLoadSample}
          style={{
            padding: '5px 12px',
            background: '#F0FDF4',
            color: '#15803D',
            border: '1px solid #BBF7D0',
            borderRadius: '8px',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Load Sample Report
        </button>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
        {/* Field & Crop Selectors */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.85rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: '#475569', fontWeight: 700, marginBottom: '4px' }}>
              Select Field:
            </label>
            <select
              value={input.fieldId || ''}
              onChange={(e) => {
                const selected = fields.find(f => f.id === e.target.value);
                onChange({
                  ...input,
                  fieldId: e.target.value,
                  fieldName: selected?.field_name || input.fieldName,
                  crop: selected?.crop_name || input.crop
                });
              }}
              style={{
                width: '100%',
                background: '#F8FAFC',
                color: '#0F172A',
                border: '1.5px solid #CBD5E1',
                borderRadius: '8px',
                padding: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                outline: 'none'
              }}
            >
              {fields.map(f => (
                <option key={f.id} value={f.id}>
                  {f.field_name} ({f.crop_name})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: '#475569', fontWeight: 700, marginBottom: '4px' }}>
              Target Crop:
            </label>
            <select
              value={input.crop || 'Rice (Paddy)'}
              onChange={(e) => handleChange('crop', e.target.value)}
              style={{
                width: '100%',
                background: '#F8FAFC',
                color: '#0F172A',
                border: '1.5px solid #CBD5E1',
                borderRadius: '8px',
                padding: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                outline: 'none'
              }}
            >
              <option value="Rice (Paddy)">Rice (Paddy)</option>
              <option value="Wheat">Wheat</option>
              <option value="Maize">Maize</option>
              <option value="Mustard">Mustard</option>
              <option value="Cotton">Cotton</option>
              <option value="Sugarcane">Sugarcane</option>
              <option value="Vegetables">Vegetables</option>
            </select>
          </div>
        </div>

        {/* Soil Metrics Inputs Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.85rem', marginBottom: '1.25rem' }}>
          {/* pH */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: '#475569', fontWeight: 700, marginBottom: '4px' }}>
              Soil pH (0 - 14):
            </label>
            <input
              type="number"
              step="0.1"
              min="3"
              max="11"
              value={input.ph}
              onChange={(e) => handleChange('ph', parseFloat(e.target.value) || 0)}
              style={{
                width: '100%',
                background: '#F8FAFC',
                color: '#0F172A',
                border: '1.5px solid #CBD5E1',
                borderRadius: '8px',
                padding: '8px',
                fontSize: '0.9rem',
                fontWeight: 700,
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Nitrogen N */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: '#475569', fontWeight: 700, marginBottom: '4px' }}>
              Nitrogen N (kg/ha):
            </label>
            <input
              type="number"
              min="0"
              max="1000"
              value={input.nitrogen}
              onChange={(e) => handleChange('nitrogen', parseFloat(e.target.value) || 0)}
              style={{
                width: '100%',
                background: '#F8FAFC',
                color: '#0F172A',
                border: '1.5px solid #CBD5E1',
                borderRadius: '8px',
                padding: '8px',
                fontSize: '0.9rem',
                fontWeight: 700,
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Phosphorus P */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: '#475569', fontWeight: 700, marginBottom: '4px' }}>
              Phosphorus P (kg/ha):
            </label>
            <input
              type="number"
              min="0"
              max="500"
              value={input.phosphorus}
              onChange={(e) => handleChange('phosphorus', parseFloat(e.target.value) || 0)}
              style={{
                width: '100%',
                background: '#F8FAFC',
                color: '#0F172A',
                border: '1.5px solid #CBD5E1',
                borderRadius: '8px',
                padding: '8px',
                fontSize: '0.9rem',
                fontWeight: 700,
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Potassium K */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: '#475569', fontWeight: 700, marginBottom: '4px' }}>
              Potassium K (kg/ha):
            </label>
            <input
              type="number"
              min="0"
              max="1000"
              value={input.potassium}
              onChange={(e) => handleChange('potassium', parseFloat(e.target.value) || 0)}
              style={{
                width: '100%',
                background: '#F8FAFC',
                color: '#0F172A',
                border: '1.5px solid #CBD5E1',
                borderRadius: '8px',
                padding: '8px',
                fontSize: '0.9rem',
                fontWeight: 700,
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Organic Carbon % */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: '#475569', fontWeight: 700, marginBottom: '4px' }}>
              Organic Carbon (%):
            </label>
            <input
              type="number"
              step="0.05"
              min="0"
              max="5"
              value={input.organicCarbon}
              onChange={(e) => handleChange('organicCarbon', parseFloat(e.target.value) || 0)}
              style={{
                width: '100%',
                background: '#F8FAFC',
                color: '#0F172A',
                border: '1.5px solid #CBD5E1',
                borderRadius: '8px',
                padding: '8px',
                fontSize: '0.9rem',
                fontWeight: 700,
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isAnalyzing}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: '#16A34A',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '10px',
            fontSize: '0.92rem',
            fontWeight: 700,
            cursor: isAnalyzing ? 'not-allowed' : 'pointer',
            boxShadow: '0 2px 6px rgba(22, 163, 74, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
        >
          {isAnalyzing ? 'Analyzing Soil Parameters...' : 'Run Soil Analysis'}
        </button>
      </form>
    </div>
  );
};
