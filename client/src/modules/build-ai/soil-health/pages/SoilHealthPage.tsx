import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { soilClientService } from '../soil.service.js';
import { satelliteClientService } from '../../satellite/satellite.service.js';
import { SoilAnalysisInput, SoilAnalysisResult } from '../types.js';
import { SoilFormCard } from '../components/SoilFormCard.js';
import { SoilScoreGauge } from '../components/SoilScoreGauge.js';
import { NutrientBreakdownCard } from '../components/NutrientBreakdownCard.js';
import { SoilRecommendationsCard } from '../components/SoilRecommendationsCard.js';
import { BuildAiShell } from '../../components/BuildAiShell.js';

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
    <BuildAiShell activeRoute="/build-ai/soil-health">
      {/* Page Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <span className="material-symbols-outlined" style={{ color: '#16A34A', fontSize: '24px' }}>potted_plant</span>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
              Soil Health Analysis
            </h1>
          </div>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748B', fontWeight: 500 }}>
            Analyze soil chemistry parameters & receive practical restoration priorities
          </p>
        </div>

        {analysisResult && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '5px 14px',
            borderRadius: '9999px',
            fontSize: '0.8rem',
            fontWeight: 800,
            background: analysisResult.source === 'live_ai' ? '#DCFCE7' : '#E0F2FE',
            color: analysisResult.source === 'live_ai' ? '#15803D' : '#0369A1',
            border: `1px solid ${analysisResult.source === 'live_ai' ? '#BBF7D0' : '#BAE6FD'}`
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: analysisResult.source === 'live_ai' ? '#16A34A' : '#0284C7'
            }} />
            <span>{analysisResult.source === 'live_ai' ? 'LIVE AI EXPLANATION' : 'DETERMINISTIC ANALYSIS'}</span>
          </div>
        )}
      </div>

      {/* Grid: Form Input + Results */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '1.5rem',
        alignItems: 'start'
      }}>
        {/* Form Card */}
        <SoilFormCard
          input={inputForm}
          onChange={setInputForm}
          onSubmit={handleAnalyze}
          onLoadSample={handleLoadSample}
          fields={availableFields}
          isAnalyzing={isAnalyzing}
        />

        {/* Diagnostic Results Side */}
        <div>
          {error && (
            <div style={{
              background: '#FEF2F2',
              border: '1px solid #FCA5A5',
              borderRadius: '14px',
              padding: '1.25rem',
              color: '#991B1B',
              marginBottom: '1.5rem'
            }}>
              <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Analysis Error</div>
              <div style={{ fontSize: '0.85rem' }}>{error}</div>
            </div>
          )}

          {analysisResult ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <SoilScoreGauge
                result={analysisResult}
              />

              <NutrientBreakdownCard
                metrics={analysisResult.metrics}
              />

              <SoilRecommendationsCard
                recommendations={analysisResult.recommendations}
                warnings={analysisResult.warnings}
                source={analysisResult.source}
              />
            </div>
          ) : (
            <div style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '3rem 1.5rem',
              textAlign: 'center',
              border: '1px solid #E2E8F0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🧪</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A' }}>No Soil Analysis Performed</div>
              <div style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '4px' }}>Input lab values on the left or load sample data to generate diagnostic results.</div>
            </div>
          )}
        </div>
      </div>
    </BuildAiShell>
  );
};
