import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { regenerativeClientService } from '../regenerative.service.js';
import { RegenerativeResponseSchema, RegenerativeContextInput } from '../types.js';
import { ContextGatheringBar } from '../components/ContextGatheringBar.js';
import { ActionGroupCard } from '../components/ActionGroupCard.js';
import { EvidenceAndLimitationsCard } from '../components/EvidenceAndLimitationsCard.js';
import { WhyAdviceModal } from '../components/WhyAdviceModal.js';
import { BuildAiShell } from '../../components/BuildAiShell.js';
import { useSharedField } from '../../context/SharedFieldContext.js';
import { useLanguage } from '../../../../context/LanguageContext.js';
import { tokens } from '../../theme.js';

export const RegenerativeAiPage: React.FC = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { fields, selectedFieldId, selectedField, setSelectedFieldId } = useSharedField();

  const [includeSoil, setIncludeSoil] = useState<boolean>(true);
  const [includeSatellite, setIncludeSatellite] = useState<boolean>(true);

  const [planData, setPlanData] = useState<RegenerativeResponseSchema | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isWhyModalOpen, setIsWhyModalOpen] = useState<boolean>(false);

  const loadPlan = async (overrides?: Partial<RegenerativeContextInput>) => {
    setIsGenerating(true);
    setError(null);

    const input: RegenerativeContextInput = {
      fieldId: selectedFieldId,
      fieldName: selectedField?.field_name || 'East Wheat Parcel',
      crop: selectedField?.crop_name || 'Wheat',
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

  useEffect(() => {
    loadPlan();
  }, [selectedFieldId, language]);

  return (
    <BuildAiShell activeRoute="/build-ai/regenerative-ai" pageTitle={t('buildAi.regenAi')}>
      {/* 1. Field Selector Header & Demo Transparency Pill */}
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
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>psychology</span>
          </div>
          <div style={{ minWidth: 0, flex: '1 1 auto' }}>
            <div style={{ fontSize: tokens.typography.micro, color: tokens.colors.textMuted, fontWeight: 800, textTransform: 'uppercase', marginBottom: '1px' }}>
              {t('buildAi.fieldSelect')}
            </div>
            <select
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

      {/* Main Responsive Layout: Desktop 35/65 Split, Mobile Focused Priority Stack */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1rem',
        alignItems: 'start'
      }}>
        {/* Left Column / Mobile Context Top Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {/* Main Farmer Advisory Header */}
          <div style={{
            background: tokens.colors.surfaceLight,
            borderRadius: tokens.radii.md,
            padding: '1rem',
            border: `1.5px solid ${tokens.colors.borderDefault}`,
            boxShadow: tokens.shadows.subtle
          }}>
            <div style={{
              fontSize: tokens.typography.micro,
              color: tokens.colors.primaryLeaf,
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: '4px'
            }}>
              {t('buildAi.regenerative.heading')}
            </div>
            <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.18rem', fontWeight: 900, color: tokens.colors.textPrimary, lineHeight: 1.25 }}>
              {planData?.headline || `${t('buildAi.regenAi')} (${selectedField?.crop_name || 'Wheat'})`}
            </h2>

            {planData && (
              <div style={{
                background: tokens.colors.surfaceAlt,
                border: `1px solid ${tokens.colors.borderDefault}`,
                borderRadius: tokens.radii.sm,
                padding: '0.55rem 0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '0.5rem'
              }}>
                <span style={{ fontSize: tokens.typography.small, color: tokens.colors.textSecondary, fontWeight: 700 }}>
                  {t('buildAi.regenerative.sustainabilityScore')}
                </span>
                <span style={{ fontSize: '1.25rem', fontWeight: 900, color: tokens.colors.primaryLeaf }}>
                  {planData.sustainabilityScore}/100
                </span>
              </div>
            )}
          </div>

          {/* Connected Signals Ingestion Bar */}
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
            onOpenWhyModal={() => setIsWhyModalOpen(true)}
          />

          {/* Quick Decision Summary Box */}
          <div style={{
            background: tokens.colors.primaryBg,
            borderRadius: tokens.radii.md,
            border: `1px solid ${tokens.colors.statusGoodBorder}`,
            padding: '0.85rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.45rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: tokens.colors.primaryDeep, fontWeight: 800, fontSize: tokens.typography.small }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>tips_and_updates</span>
              <span>Agricultural Decision Flow</span>
            </div>
            <p style={{ margin: 0, fontSize: tokens.typography.micro, color: tokens.colors.textSecondary, lineHeight: 1.4 }}>
              Satellite canopy readings + soil chemical analysis + live weather signals were synthesized into the prioritized action plan below.
            </p>
          </div>
        </div>

        {/* Right Column / Mobile Action Plan (WHAT / WHY / ACTION) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {/* Loading Skeleton */}
          {isGenerating && (
            <div style={{
              background: tokens.colors.surfaceLight,
              borderRadius: tokens.radii.md,
              padding: '2.5rem 1rem',
              textAlign: 'center',
              border: `1.5px solid ${tokens.colors.borderDefault}`,
              boxShadow: tokens.shadows.subtle
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: tokens.colors.primaryBg,
                color: tokens.colors.primaryLeaf,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '0.65rem'
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>psychology</span>
              </div>
              <p style={{ margin: 0, fontWeight: 800, color: tokens.colors.textPrimary, fontSize: tokens.typography.body }}>
                {t('buildAi.gettingAdvice')}
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && !isGenerating && (
            <div style={{
              background: tokens.colors.statusAlertBg,
              border: `1px solid ${tokens.colors.statusAlertBorder}`,
              borderRadius: tokens.radii.md,
              padding: '0.85rem',
              color: tokens.colors.statusAlert,
              fontSize: tokens.typography.small
            }}>
              {error}
            </div>
          )}

          {/* TOP 3 PRIORITIZED ACTIONS */}
          {!isGenerating && !error && planData && (
            <>
              {/* 01 Immediate Today Action */}
              <ActionGroupCard
                title={t('buildAi.regenerative.actionGroupImmediate')}
                icon="flash_on"
                actions={planData.immediateActions}
                defaultExpanded={true}
              />

              {/* 02 Soil Nutrition & Improvement Action */}
              <ActionGroupCard
                title={t('buildAi.regenerative.actionGroupSoil')}
                icon="potted_plant"
                actions={planData.soilActions}
                defaultExpanded={true}
              />

              {/* 03 Water & Climate Adaptive Action */}
              <ActionGroupCard
                title={t('buildAi.regenerative.actionGroupWater')}
                icon="water_drop"
                actions={planData.waterActions}
                defaultExpanded={false}
              />

              {/* Seasonal & Risk Mitigation Action */}
              <ActionGroupCard
                title={t('buildAi.regenerative.actionGroupPest')}
                icon="shield"
                actions={planData.riskMitigation}
                defaultExpanded={false}
              />

              {/* Evidence & Decision Trace (Progressive Disclosure) */}
              <EvidenceAndLimitationsCard
                evidence={planData.evidence}
                assumptions={planData.assumptions}
                limitations={planData.limitations}
              />
            </>
          )}
        </div>
      </div>

      {/* "Why this advice?" Signal Trace Modal */}
      <WhyAdviceModal
        isOpen={isWhyModalOpen}
        onClose={() => setIsWhyModalOpen(false)}
        cropName={selectedField?.crop_name || 'Wheat'}
        weatherInfo={t('buildAi.regenerative.climateCondition')}
        soilInfo="pH 6.5 · Organic Carbon 0.62%"
        satelliteInfo="NDVI 0.62 · Moderate"
      />
    </BuildAiShell>
  );
};
