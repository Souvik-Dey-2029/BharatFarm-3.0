import React, { useState } from 'react';
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
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

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
      padding: '0.75rem 0.9rem',
      border: '1.5px solid #EFEAE2',
      boxShadow: '0 1px 3px rgba(180, 83, 9, 0.03)',
      marginBottom: '0.75rem'
    }}>
      {/* Clickable Header: Visually secondary to the soil interpretation results */}
      <div
        onClick={() => setIsFormOpen(!isFormOpen)}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#16A34A' }}>tune</span>
          <div>
            <h4 style={{ margin: 0, fontSize: '0.86rem', color: '#0F172A', fontWeight: 800 }}>
              {t('buildAi.soil.adjustValuesTitle')}
            </h4>
            <span style={{ fontSize: '0.7rem', color: '#64748B' }}>
              {t('buildAi.soil.sampleFieldTap')}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onLoadSample();
            }}
            style={{
              padding: '2px 7px',
              background: '#F0FDF4',
              color: '#15803D',
              border: '1px solid #BBF7D0',
              borderRadius: '6px',
              fontSize: '0.7rem',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            {t('buildAi.resetSample')}
          </button>
          <span style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 700 }}>
            {isFormOpen ? '▲' : '▼'}
          </span>
        </div>
      </div>

      {isFormOpen && (
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} style={{ marginTop: '0.75rem', paddingTop: '0.65rem', borderTop: '1px solid #F1F5F9' }}>
          {/* Field & Crop Selectors */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.55rem', marginBottom: '0.65rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.68rem', color: '#475569', fontWeight: 700, marginBottom: '2px' }}>
                {t('buildAi.soil.fieldLabel')}
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
                  borderRadius: '6px',
                  padding: '5px 7px',
                  fontSize: '0.78rem',
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
              <label style={{ display: 'block', fontSize: '0.68rem', color: '#475569', fontWeight: 700, marginBottom: '2px' }}>
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
                  borderRadius: '6px',
                  padding: '5px 7px',
                  fontSize: '0.78rem',
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.55rem', marginBottom: '0.65rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.68rem', color: '#475569', fontWeight: 700, marginBottom: '2px' }}>
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
                  borderRadius: '6px',
                  padding: '5px 7px',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.68rem', color: '#475569', fontWeight: 700, marginBottom: '2px' }}>
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
                  borderRadius: '6px',
                  padding: '5px 7px',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.68rem', color: '#475569', fontWeight: 700, marginBottom: '2px' }}>
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
                  borderRadius: '6px',
                  padding: '5px 7px',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.68rem', color: '#475569', fontWeight: 700, marginBottom: '2px' }}>
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
                  borderRadius: '6px',
                  padding: '5px 7px',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '0.65rem' }}>
            <label style={{ display: 'block', fontSize: '0.68rem', color: '#475569', fontWeight: 700, marginBottom: '2px' }}>
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
                borderRadius: '6px',
                padding: '5px 7px',
                fontSize: '0.82rem',
                fontWeight: 800,
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isAnalyzing}
            style={{
              width: '100%',
              padding: '0.55rem',
              background: '#16A34A',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: isAnalyzing ? 'not-allowed' : 'pointer'
            }}
          >
            {isAnalyzing ? t('buildAi.checkingSoil') : t('buildAi.recalculateSoilBtn')}
          </button>
        </form>
      )}
    </div>
  );
};
