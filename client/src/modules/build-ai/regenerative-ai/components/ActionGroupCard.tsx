import React, { useState } from 'react';
import { RegenerativeAction } from '../types.js';
import { useLanguage } from '../../../../context/LanguageContext.js';

interface ActionGroupCardProps {
  title: string;
  icon: string;
  actions: RegenerativeAction[];
  badgeColor?: string;
  textColor?: string;
  defaultExpanded?: boolean;
}

export const ActionGroupCard: React.FC<ActionGroupCardProps> = ({
  title,
  icon,
  actions,
  badgeColor = '#DCFCE7',
  textColor = '#15803D',
  defaultExpanded = true
}) => {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);
  const [completedIds, setCompletedIds] = useState<Record<string, boolean>>({});
  const [expandedWhyIds, setExpandedWhyIds] = useState<Record<string, boolean>>({});

  if (!actions || actions.length === 0) return null;

  const toggleComplete = (id: string) => {
    setCompletedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleWhy = (id: string) => {
    setExpandedWhyIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getPriorityBadge = (idx: number, priority: string) => {
    const num = idx < 9 ? `0${idx + 1}` : `${idx + 1}`;
    if (idx === 0) return { label: `${num} · ${t('buildAi.todayPriority')}`, color: '#DC2626', bg: '#FEE2E2', border: '#FECACA' };
    if (idx === 1) return { label: `${num} · ${t('buildAi.urgentPriority')}`, color: '#D97706', bg: '#FEF3C7', border: '#FDE68A' };
    return { label: `${num} · ${t('buildAi.routinePriority')}`, color: '#15803D', bg: '#DCFCE7', border: '#BBF7D0' };
  };

  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: '14px',
      padding: '0.75rem 0.85rem',
      border: '1.5px solid #EFEAE2',
      boxShadow: '0 1px 3px rgba(180, 83, 9, 0.03)',
      marginBottom: '0.65rem'
    }}>
      {/* Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <span className="material-symbols-outlined" style={{ color: textColor, fontSize: '19px' }}>{icon}</span>
          <h3 style={{ margin: 0, fontSize: '0.92rem', color: '#0F172A', fontWeight: 800 }}>
            {title} ({actions.length})
          </h3>
        </div>
        <span style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 700 }}>
          {isExpanded ? '▲' : '▼'}
        </span>
      </div>

      {/* Expanded Action List */}
      {isExpanded && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', marginTop: '0.65rem' }}>
          {actions.map((act, idx) => {
            const prio = getPriorityBadge(idx, act.priority);
            const isDone = !!completedIds[act.id || `${idx}`];
            const isWhyOpen = !!expandedWhyIds[act.id || `${idx}`];

            return (
              <div
                key={act.id || idx}
                style={{
                  background: isDone ? '#F1F5F9' : '#FFFFFF',
                  padding: '0.75rem 0.85rem',
                  borderRadius: '10px',
                  border: isDone ? '1px solid #CBD5E1' : `1.5px solid ${prio.border}`,
                  opacity: isDone ? 0.75 : 1,
                  transition: 'all 0.15s ease'
                }}
              >
                {/* Priority Flag & Timing */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 900,
                    padding: '2px 7px',
                    borderRadius: '4px',
                    background: prio.bg,
                    color: prio.color,
                    letterSpacing: '0.02em'
                  }}>
                    {prio.label}
                  </span>

                  <span style={{ fontSize: '0.68rem', color: '#64748B', background: '#FDFBF7', padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>
                    {act.timing}
                  </span>
                </div>

                {/* Title */}
                <div style={{
                  fontWeight: 900,
                  fontSize: '0.9rem',
                  color: isDone ? '#64748B' : '#0F172A',
                  textDecoration: isDone ? 'line-through' : 'none',
                  marginBottom: '0.3rem'
                }}>
                  {act.title}
                </div>

                {/* Practical Action Instruction */}
                <p style={{ margin: '0 0 0.45rem 0', fontSize: '0.8rem', color: '#334155', lineHeight: 1.4 }}>
                  {act.description}
                </p>

                {/* Footer with "Why?" and "Mark as done" Button */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: '0.45rem' }}>
                  {act.evidenceTrace ? (
                    <button
                      onClick={() => toggleWhy(act.id || `${idx}`)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#15803D',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        padding: 0
                      }}
                    >
                      {isWhyOpen ? t('buildAi.regenerative.hideReason') : t('buildAi.regenerative.showWhy')}
                    </button>
                  ) : <span />}

                  <button
                    onClick={() => toggleComplete(act.id || `${idx}`)}
                    style={{
                      background: isDone ? '#E2E8F0' : '#DCFCE7',
                      color: isDone ? '#475569' : '#15803D',
                      border: `1px solid ${isDone ? '#CBD5E1' : '#BBF7D0'}`,
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px'
                    }}
                  >
                    <span>{isDone ? t('buildAi.doneBadge') : t('buildAi.markAsDone')}</span>
                  </button>
                </div>

                {/* Expanded "Why?" Explanation */}
                {isWhyOpen && act.evidenceTrace && (
                  <div style={{
                    marginTop: '0.4rem',
                    fontSize: '0.72rem',
                    color: '#15803D',
                    background: '#FDFBF7',
                    padding: '0.4rem 0.6rem',
                    borderRadius: '6px',
                    border: '1px solid #EFEAE2'
                  }}>
                    <strong>{t('buildAi.regenerative.whyReason')}:</strong> {act.evidenceTrace}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
