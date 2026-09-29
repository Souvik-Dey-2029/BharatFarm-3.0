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
      background: 'var(--surface-card, #12281a)',
      borderRadius: '16px',
      padding: '1.25rem',
      border: '1px solid rgba(255,255,255,0.08)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
      marginBottom: '1.25rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-primary, #fff)', fontWeight: 700 }}>
            🧪 Enter Soil Test Parameters
          </h3>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>
            Input lab test values or use sample pre-set data
          </p>
        </div>

        <button
          type="button"
          onClick={onLoadSample}
          style={{
            padding: '4px 10px',
            background: 'rgba(52, 211, 153, 0.15)',
            color: '#34D399',
            border: '1px solid rgba(52, 211, 153, 0.3)',
            borderRadius: '8px',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          ⚡ Load Sample Lab Report
        </button>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
        {/* Field & Crop Selectors */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.85rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600, marginBottom: '4px' }}>
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
                background: 'rgba(0,0,0,0.3)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '8px',
                padding: '8px',
                fontSize: '0.85rem'
              }}
            >
              {fields.map(f => (
                <option key={f.id} value={f.id} style={{ background: '#0d1f14', color: '#fff' }}>
                  {f.field_name} ({f.crop_name})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600, marginBottom: '4px' }}>
              Target Crop:
            </label>
            <select
              value={input.crop || 'Rice (Paddy)'}
              onChange={(e) => handleChange('crop', e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.3)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '8px',
                padding: '8px',
                fontSize: '0.85rem'
              }}
            >
              <option value="Rice (Paddy)" style={{ background: '#0d1f14' }}>Rice (Paddy)</option>
              <option value="Wheat" style={{ background: '#0d1f14' }}>Wheat</option>
              <option value="Maize" style={{ background: '#0d1f14' }}>Maize</option>
              <option value="Mustard" style={{ background: '#0d1f14' }}>Mustard</option>
              <option value="Cotton" style={{ background: '#0d1f14' }}>Cotton</option>
              <option value="Sugarcane" style={{ background: '#0d1f14' }}>Sugarcane</option>
              <option value="Vegetables" style={{ background: '#0d1f14' }}>Vegetables</option>
            </select>
          </div>
        </div>

        {/* Soil Metrics Inputs Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.85rem', marginBottom: '1.25rem' }}>
          {/* pH */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600, marginBottom: '4px' }}>
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
                background: 'rgba(0,0,0,0.3)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '8px',
                padding: '8px',
                fontSize: '0.9rem',
                fontWeight: 600
              }}
            />
          </div>

          {/* Nitrogen N */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600, marginBottom: '4px' }}>
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
                background: 'rgba(0,0,0,0.3)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '8px',
                padding: '8px',
                fontSize: '0.9rem',
                fontWeight: 600
              }}
            />
          </div>

          {/* Phosphorus P */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600, marginBottom: '4px' }}>
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
                background: 'rgba(0,0,0,0.3)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '8px',
                padding: '8px',
                fontSize: '0.9rem',
                fontWeight: 600
              }}
            />
          </div>

          {/* Potassium K */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600, marginBottom: '4px' }}>
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
                background: 'rgba(0,0,0,0.3)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '8px',
                padding: '8px',
                fontSize: '0.9rem',
                fontWeight: 600
              }}
            />
          </div>

          {/* Organic Carbon % */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600, marginBottom: '4px' }}>
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
                background: 'rgba(0,0,0,0.3)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '8px',
                padding: '8px',
                fontSize: '0.9rem',
                fontWeight: 600
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
            background: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            fontSize: '0.95rem',
            fontWeight: 700,
            cursor: isAnalyzing ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 14px rgba(22, 163, 74, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
        >
          {isAnalyzing ? 'Analyzing Soil Parameters...' : '⚡ Generate AI Soil Analysis & Recommendations'}
        </button>
      </form>
    </div>
  );
};
