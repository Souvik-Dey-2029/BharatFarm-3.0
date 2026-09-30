import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { regenerativeClientService } from '../regenerative.service.js';
import { RegenerativeResponseSchema, RegenerativeContextInput } from '../types.js';
import { WhyAdviceModal } from '../components/WhyAdviceModal.js';
import { BuildAiShell } from '../../components/BuildAiShell.js';
import { useSharedField } from '../../context/SharedFieldContext.js';
import { useLanguage } from '../../../../context/LanguageContext.js';
import { tokens } from '../../theme.js';
import { WhatsAppSimulatorModal } from '../../../sih/sahayak/components/WhatsAppSimulatorModal.js';

export const RegenerativeAiPage: React.FC = () => {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { fields, selectedFieldId, selectedField, setSelectedFieldId } = useSharedField();

  const [planData, setPlanData] = useState<RegenerativeResponseSchema | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isWhyModalOpen, setIsWhyModalOpen] = useState<boolean>(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState<boolean>(false);
  const [showFieldDetails, setShowFieldDetails] = useState<boolean>(false);
  const [completedActions, setCompletedActions] = useState<Record<string, boolean>>({});
  const [expandedActionId, setExpandedActionId] = useState<string | null>(null);

  const loadPlan = async (overrides?: Partial<RegenerativeContextInput>) => {
    setIsGenerating(true);
    setError(null);

    const input: RegenerativeContextInput = {
      fieldId: selectedFieldId,
      fieldName: selectedField?.field_name || 'East Wheat Parcel',
      crop: selectedField?.crop_name || 'Wheat',
      includeSoilData: true,
      includeSatelliteData: true,
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

  const toggleComplete = (id: string) => {
    setCompletedActions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleExpand = (id: string) => {
    setExpandedActionId(prev => prev === id ? null : id);
  };

  // Top prioritized 3 actions derived deterministically from planData
  const action1 = planData?.immediateActions?.[0] || {
    id: 'act_01',
    title: t('buildAi.priorityDecisionTitle'),
    description: 'Apply targeted organic compost or split-dose top dressing in early morning hours to replenish nitrogen deficit without root scorch.',
    timing: 'Next 24-48 Hours',
    evidenceTrace: t('buildAi.priorityDecisionBecause'),
    priority: 'HIGH'
  };

  const action2 = {
    id: 'act_02',
    tag: t('buildAi.regenerative.watchTag'),
    title: t('buildAi.regenerative.watchZoneTitle'),
    description: 'Canopy greenness shows slight variation in the perimeter. Inspect soil moisture and drainage channels before the weekend.',
    why: t('buildAi.regenerative.watchZoneWhy'),
    actionLabel: t('buildAi.regenerative.viewFieldAction'),
    onAction: () => navigate('/build-ai/satellite')
  };

  const action3 = {
    id: 'act_03',
    tag: t('buildAi.regenerative.prepareTag'),
    title: t('buildAi.regenerative.prepareRainTitle'),
    description: 'Moderate precipitation is forecast within 48 hours. Pause overhead irrigation and clear field furrow runoff pathways.',
    why: t('buildAi.regenerative.prepareRainWhy'),
    actionLabel: t('buildAi.regenerative.viewTimingAction'),
    onAction: () => setIsWhyModalOpen(true)
  };

  return (
    <BuildAiShell activeRoute="/build-ai/regenerative-ai" pageTitle={t('buildAi.regenAi')}>
      {/* 1. Ultra-clean Header (No card wall — whitespace & typography driven) */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <h1 style={{
            margin: 0,
            fontSize: 'clamp(1.2rem, 3.5vw, 1.6rem)',
            fontWeight: 900,
            color: tokens.colors.textPrimary,
            letterSpacing: '-0.02em',
            lineHeight: 1.2
          }}>
            {t('buildAi.regenerative.heading')}
          </h1>

          {/* Compact Field Selector Pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: tokens.colors.surfaceLight,
            border: `1.5px solid ${tokens.colors.borderDefault}`,
            borderRadius: tokens.radii.full,
            padding: '3px 10px',
            fontSize: tokens.typography.micro,
            fontWeight: 800,
            color: tokens.colors.textPrimary
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '15px', color: tokens.colors.primaryLeaf }}>pin_drop</span>
            <select
              value={selectedFieldId}
              onChange={(e) => setSelectedFieldId(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: tokens.colors.textPrimary,
                fontSize: tokens.typography.micro,
                fontWeight: 800,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {fields.map(f => (
                <option key={f.id} value={f.id}>
                  {f.field_name} · {f.crop_name} ({f.area_acres} ac)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Short Subtitle */}
        <p style={{ margin: 0, fontSize: tokens.typography.small, color: tokens.colors.textSecondary, fontWeight: 500 }}>
          {selectedField?.field_name || 'East Wheat Parcel'} · {selectedField?.crop_name || 'Wheat'} · {t('buildAi.fieldToday')}
        </p>
      </div>

      {/* Loading Skeleton */}
      {isGenerating && (
        <div style={{
          padding: '2.5rem 1rem',
          textAlign: 'center',
          background: tokens.colors.surfaceLight,
          borderRadius: tokens.radii.md,
          border: `1px solid ${tokens.colors.borderDefault}`,
          marginBottom: '1rem'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: tokens.colors.primaryBg,
            color: tokens.colors.primaryLeaf,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '0.5rem'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>psychology</span>
          </div>
          <div style={{ fontWeight: 800, color: tokens.colors.textPrimary, fontSize: tokens.typography.small }}>
            {t('buildAi.gettingAdvice')}
          </div>
        </div>
      )}

      {/* Error state */}
      {error && !isGenerating && (
        <div style={{
          background: tokens.colors.statusAlertBg,
          border: `1px solid ${tokens.colors.statusAlertBorder}`,
          borderRadius: tokens.radii.md,
          padding: '0.85rem',
          color: tokens.colors.statusAlert,
          marginBottom: '1rem',
          fontSize: tokens.typography.small
        }}>
          {error}
        </div>
      )}

      {/* 2. THREE PRIORITIZED ACTIONS (WHAT → WHY → ACTION) */}
      {!isGenerating && !error && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.25rem' }}>
          {/* [01] TODAY'S PRIORITY */}
          <div style={{
            background: tokens.colors.surfaceLight,
            borderRadius: tokens.radii.lg,
            border: `1.5px solid ${tokens.colors.statusGoodBorder}`,
            padding: '1.1rem 1.15rem',
            boxShadow: '0 4px 14px rgba(20, 83, 45, 0.06)',
            position: 'relative',
            opacity: completedActions[action1.id] ? 0.75 : 1,
            transition: 'all 0.15s ease'
          }}>
            {/* Top Indicator */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{
                  background: tokens.colors.primaryDeep,
                  color: '#FFFFFF',
                  fontSize: tokens.typography.micro,
                  fontWeight: 900,
                  padding: '2px 7px',
                  borderRadius: tokens.radii.xs,
                  letterSpacing: '0.04em'
                }}>
                  01
                </span>
                <span style={{
                  fontSize: tokens.typography.micro,
                  fontWeight: 900,
                  color: tokens.colors.primaryLeaf,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}>
                  {t('buildAi.todayPriority')}
                </span>
              </div>

              <span style={{ fontSize: tokens.typography.micro, color: tokens.colors.textMuted, fontWeight: 700 }}>
                {action1.timing}
              </span>
            </div>

            {/* WHAT */}
            <h2 style={{
              margin: '0 0 0.35rem 0',
              fontSize: '1.15rem',
              fontWeight: 900,
              color: completedActions[action1.id] ? tokens.colors.textMuted : tokens.colors.textPrimary,
              textDecoration: completedActions[action1.id] ? 'line-through' : 'none',
              lineHeight: 1.3
            }}>
              {action1.title}
            </h2>

            {/* Expanded instruction if clicked */}
            {expandedActionId === action1.id ? (
              <p style={{ margin: '0 0 0.65rem 0', fontSize: '0.84rem', color: tokens.colors.textSecondary, lineHeight: 1.45 }}>
                {action1.description}
              </p>
            ) : null}

            {/* WHY */}
            <div style={{
              background: tokens.colors.surfaceAlt,
              borderRadius: tokens.radii.sm,
              padding: '0.5rem 0.65rem',
              marginBottom: '0.75rem',
              border: `1px solid ${tokens.colors.borderDefault}`,
              fontSize: tokens.typography.small,
              color: tokens.colors.earth,
              lineHeight: 1.4
            }}>
              <strong style={{ color: tokens.colors.primaryDeep }}>{t('buildAi.whyQuestion')} </strong>
              {action1.evidenceTrace || t('buildAi.priorityDecisionBecause')}
            </div>

            {/* ACTION Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={() => toggleExpand(action1.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: tokens.colors.primaryLeaf,
                  fontSize: tokens.typography.small,
                  fontWeight: 800,
                  cursor: 'pointer',
                  padding: 0,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px'
                }}
              >
                <span>{expandedActionId === action1.id ? t('buildAi.soil.hideTargets') : `${t('buildAi.regenerative.viewAction')} →`}</span>
              </button>

              <button
                onClick={() => toggleComplete(action1.id)}
                style={{
                  background: completedActions[action1.id] ? '#E2E8F0' : tokens.colors.primaryBg,
                  color: completedActions[action1.id] ? tokens.colors.textSecondary : tokens.colors.primaryLeaf,
                  border: `1px solid ${completedActions[action1.id] ? '#CBD5E1' : tokens.colors.statusGoodBorder}`,
                  borderRadius: tokens.radii.sm,
                  padding: '4px 10px',
                  fontSize: tokens.typography.micro,
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span>{completedActions[action1.id] ? t('buildAi.doneBadge') : t('buildAi.markAsDone')}</span>
              </button>
            </div>
          </div>

          {/* [02] WATCH */}
          <div style={{
            background: tokens.colors.surfaceLight,
            borderRadius: tokens.radii.md,
            border: `1.5px solid ${tokens.colors.borderDefault}`,
            padding: '0.9rem 1rem',
            boxShadow: tokens.shadows.subtle,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.45rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{
                  background: tokens.colors.statusWatch,
                  color: '#FFFFFF',
                  fontSize: tokens.typography.micro,
                  fontWeight: 900,
                  padding: '2px 7px',
                  borderRadius: tokens.radii.xs
                }}>
                  02
                </span>
                <span style={{
                  fontSize: tokens.typography.micro,
                  fontWeight: 900,
                  color: tokens.colors.statusWatch,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}>
                  {action2.tag}
                </span>
              </div>
            </div>

            <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 900, color: tokens.colors.textPrimary }}>
              {action2.title}
            </h3>

            <div style={{ fontSize: tokens.typography.small, color: tokens.colors.textSecondary, lineHeight: 1.4 }}>
              <strong style={{ color: tokens.colors.textPrimary }}>{t('buildAi.whyQuestion')} </strong>
              {action2.why}
            </div>

            <div style={{ paddingTop: '0.35rem' }}>
              <button
                onClick={action2.onAction}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: tokens.colors.primaryLeaf,
                  fontSize: tokens.typography.small,
                  fontWeight: 800,
                  cursor: 'pointer',
                  padding: 0,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px'
                }}
              >
                <span>{action2.actionLabel} →</span>
              </button>
            </div>
          </div>

          {/* [03] PREPARE */}
          <div style={{
            background: tokens.colors.surfaceLight,
            borderRadius: tokens.radii.md,
            border: `1.5px solid ${tokens.colors.borderDefault}`,
            padding: '0.9rem 1rem',
            boxShadow: tokens.shadows.subtle,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.45rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{
                  background: tokens.colors.sky,
                  color: '#FFFFFF',
                  fontSize: tokens.typography.micro,
                  fontWeight: 900,
                  padding: '2px 7px',
                  borderRadius: tokens.radii.xs
                }}>
                  03
                </span>
                <span style={{
                  fontSize: tokens.typography.micro,
                  fontWeight: 900,
                  color: tokens.colors.sky,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}>
                  {action3.tag}
                </span>
              </div>
            </div>

            <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 900, color: tokens.colors.textPrimary }}>
              {action3.title}
            </h3>

            <div style={{ fontSize: tokens.typography.small, color: tokens.colors.textSecondary, lineHeight: 1.4 }}>
              <strong style={{ color: tokens.colors.textPrimary }}>{t('buildAi.whyQuestion')} </strong>
              {action3.why}
            </div>

            <div style={{ paddingTop: '0.35rem' }}>
              <button
                onClick={action3.onAction}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: tokens.colors.sky,
                  fontSize: tokens.typography.small,
                  fontWeight: 800,
                  cursor: 'pointer',
                  padding: 0,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px'
                }}
              >
                <span>{action3.actionLabel} →</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. PROGRESSIVE DISCLOSURE TRIGGERS (No giant card wall!) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.65rem',
        paddingTop: '0.5rem',
        borderTop: `1px solid ${tokens.colors.borderDefault}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {/* Why this advice? Button */}
          <button
            onClick={() => setIsWhyModalOpen(true)}
            style={{
              background: tokens.colors.surfaceLight,
              border: `1.5px solid ${tokens.colors.statusGoodBorder}`,
              borderRadius: tokens.radii.sm,
              padding: '0.55rem 0.9rem',
              color: tokens.colors.primaryLeaf,
              fontSize: tokens.typography.small,
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: tokens.shadows.subtle
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '17px' }}>help_outline</span>
            <span>{t('buildAi.regenerative.whyModalTitle')}</span>
          </button>

          {/* Try on WhatsApp Button */}
          <button
            onClick={() => setIsSimulatorOpen(true)}
            style={{
              background: 'linear-gradient(135deg, #064E3B 0%, #065F46 100%)',
              border: '1.5px solid rgba(52, 211, 153, 0.4)',
              borderRadius: tokens.radii.sm,
              padding: '0.55rem 0.9rem',
              color: '#FFFFFF',
              fontSize: tokens.typography.small,
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: tokens.shadows.subtle
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '17px', color: '#34D399' }}>chat</span>
            <span>{t('buildAi.sahayakDemoBtn')}</span>
          </button>
        </div>

        {/* More field details Toggle */}
        <button
          onClick={() => setShowFieldDetails(!showFieldDetails)}
          style={{
            background: 'transparent',
            border: 'none',
            color: tokens.colors.textMuted,
            fontSize: tokens.typography.small,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px'
          }}
        >
          <span>{t('buildAi.regenerative.moreFieldDetails')}</span>
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
            {showFieldDetails ? 'expand_less' : 'expand_more'}
          </span>
        </button>
      </div>

      {/* Collapsible Progressive Disclosure Drawer for Technical Context */}
      {showFieldDetails && planData && (
        <div style={{
          marginTop: '0.85rem',
          padding: '0.85rem 1rem',
          background: tokens.colors.surfaceAlt,
          border: `1px solid ${tokens.colors.borderDefault}`,
          borderRadius: tokens.radii.md,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          {/* Field Information Row */}
          <div>
            <div style={{ fontSize: tokens.typography.micro, fontWeight: 800, color: tokens.colors.primaryLeaf, textTransform: 'uppercase', marginBottom: '4px' }}>
              {t('buildAi.regenerative.evidenceTitle')}
            </div>
            <div style={{ fontSize: tokens.typography.small, color: tokens.colors.textSecondary, lineHeight: 1.4 }}>
              Canopy greenness index: <strong>NDVI 0.72 (Stable)</strong> · Soil assessment: <strong>74/100 (pH 6.5, OC 0.62%)</strong> · Climate: <strong>28°C · Rain possible</strong>
            </div>
          </div>

          {/* How We Decided */}
          <div>
            <div style={{ fontSize: tokens.typography.micro, fontWeight: 800, color: tokens.colors.earth, textTransform: 'uppercase', marginBottom: '4px' }}>
              {t('buildAi.regenerative.howWeDecided')}
            </div>
            <div style={{ fontSize: tokens.typography.micro, color: tokens.colors.textMuted, lineHeight: 1.4 }}>
              BharatFarm combines multispectral Sentinel satellite observations with NPK soil chemistry and local agricultural practices to generate prioritized field steps.
            </div>
          </div>

          {/* About this advice */}
          <div>
            <div style={{ fontSize: tokens.typography.micro, fontWeight: 800, color: tokens.colors.textMuted, textTransform: 'uppercase', marginBottom: '4px' }}>
              {t('buildAi.regenerative.systemAssumptions')}
            </div>
            <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: tokens.typography.micro, color: tokens.colors.textMuted, lineHeight: 1.4 }}>
              <li>Advisory calibrated for {selectedField?.crop_name || 'Wheat'} in the current regional growing cycle.</li>
              <li>Always verify soil moisture before nitrogen top-dressing.</li>
            </ul>
          </div>
        </div>
      )}

      {/* "Why this advice?" Modal Dialog (Signal Trace & Data Sources) */}
      <WhyAdviceModal
        isOpen={isWhyModalOpen}
        onClose={() => setIsWhyModalOpen(false)}
        cropName={selectedField?.crop_name || 'Wheat'}
        weatherInfo={t('buildAi.regenerative.climateCondition')}
        soilInfo="pH 6.5 · Organic Carbon 0.62% · Score 74/100"
        satelliteInfo="NDVI 0.72 · Field Average Good"
      />

      {/* Realistic WhatsApp Smartphone Interface Modal */}
      <WhatsAppSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
      />
    </BuildAiShell>
  );
};
