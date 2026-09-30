import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { regenerativeClientService } from '../regenerative.service.js';
import { satelliteClientService } from '../../satellite/satellite.service.js';
import { RegenerativeResponseSchema, RegenerativeContextInput } from '../types.js';
import { ContextGatheringBar } from '../components/ContextGatheringBar.js';
import { ActionGroupCard } from '../components/ActionGroupCard.js';
import { EvidenceAndLimitationsCard } from '../components/EvidenceAndLimitationsCard.js';
import { BuildAiShell } from '../../components/BuildAiShell.js';

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
    setIsGenerating(false);

    if (res.success && res.data) {
      setPlanData(res.data);
    } else {
      setError(typeof res.error === 'string' ? res.error : res.error?.message || 'Failed to generate regenerative plan.');
    }
  };

  return (
    <BuildAiShell activeRoute="/build-ai/regenerative-ai">
      {/* Field & Engine Source Strip */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '14px',
        padding: '0.85rem 1rem',
        border: '1px solid #E2E8F0',
        marginBottom: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: '#F0FDF4',
            color: '#16A34A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>psychology</span>
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.15rem' }}>
              Field Intelligence Pipeline
            </div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A' }}>
              {availableFields.find(f => f.id === selectedFieldId)?.field_name || 'Selected Field'} • Decision Support
            </div>
          </div>
        </div>

        {planData && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '4px 10px',
            borderRadius: '9999px',
            fontSize: '0.74rem',
            fontWeight: 800,
            background: planData.source === 'live_ai' ? '#DCFCE7' : '#FEF3C7',
            color: planData.source === 'live_ai' ? '#15803D' : '#B45309',
            border: `1px solid ${planData.source === 'live_ai' ? '#BBF7D0' : '#FDE68A'}`
          }}>
            <span style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: planData.source === 'live_ai' ? '#16A34A' : '#D97706'
            }} />
            <span>{planData.source === 'live_ai' ? 'LIVE AI ENGINE' : 'DETERMINISTIC ENGINE'}</span>
          </div>
        )}
      </div>

      {/* Multi-Source Context Gathering Bar */}
      <ContextGatheringBar
        availableFields={availableFields}
        selectedFieldId={selectedFieldId}
        onSelectField={(id: string) => {
          setSelectedFieldId(id);
          loadPlan({ fieldId: id });
        }}
        includeSoil={includeSoil}
        onToggleSoil={(val: boolean) => {
          setIncludeSoil(val);
          loadPlan({ includeSoilData: val });
        }}
        includeSatellite={includeSatellite}
        onToggleSatellite={(val: boolean) => {
          setIncludeSatellite(val);
          loadPlan({ includeSatelliteData: val });
        }}
        onRefresh={() => loadPlan()}
        isGenerating={isGenerating}
      />

      {/* Loading Skeleton */}
      {isGenerating && (
        <div style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          padding: '3rem 1.5rem',
          textAlign: 'center',
          border: '1px solid #E2E8F0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          marginBottom: '1.5rem'
        }}>
          <div className="spin" style={{ fontSize: '2rem', marginBottom: '1rem' }}>🤖</div>
          <p style={{ margin: 0, fontWeight: 700, color: '#334155' }}>
            Synthesizing Regenerative Action Plan...
          </p>
        </div>
      )}

      {/* Error Card */}
      {error && !isGenerating && (
        <div style={{
          background: '#FEF2F2',
          border: '1px solid #FCA5A5',
          borderRadius: '14px',
          padding: '1.25rem',
          color: '#991B1B',
          marginBottom: '1.5rem'
        }}>
          <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Regenerative Plan Engine Error</div>
          <div style={{ fontSize: '0.85rem' }}>{error}</div>
        </div>
      )}

      {/* Plan Content */}
      {!isGenerating && !error && planData && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Plan Header Headline & Score */}
          <div style={{
            background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
            borderRadius: '16px',
            padding: '1.5rem',
            border: '1.5px solid #BBF7D0',
            boxShadow: '0 4px 16px rgba(22, 163, 74, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <div style={{ fontSize: '0.78rem', color: '#15803D', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: '0.2rem' }}>
                Schema Version {planData.schemaVersion}
              </div>
              <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, color: '#0F172A' }}>
                {planData.headline}
              </h2>
            </div>

            <div style={{
              background: '#FFFFFF',
              border: '1px solid #BBF7D0',
              borderRadius: '12px',
              padding: '0.75rem 1.25rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>Sustainability Rating</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#16A34A' }}>
                {planData.sustainabilityScore}/100
              </div>
            </div>
          </div>

          {/* Action Group Cards */}
          <ActionGroupCard
            title="Immediate Actions (1–3 Days)"
            icon="flash_on"
            badgeColor="#DCFCE7"
            textColor="#15803D"
            actions={planData.immediateActions}
          />

          <ActionGroupCard
            title="Soil Health & Bio-Mass Actions"
            icon="potted_plant"
            badgeColor="#E0F2FE"
            textColor="#0369A1"
            actions={planData.soilActions}
          />

          <ActionGroupCard
            title="Water Conservation & Irrigation"
            icon="water_drop"
            badgeColor="#E0F2FE"
            textColor="#0284C7"
            actions={planData.waterActions}
          />

          <ActionGroupCard
            title="Pest & Micro-Climate Risk Mitigation"
            icon="shield"
            badgeColor="#FEF3C7"
            textColor="#B45309"
            actions={planData.riskMitigation}
          />

          <ActionGroupCard
            title="Seasonal & Cover Crop Strategy"
            icon="calendar_month"
            badgeColor="#F3E8FF"
            textColor="#7E22CE"
            actions={planData.seasonalActions}
          />

          {/* Evidence, Assumptions, & Limitations */}
          <EvidenceAndLimitationsCard
            evidence={planData.evidence}
            assumptions={planData.assumptions}
            limitations={planData.limitations}
          />
        </div>
      )}
    </BuildAiShell>
  );
};
