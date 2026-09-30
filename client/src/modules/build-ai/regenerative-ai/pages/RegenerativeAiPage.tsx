import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { regenerativeClientService } from '../regenerative.service.js';
import { RegenerativeResponseSchema, RegenerativeContextInput } from '../types.js';
import { ContextGatheringBar } from '../components/ContextGatheringBar.js';
import { ActionGroupCard } from '../components/ActionGroupCard.js';
import { EvidenceAndLimitationsCard } from '../components/EvidenceAndLimitationsCard.js';
import { BuildAiShell } from '../../components/BuildAiShell.js';
import { useSharedField } from '../../context/SharedFieldContext.js';
import { useLanguage } from '../../../../context/LanguageContext.js';

export const RegenerativeAiPage: React.FC = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { fields, selectedFieldId, selectedField, setSelectedFieldId } = useSharedField();

  const [includeSoil, setIncludeSoil] = useState<boolean>(true);
  const [includeSatellite, setIncludeSatellite] = useState<boolean>(true);

  const [planData, setPlanData] = useState<RegenerativeResponseSchema | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadPlan = async (overrides?: Partial<RegenerativeContextInput>) => {
    setIsGenerating(true);
    setError(null);

    const input: RegenerativeContextInput = {
      fieldId: selectedFieldId,
      fieldName: selectedField?.field_name || 'North Paddy Plot',
      crop: selectedField?.crop_name || 'Rice (Paddy)',
      includeSoilData: overrides?.includeSoilData !== undefined ? overrides.includeSoilData : includeSoil,
      includeSatelliteData: overrides?.includeSatelliteData !== undefined ? overrides.includeSatelliteData : includeSatellite,
      ...overrides
    };

    const res = await regenerativeClientService.generatePlan(input, language);
    setIsGenerating(false);

    if (res.success && res.data) {
      setPlanData(res.data);
    } else {
      setError(typeof res.error === 'string' ? res.error : res.error?.message || t('buildAi.aiError'));
    }
  };

  // Reload plan on mount or when language or selected field changes
  useEffect(() => {
    loadPlan();
  }, [selectedFieldId, language]);

  return (
    <BuildAiShell activeRoute="/build-ai/regenerative-ai" pageTitle={t('buildAi.regenAi')}>
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
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>psychology</span>
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
          <span>{t('buildAi.sampleFieldDemo')}</span>
        </div>
      </div>

      {/* Main Farmer Question: "🌾 What should I do today?" */}
      <div style={{
        background: 'linear-gradient(135deg, #FDFBF7 0%, #DCFCE7 100%)',
        borderRadius: '14px',
        padding: '0.85rem 1rem',
        border: '1.5px solid #EFEAE2',
        marginBottom: '0.75rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.65rem',
        boxShadow: '0 1px 3px rgba(180, 83, 9, 0.03)'
      }}>
        <div>
          <div style={{ fontSize: '0.68rem', color: '#15803D', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: '2px' }}>
            {t('buildAi.regenerative.heading')}
          </div>
          <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: '#0F172A', lineHeight: 1.25 }}>
            {planData?.headline || `${t('buildAi.regenAi')} (${selectedField?.crop_name || 'Rice'})`}
          </h2>
        </div>

        {planData && (
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #BBF7D0',
            borderRadius: '10px',
            padding: '0.35rem 0.75rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 700 }}>{t('buildAi.regenerative.sustainabilityScore')}</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#16A34A' }}>
              {planData.sustainabilityScore}/100
            </div>
          </div>
        )}
      </div>

      {/* Visual Ingested Data Row: 🛰️ Satellite ✓ | 🧪 Soil ✓ | 🌾 Crop ✓ */}
      <ContextGatheringBar
        availableFields={fields}
        selectedFieldId={selectedFieldId}
        onSelectField={(id: string) => setSelectedFieldId(id)}
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
          borderRadius: '14px',
          padding: '2rem 1rem',
          textAlign: 'center',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          marginBottom: '0.85rem'
        }}>
          <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>🌱</div>
          <p style={{ margin: 0, fontWeight: 800, color: '#334155', fontSize: '0.85rem' }}>
            Preparing your advice...
          </p>
        </div>
      )}

      {/* Error Card */}
      {error && !isGenerating && (
        <div style={{
          background: '#FEF2F2',
          border: '1px solid #FCA5A5',
          borderRadius: '12px',
          padding: '0.85rem',
          color: '#991B1B',
          marginBottom: '0.85rem',
          fontSize: '0.82rem'
        }}>
          {error}
        </div>
      )}

      {/* Priority Action Cards: Immediate (Priority 1, 2), Soil, Water */}
      {!isGenerating && !error && planData && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {/* Highest Priority Recommendations */}
          <ActionGroupCard
            title="Today's Priority Actions"
            icon="flash_on"
            actions={planData.immediateActions}
            defaultExpanded={true}
          />

          <ActionGroupCard
            title="Soil Improvement Actions"
            icon="potted_plant"
            actions={planData.soilActions}
            defaultExpanded={true}
          />

          <ActionGroupCard
            title="Water Management Actions"
            icon="water_drop"
            actions={planData.waterActions}
            defaultExpanded={false}
          />

          <ActionGroupCard
            title="Pest & Seasonal Risk Actions"
            icon="shield"
            actions={planData.riskMitigation}
            defaultExpanded={false}
          />

          {/* Evidence Details behind collapsible card */}
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
