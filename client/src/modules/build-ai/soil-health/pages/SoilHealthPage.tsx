import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { soilClientService } from '../soil.service.js';
import { satelliteClientService } from '../../satellite/satellite.service.js';
import { SoilAnalysisInput, SoilAnalysisResult } from '../types.js';
import { SoilFormCard } from '../components/SoilFormCard.js';
import { SoilScoreGauge } from '../components/SoilScoreGauge.js';
import { NutrientBreakdownCard } from '../components/NutrientBreakdownCard.js';
import { SoilRecommendationsCard } from '../components/SoilRecommendationsCard.js';

export const SoilHealthPage: React.FC = () => {
  const navigate = useNavigate();

  const [availableFields, setAvailableFields] = useState<Array<{ id: string; field_name: string; crop_name: string }>>([]);
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

  // Load available fields and pre-seeded sample soil data on mount
  useEffect(() => {
    let isMounted = true;
    satelliteClientService.getAvailableFields().then(fields => {
      if (isMounted && fields.length > 0) {
        setAvailableFields(fields.map(f => ({ id: f.id, field_name: f.field_name, crop_name: f.crop_name })));
      }
    });

    // Load sample report on mount
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
      setError(res.error?.message || 'Failed to complete soil health analysis.');
    }
    setIsAnalyzing(false);
  };

  const handleLoadSample = async () => {
    setInputForm({
      fieldId: 'field_demo_paddy_01',
      fieldName: 'North Paddy Plot',
      crop: 'Rice (Paddy)',
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
    <div style={{
      minHeight: '100vh',
      background: 'var(--surface-bg, #0b1d12)',
      color: 'var(--text-primary, #ffffff)',
      padding: '1rem',
      maxWidth: '1200px',
      margin: '0 auto',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.25rem',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={() => navigate('/build-ai')}
            style={{
              padding: '0.5rem 0.85rem',
              background: 'rgba(255,255,255,0.08)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '10px',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            ← Back to Build with AI
          </button>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
              🌱 Soil Health Analysis
            </h1>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)' }}>
              NPK, pH & Organic Carbon evaluation with AI recommendations
            </p>
          </div>
        </div>

        {analysisResult && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.78rem',
            fontWeight: 700,
            background: analysisResult.source === 'live_ai' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)',
            color: analysisResult.source === 'live_ai' ? '#4ADE80' : '#FBBF24',
            border: `1px solid ${analysisResult.source === 'live_ai' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: analysisResult.source === 'live_ai' ? '#22C55E' : '#F59E0B'
            }}></span>
            <span>{analysisResult.source === 'live_ai' ? 'LIVE AI ADVISORY' : 'DETERMINISTIC ANALYSIS'}</span>
          </div>
        )}
      </div>

      {/* Soil Test Form */}
      <SoilFormCard
        input={inputForm}
        onChange={(updated) => setInputForm(updated)}
        onSubmit={handleAnalyze}
        onLoadSample={handleLoadSample}
        isAnalyzing={isAnalyzing}
        fields={availableFields.length > 0 ? availableFields : [
          { id: 'field_demo_paddy_01', field_name: 'North Paddy Plot', crop_name: 'Rice (Paddy)' },
          { id: 'field_demo_wheat_02', field_name: 'East Wheat Parcel', crop_name: 'Wheat' }
        ]}
      />

      {/* Error Message */}
      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '16px',
          padding: '1.25rem',
          color: '#FCA5A5',
          marginBottom: '1.25rem'
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Soil Analysis Results */}
      {analysisResult && (
        <div>
          {/* Score Gauge & Suitability */}
          <SoilScoreGauge result={analysisResult} />

          {/* Metric Breakdown */}
          <NutrientBreakdownCard metrics={analysisResult.metrics} />

          {/* Recommendations & Warnings */}
          <SoilRecommendationsCard
            recommendations={analysisResult.recommendations}
            warnings={analysisResult.warnings}
            source={analysisResult.source}
          />
        </div>
      )}
    </div>
  );
};
