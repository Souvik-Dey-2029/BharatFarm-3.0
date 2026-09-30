import React from 'react';
import { SoilAnalysisInput } from '../types.js';
import { useLanguage } from '../../../../context/LanguageContext.js';

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
  const { t } = useLanguage();

  const handleChange = (key: keyof SoilAnalysisInput, value: any) => {
    onChange({
      ...input,
      [key]: value
    });
  };

  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: '14px',
      padding: '0.85rem 1rem',
      border: '1px solid #E2E8F0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
      marginBottom: '0.85rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.4rem' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '0.98rem', color: '#0F172A', fontWeight: 800 }}>
            {t('buildAi.soilInputsTitle')}
          </h3>
          <p style={{ margin: 0, fontSize: '0.74rem', color: '#64748B' }}>
            Input measured laboratory values or fill sample
          </p>
        </div>

        <button
          type="button"
          onClick={onLoadSample}
          style={{
            padding: '3px 8px',
            background: '#F0FDF4',
            color: '#15803D',
            border: '1px solid #BBF7D0',
            borderRadius: '6px',
            fontSize: '0.72rem',
            fontWeight: 800,
            cursor: 'pointer'
          }}
        >
          {t('buildAi.fillSample')}
        </button>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
        {/* Field & Crop Selectors in 2-Column Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.55rem', marginBottom: '0.75rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', color: '#475569', fontWeight: 700, marginBottom: '2px' }}>
              Field:
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
                padding: '6px 8px',
                fontSize: '0.8rem',
                fontWeight: 700,
                outline: 'none',
                boxSizing: 'border-box'
              }}
            >
              {fields.map(f => (
                <option key={f.id} value={f.id}>
                  {f.field_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', color: '#475569', fontWeight: 700, marginBottom: '2px' }}>
              Crop:
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
                padding: '6px 8px',
                fontSize: '0.8rem',
                fontWeight: 700,
                outline: 'none',
                boxSizing: 'border-box'
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

        {/* 2-Column Soil Inputs Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.55rem', marginBottom: '0.75rem' }}>
          {/* pH */}
          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', color: '#475569', fontWeight: 700, marginBottom: '2px' }}>
              {t('buildAi.soilPh')} (0 - 14):
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
                padding: '6px 8px',
                fontSize: '0.88rem',
                fontWeight: 800,
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Nitrogen N */}
          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', color: '#475569', fontWeight: 700, marginBottom: '2px' }}>
              {t('buildAi.nitrogen')} (kg/ha):
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
                padding: '6px 8px',
                fontSize: '0.88rem',
                fontWeight: 800,
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Phosphorus P */}
          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', color: '#475569', fontWeight: 700, marginBottom: '2px' }}>
              {t('buildAi.phosphorus')} (kg/ha):
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
                padding: '6px 8px',
                fontSize: '0.88rem',
                fontWeight: 800,
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Potassium K */}
          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', color: '#475569', fontWeight: 700, marginBottom: '2px' }}>
              {t('buildAi.potassium')} (kg/ha):
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
                padding: '6px 8px',
                fontSize: '0.88rem',
                fontWeight: 800,
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        {/* Organic Carbon % (Full Width) */}
        <div style={{ marginBottom: '0.85rem' }}>
          <label style={{ display: 'block', fontSize: '0.7rem', color: '#475569', fontWeight: 700, marginBottom: '2px' }}>
            {t('buildAi.organicCarbon')} (%):
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
              padding: '6px 8px',
              fontSize: '0.88rem',
              fontWeight: 800,
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isAnalyzing}
          style={{
            width: '100%',
            padding: '0.65rem',
            background: '#16A34A',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '10px',
            fontSize: '0.88rem',
            fontWeight: 800,
            cursor: isAnalyzing ? 'not-allowed' : 'pointer',
            boxShadow: '0 2px 4px rgba(22, 163, 74, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem'
          }}
        >
          {isAnalyzing ? t('buildAi.checkingSoil') : t('buildAi.checkSoilBtn')}
        </button>
      </form>
    </div>
  );
};
