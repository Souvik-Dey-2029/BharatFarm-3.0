import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { soilClientService } from '../soil.service.js';
import { SoilAnalysisInput, SoilAnalysisResult } from '../types.js';
import { SoilFormCard } from '../components/SoilFormCard.js';
import { SoilScoreGauge } from '../components/SoilScoreGauge.js';
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
      {/* Field Selector & Source Pill */}
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

        {/* Source Badge */}
        {analysisResult && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            padding: '3px 8px',
            borderRadius: '9999px',
            fontSize: '0.68rem',
            fontWeight: 800,
            background: analysisResult.source === 'live_ai' ? '#DCFCE7' : '#E0F2FE',
            color: analysisResult.source === 'live_ai' ? '#15803D' : '#0369A1',
            border: `1px solid ${analysisResult.source === 'live_ai' ? '#BBF7D0' : '#BAE6FD'}`
          }}>
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: analysisResult.source === 'live_ai' ? '#16A34A' : '#0284C7'
            }} />
            <span>{analysisResult.source === 'live_ai' ? t('buildAi.liveDataBadge') : 'LAB REPORT'}</span>
          </div>
        )}
      </div>

      {/* Answer: "Is my soil okay?" */}
      {/* 2-Column Compact Top Health Indicator Cards */}
      {analysisResult && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0.65rem',
          marginBottom: '0.75rem'
        }}>
          {/* Card 1: 🧪 Soil Health Score */}
          <div style={{
            background: '#FFFFFF',
            border: '1.5px solid #BBF7D0',
            borderRadius: '14px',
            padding: '0.75rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}>
            <div>
              <div style={{ fontSize: '0.68rem', color: '#15803D', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                🧪 {t('buildAi.soilScore')}
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#16A34A', marginTop: '2px', lineHeight: 1.2 }}>
                {analysisResult.score} / 100
              </div>
            </div>
            <div style={{
              fontSize: '0.72rem',
              color: '#15803D',
              fontWeight: 700,
              marginTop: '0.4rem',
              background: '#F0FDF4',
              padding: '2px 6px',
              borderRadius: '6px',
              alignSelf: 'flex-start'
            }}>
              ✓ {t('buildAi.good')}
            </div>
          </div>

          {/* Card 2: 🌾 Crop Suitability */}
          <div style={{
            background: '#FFFFFF',
            border: '1.5px solid #BAE6FD',
            borderRadius: '14px',
            padding: '0.75rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}>
            <div>
              <div style={{ fontSize: '0.68rem', color: '#0369A1', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                🌾 Crop Suitability
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0284C7', marginTop: '2px', lineHeight: 1.2 }}>
                {analysisResult.cropContext.suitabilityScore}%
              </div>
            </div>
            <div style={{
              fontSize: '0.72rem',
              color: '#0369A1',
              fontWeight: 700,
              marginTop: '0.4rem',
              background: '#F0F9FF',
              padding: '2px 6px',
              borderRadius: '6px',
              alignSelf: 'flex-start'
            }}>
              {inputForm.crop}
            </div>
          </div>
        </div>
      )}

      {/* Soil Form Card (Compact 2-Column Inputs) */}
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

      {/* Diagnostic & Recommendations */}
      {analysisResult && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <NutrientBreakdownCard metrics={analysisResult.metrics} />
          <SoilRecommendationsCard
            recommendations={analysisResult.recommendations}
            warnings={analysisResult.warnings}
            source={analysisResult.source}
          />
        </div>
      )}
    </BuildAiShell>
  );
};
