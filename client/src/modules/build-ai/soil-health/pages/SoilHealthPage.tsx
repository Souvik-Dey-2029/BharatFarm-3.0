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
import { tokens } from '../../theme.js';

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
      {/* 1. Field Selector & Transparency Badge */}
      <div style={{
        background: tokens.colors.surfaceLight,
        borderRadius: tokens.radii.md,
        padding: '0.65rem 0.85rem',
        border: `1.5px solid ${tokens.colors.borderDefault}`,
        marginBottom: '0.85rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem',
        boxShadow: tokens.shadows.subtle
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flex: '1 1 auto', minWidth: 0 }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: tokens.radii.sm,
            background: tokens.colors.primaryBg,
            color: tokens.colors.primaryLeaf,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>potted_plant</span>
          </div>

          <div style={{ minWidth: 0, flex: '1 1 auto' }}>
            <label htmlFor="soil-field-select" style={{ display: 'block', fontSize: tokens.typography.micro, color: tokens.colors.textMuted, fontWeight: 800, textTransform: 'uppercase', marginBottom: '1px' }}>
              {t('buildAi.fieldSelect')}
            </label>
            <select
              id="soil-field-select"
              value={selectedFieldId}
              onChange={(e) => setSelectedFieldId(e.target.value)}
              style={{
                background: tokens.colors.surfaceAlt,
                color: tokens.colors.textPrimary,
                border: `1.5px solid #CBD5E1`,
                borderRadius: tokens.radii.sm,
                padding: '0.25rem 0.45rem',
                fontSize: tokens.typography.small,
                fontWeight: 800,
                outline: 'none',
                cursor: 'pointer',
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box'
              }}
            >
              {fields.map(f => (
                <option key={f.id} value={f.id}>
                  {f.field_name} ({f.crop_name})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Demo Transparency Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.35rem',
          padding: '2px 8px',
          borderRadius: tokens.radii.full,
          fontSize: tokens.typography.micro,
          fontWeight: 800,
          background: tokens.colors.statusWatchBg,
          color: tokens.colors.statusWatch,
          border: `1px solid ${tokens.colors.statusWatchBorder}`
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#D97706' }} />
          <span>{t('buildAi.sampleFieldDemo')}</span>
        </div>
      </div>

      {/* Main Responsive Layout (Desktop Multi-Column, Mobile Diagnostic Flow) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1rem',
        alignItems: 'start'
      }}>
        {/* Left Column: Soil Health Score, Main Need & Climate Context */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {/* SOIL HEALTH 74/100 Visual Gauge */}
          {analysisResult && (
            <div style={{
              background: tokens.colors.surfaceLight,
              border: `1.5px solid ${tokens.colors.borderDefault}`,
              borderRadius: tokens.radii.md,
              padding: '1rem',
              boxShadow: tokens.shadows.subtle
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: tokens.typography.micro, color: tokens.colors.clay, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {t('buildAi.soil.cardTitle')}
                </span>
                <span style={{
                  fontSize: tokens.typography.micro,
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: tokens.radii.full,
                  background: tokens.colors.statusGoodBg,
                  color: tokens.colors.statusGood
                }}>
                  {t('buildAi.good')}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', margin: '2px 0 0.4rem 0' }}>
                <span style={{ fontSize: '2.2rem', fontWeight: 900, color: tokens.colors.textPrimary, lineHeight: 1 }}>
                  {analysisResult.score}/100
                </span>
                <span style={{ fontSize: '0.86rem', fontWeight: 700, color: tokens.colors.primaryLeaf }}>
                  {t('buildAi.soil.fertileCropDesc').replace('{crop}', inputForm.crop || '')}
                </span>
              </div>

              {/* Radial or Visual Meter Scale */}
              <div style={{
                width: '100%',
                height: '8px',
                background: '#E2E8F0',
                borderRadius: '4px',
                overflow: 'hidden',
                marginTop: '0.4rem'
              }}>
                <div style={{
                  width: `${analysisResult.score}%`,
                  height: '100%',
                  background: 'linear-gradient(to right, #B45F43, #15803D)',
                  borderRadius: '4px'
                }} />
              </div>

              {/* Main Need Notice */}
              <div style={{
                marginTop: '0.85rem',
                background: tokens.colors.surfaceAlt,
                border: `1px solid ${tokens.colors.borderDefault}`,
                borderRadius: tokens.radii.sm,
                padding: '0.55rem 0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem'
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: tokens.colors.statusWatch }}>priority_high</span>
                <div>
                  <div style={{ fontSize: tokens.typography.micro, color: tokens.colors.textMuted, fontWeight: 700, textTransform: 'uppercase' }}>
                    Main Need
                  </div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: tokens.colors.textPrimary }}>
                    Nitrogen & Organic Carbon need attention
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Climate Context Component */}
          <div style={{
            background: tokens.colors.surfaceLight,
            border: `1.5px solid ${tokens.colors.borderDefault}`,
            borderRadius: tokens.radii.md,
            padding: '0.85rem 1rem',
            boxShadow: tokens.shadows.subtle
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px', color: tokens.colors.sky }}>cloudy</span>
              <span style={{ fontSize: tokens.typography.micro, fontWeight: 800, color: tokens.colors.textSecondary, textTransform: 'uppercase' }}>
                {t('buildAi.regenerative.whyModalSignalWeather')} Context
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '1.15rem', fontWeight: 900, color: tokens.colors.textPrimary }}>28°C · Rain possible</span>
              <span style={{ fontSize: tokens.typography.micro, fontWeight: 700, color: tokens.colors.textMuted }}>68% humidity</span>
            </div>
          </div>
        </div>

        {/* Right Column: Nutrient Breakdown & Action Recommendations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {/* Visual Nutrient Breakdown Progress Bars */}
          {analysisResult && (
            <NutrientBreakdownCard metrics={analysisResult.metrics} />
          )}

          {/* WHAT YOUR SOIL NEEDS (Prioritized Actions) */}
          {analysisResult && (
            <SoilRecommendationsCard
              recommendations={analysisResult.recommendations}
              warnings={analysisResult.warnings}
              source={analysisResult.source}
            />
          )}

          {/* Collapsible Soil Test Input Form (Secondary) */}
          <SoilFormCard
            input={inputForm}
            onChange={setInputForm}
            onSubmit={handleAnalyze}
            onLoadSample={handleLoadSample}
            fields={fields}
            isAnalyzing={isAnalyzing}
          />
        </div>
      </div>

      {/* Error state if any */}
      {error && (
        <div style={{
          background: tokens.colors.statusAlertBg,
          border: `1px solid ${tokens.colors.statusAlertBorder}`,
          borderRadius: tokens.radii.md,
          padding: '0.75rem',
          color: tokens.colors.statusAlert,
          marginTop: '0.75rem',
          fontSize: tokens.typography.small
        }}>
          {error}
        </div>
      )}
    </BuildAiShell>
  );
};
