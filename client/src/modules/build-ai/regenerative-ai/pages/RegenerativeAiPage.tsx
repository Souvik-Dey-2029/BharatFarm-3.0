import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { regenerativeClientService } from '../regenerative.service.js';
import { satelliteClientService } from '../../satellite/satellite.service.js';
import { RegenerativeResponseSchema, RegenerativeContextInput } from '../types.js';
import { ContextGatheringBar } from '../components/ContextGatheringBar.js';
import { ActionGroupCard } from '../components/ActionGroupCard.js';
import { EvidenceAndLimitationsCard } from '../components/EvidenceAndLimitationsCard.js';

export const RegenerativeAiPage: React.FC = () => {
  const navigate = useNavigate();

  const [availableFields, setAvailableFields] = useState<Array<{ id: string; field_name: string; crop_name: string }>>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string>('field_demo_paddy_01');

  const [includeSoil, setIncludeSoil] = useState<boolean>(true);
  const [includeSatellite, setIncludeSatellite] = useState<boolean>(true);

  const [planData, setPlanData] = useState<RegenerativeResponseSchema | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load available fields and sample plan on mount
  useEffect(() => {
    let isMounted = true;
    satelliteClientService.getAvailableFields().then(fields => {
      if (isMounted && fields.length > 0) {
        setAvailableFields(fields.map(f => ({ id: f.id, field_name: f.field_name, crop_name: f.crop_name })));
        setSelectedFieldId(fields[0].id);
      }
    });

    regenerativeClientService.getSamplePlan().then(res => {
      if (isMounted && res.success && res.data) {
        setPlanData(res.data);
        setIsGenerating(false);
      }
    });

    return () => { isMounted = false; };
  }, []);

  const loadPlan = async (overrides?: Partial<RegenerativeContextInput>) => {
    setIsGenerating(true);
    setError(null);

    const selectedField = availableFields.find(f => f.id === selectedFieldId);

    const input: RegenerativeContextInput = {
      fieldId: selectedFieldId,
      fieldName: selectedField?.field_name || 'North Paddy Plot',
      crop: selectedField?.crop_name || 'Rice (Paddy)',
      includeSoilData: overrides?.includeSoilData !== undefined ? overrides.includeSoilData : includeSoil,
      includeSatelliteData: overrides?.includeSatelliteData !== undefined ? overrides.includeSatelliteData : includeSatellite,
      ...overrides
    };

    const res = await regenerativeClientService.generatePlan(input);

    if (res.success && res.data) {
      setPlanData(res.data);
    } else {
      setError(res.error?.message || 'Failed to generate regenerative AI plan.');
    }
    setIsGenerating(false);
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
              🤖 Regenerative AI Engine
            </h1>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)' }}>
              Multi-source intelligence graph & evidence-backed sustainability plan
            </p>
          </div>
        </div>

        {planData && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.78rem',
            fontWeight: 700,
            background: planData.source === 'live_ai' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)',
            color: planData.source === 'live_ai' ? '#4ADE80' : '#FBBF24',
            border: `1px solid ${planData.source === 'live_ai' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: planData.source === 'live_ai' ? '#22C55E' : '#F59E0B'
            }}></span>
            <span>{planData.source === 'live_ai' ? 'LIVE AI ENGINE' : 'DETERMINISTIC FALLBACK'}</span>
          </div>
        )}
      </div>

      {/* Multi-Source Context Gathering Bar */}
      <ContextGatheringBar
        hasSoilData={includeSoil}
        hasSatelliteData={includeSatellite}
        onToggleSoil={() => {
          const next = !includeSoil;
          setIncludeSoil(next);
          loadPlan({ includeSoilData: next, includeSatelliteData: includeSatellite });
        }}
        onToggleSatellite={() => {
          const next = !includeSatellite;
          setIncludeSatellite(next);
          loadPlan({ includeSoilData: includeSoil, includeSatelliteData: next });
        }}
      />

      {/* Preset Scenario Test Buttons */}
      <div style={{
        background: 'rgba(0,0,0,0.25)',
        borderRadius: '14px',
        padding: '0.85rem 1rem',
        border: '1px solid rgba(255,255,255,0.06)',
        marginBottom: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)' }}>
          🧪 Test Context Scenarios:
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              setIncludeSoil(true);
              setIncludeSatellite(true);
              loadPlan({ includeSoilData: true, includeSatelliteData: true });
            }}
            style={{
              padding: '4px 10px',
              fontSize: '0.75rem',
              fontWeight: 600,
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              background: includeSoil && includeSatellite ? '#16A34A' : 'rgba(255,255,255,0.08)',
              color: '#fff'
            }}
          >
            Full Multi-Source Context
          </button>
          <button
            onClick={() => {
              setIncludeSoil(false);
              setIncludeSatellite(true);
              loadPlan({ includeSoilData: false, includeSatelliteData: true });
            }}
            style={{
              padding: '4px 10px',
              fontSize: '0.75rem',
              fontWeight: 600,
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              background: !includeSoil && includeSatellite ? '#F59E0B' : 'rgba(255,255,255,0.08)',
              color: '#fff'
            }}
          >
            Missing Soil Data
          </button>
          <button
            onClick={() => {
              setIncludeSoil(true);
              setIncludeSatellite(false);
              loadPlan({ includeSoilData: true, includeSatelliteData: false });
            }}
            style={{
              padding: '4px 10px',
              fontSize: '0.75rem',
              fontWeight: 600,
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              background: includeSoil && !includeSatellite ? '#F59E0B' : 'rgba(255,255,255,0.08)',
              color: '#fff'
            }}
          >
            Missing Satellite Data
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isGenerating && (
        <div style={{
          background: 'var(--surface-card, #12281a)',
          borderRadius: '16px',
          padding: '3rem 1.5rem',
          textAlign: 'center',
          border: '1px solid rgba(255,255,255,0.08)'
        }}>
          <div className="spin" style={{ fontSize: '2rem', marginBottom: '1rem' }}>🤖</div>
          <p style={{ margin: 0, fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>
            Orchestrating Regenerative AI Intelligence Graph...
          </p>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
            Evaluating soil, climate, satellite, and crop biology context
          </p>
        </div>
      )}

      {/* Error State with Retry */}
      {!isGenerating && error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '16px',
          padding: '2rem 1.5rem',
          textAlign: 'center',
          color: '#FCA5A5'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚠️</div>
          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>Failed to Generate Plan</h4>
          <p style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>{error}</p>
          <button
            onClick={() => loadPlan()}
            style={{
              padding: '0.5rem 1.25rem',
              background: '#EF4444',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            🔄 Retry Plan Generation
          </button>
        </div>
      )}

      {/* Main Plan Results */}
      {!isGenerating && !error && planData && (
        <div>
          {/* Headline & Sustainability Score Banner */}
          <div style={{
            background: 'var(--surface-card, #12281a)',
            borderRadius: '16px',
            padding: '1.25rem',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <div style={{ fontSize: '0.78rem', color: '#34D399', fontWeight: 700, textTransform: 'uppercase' }}>
                Regenerative Plan Output • Schema v1.0.0
              </div>
              <h2 style={{ margin: '0.25rem 0 0 0', fontSize: '1.25rem', color: '#fff', fontWeight: 800 }}>
                {planData.headline}
              </h2>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              background: 'rgba(0,0,0,0.3)',
              padding: '0.6rem 1rem',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.08)'
            }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#34D399' }}>
                {planData.sustainabilityScore}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                Sustainability Index<br />(0-100 Rating)
              </div>
            </div>
          </div>

          {/* Grouped Action Cards */}
          <ActionGroupCard
            title="⚡ Immediate Actions (Next 1–7 Days)"
            icon="⚡"
            actions={planData.immediateActions}
            badgeColor="#34D399"
          />

          <ActionGroupCard
            title="🌱 Soil Building & Organic Carbon"
            icon="🌱"
            actions={planData.soilActions}
            badgeColor="#4ADE80"
          />

          <ActionGroupCard
            title="💧 Water Conservation & AWD"
            icon="💧"
            actions={planData.waterActions}
            badgeColor="#38BDF8"
          />

          <ActionGroupCard
            title="🛡️ Climate & Pest Risk Mitigation"
            icon="🛡️"
            actions={planData.riskMitigation}
            badgeColor="#F59E0B"
          />

          <ActionGroupCard
            title="📅 Full Seasonal Milestones"
            icon="📅"
            actions={planData.seasonalActions}
            badgeColor="#A78BFA"
          />

          {/* Grounding Evidence & Model Card Limitations */}
          <EvidenceAndLimitationsCard
            evidence={planData.evidence}
            assumptions={planData.assumptions}
            limitations={planData.limitations}
          />
        </div>
      )}
    </div>
  );
};
