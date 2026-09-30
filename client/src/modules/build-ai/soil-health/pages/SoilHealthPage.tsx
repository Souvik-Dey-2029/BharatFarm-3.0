import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { soilClientService } from '../soil.service.js';
import { SoilAnalysisInput, SoilAnalysisResult } from '../types.js';
import { SoilFormCard } from '../components/SoilFormCard.js';
import { NutrientBreakdownCard } from '../components/NutrientBreakdownCard.js';
import { SoilRecommendationsCard } from '../components/SoilRecommendationsCard.js';
import { BuildAiShell } from '../../components/BuildAiShell.js';
import { useSharedField } from '../../context/SharedFieldContext.js';
import { useLanguage } from '../../../../context/LanguageContext.js';

export const SoilHealthPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { fields, selectedFieldId, selectedField, setSelectedFieldId } = useSharedField();

  const [inputForm, setInputForm] = useState<SoilAnalysisInput>({
    fieldId: 'field_demo_paddy_01',
    fieldName: 'North Paddy Plot',
    crop: 'Rice (Paddy)',
    ph: 6.5,
    nitrogen: 220,
    phosphorus: 18,
    potassium: 195,
    organicCarbon: 0.62
  });

  const [analysisResult, setAnalysisResult] = useState<SoilAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Sync field selection from shared context
  useEffect(() => {
    if (selectedField) {
      setInputForm(prev => ({
        ...prev,
        fieldId: selectedField.id,
        fieldName: selectedField.field_name,
        crop: selectedField.crop_name
      }));
    }
  }, [selectedField]);

  // Load sample report on mount
  useEffect(() => {
    let isMounted = true;
    soilClientService.getSampleSoilData().then(res => {
      if (isMounted && res.success && res.data) {
        setAnalysisResult(res.data);
      }
    });

    return () => { isMounted = false; };
  }, []);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setError(null);

    const res = await soilClientService.analyzeSoil(inputForm);

    if (res.success && res.data) {
      setAnalysisResult(res.data);
    } else {
      setError(res.error?.message || t('buildAi.generalError'));
    }
    setIsAnalyzing(false);
  };

  const handleLoadSample = async () => {
    setInputForm({
      fieldId: selectedField?.id || 'field_demo_paddy_01',
      fieldName: selectedField?.field_name || 'North Paddy Plot',
      crop: selectedField?.crop_name || 'Rice (Paddy)',
      ph: 6.5,
      nitrogen: 220,
      phosphorus: 18,
      potassium: 195,
      organicCarbon: 0.62
    });

    setIsAnalyzing(true);
    const res = await soilClientService.getSampleSoilData();
    if (res.success && res.data) {
      setAnalysisResult(res.data);
    }
    setIsAnalyzing(false);
  };

  return (
    <BuildAiShell activeRoute="/build-ai/soil-health" pageTitle={t('buildAi.soilHealth')}>
      {/* Field Selector & Demo Transparency Pill */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '14px',
        padding: '0.75rem 0.9rem',
        border: '1px solid #E2E8F0',
        marginBottom: '0.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.6rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flex: '1 1 200px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: '#F0FDF4',
            color: '#16A34A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>potted_plant</span>
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1px' }}>
              {t('buildAi.fieldSelect')}
            </div>
            <select
              value={selectedFieldId}
              onChange={(e) => setSelectedFieldId(e.target.value)}
              style={{
                background: '#F8FAFC',
                color: '#0F172A',
                border: '1.5px solid #CBD5E1',
                borderRadius: '8px',
                padding: '0.2rem 0.45rem',
                fontSize: '0.82rem',
                fontWeight: 800,
                outline: 'none',
                cursor: 'pointer',
                maxWidth: '100%'
              }}
            >
              {fields.map(f => (
                <option key={f.id} value={f.id}>
                  🌾 {f.field_name} ({f.crop_name})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Demo Transparency Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.3rem',
          padding: '2px 8px',
          borderRadius: '9999px',
          fontSize: '0.68rem',
          fontWeight: 800,
          background: '#FEF3C7',
          color: '#92400E',
          border: '1px solid #FDE68A'
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#D97706' }} />
          <span>Sample field · Demo analysis</span>
        </div>
      </div>

      {/* 1. FIRST: SOIL HEALTH 74/100 🟢 Good */}
      {analysisResult && (
        <div style={{
          background: '#F0FDF4',
          border: '1.5px solid #BBF7D0',
          borderRadius: '14px',
          padding: '0.85rem 1rem',
          marginBottom: '0.75rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.74rem', color: '#15803D', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
              🧪 Soil Health
            </span>
            <span style={{
              fontSize: '0.7rem',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '9999px',
              background: '#DCFCE7',
              color: '#15803D'
            }}>
              🟢 Good
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', margin: '2px 0 0.2rem 0' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0F172A', lineHeight: 1 }}>
              {analysisResult.score}/100
            </span>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#15803D' }}>
              Fertile soil suitable for {inputForm.crop}
            </span>
          </div>
        </div>
      )}

      {/* 2. SECOND: Visual nutrient health progress bars */}
      {analysisResult && (
        <NutrientBreakdownCard metrics={analysisResult.metrics} />
      )}

      {/* 3. THIRD: 🌱 WHAT YOUR SOIL NEEDS (Top 2-3 priorities) */}
      {analysisResult && (
        <SoilRecommendationsCard
          recommendations={analysisResult.recommendations}
          warnings={analysisResult.warnings}
          source={analysisResult.source}
        />
      )}

      {/* 4. FOURTH: Collapsible Soil Test Input Form (Secondary) */}
      <SoilFormCard
        input={inputForm}
        onChange={setInputForm}
        onSubmit={handleAnalyze}
        onLoadSample={handleLoadSample}
        fields={fields}
        isAnalyzing={isAnalyzing}
      />

      {/* Error state if any */}
      {error && (
        <div style={{
          background: '#FEF2F2',
          border: '1px solid #FCA5A5',
          borderRadius: '12px',
          padding: '0.75rem',
          color: '#991B1B',
          marginBottom: '0.75rem',
          fontSize: '0.82rem'
        }}>
          {error}
        </div>
      )}
    </BuildAiShell>
  );
};
