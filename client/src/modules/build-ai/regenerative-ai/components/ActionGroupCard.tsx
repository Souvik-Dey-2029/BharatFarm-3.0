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

  if (!actions || actions.length === 0) return null;

  const getPriorityStyle = (priority: string) => {
    if (priority === 'URGENT' || priority === 'HIGH') {
      return { bg: '#FEF2F2', text: '#991B1B', border: '#FCA5A5', label: t('buildAi.urgent') };
    }
    return { bg: '#F8FAFC', text: '#475569', border: '#E2E8F0', label: t('buildAi.good') };
  };

  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: '14px',
      padding: '0.75rem 0.85rem',
      border: '1px solid #E2E8F0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
      marginBottom: '0.65rem'
    }}>
      {/* Clickable Header for Collapsible Action Groups */}
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
            const prioStyle = getPriorityStyle(act.priority);
            return (
              <div key={act.id || idx} style={{
                background: '#F8FAFC',
                padding: '0.65rem 0.75rem',
                borderRadius: '10px',
                border: '1px solid #E2E8F0'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem', flexWrap: 'wrap', gap: '0.3rem' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.86rem', color: '#0F172A' }}>
                    🟢 {idx + 1}. {act.title}
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span style={{ fontSize: '0.68rem', color: '#64748B', background: '#E2E8F0', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                      {act.timing}
                    </span>
                    <span style={{
                      fontSize: '0.66rem',
                      fontWeight: 800,
                      padding: '1px 6px',
                      borderRadius: '4px',
                      background: prioStyle.bg,
                      color: prioStyle.text,
                      border: `1px solid ${prioStyle.border}`
                    }}>
                      {prioStyle.label}
                    </span>
                  </div>
                </div>

                <p style={{ margin: '0 0 0.4rem 0', fontSize: '0.8rem', color: '#334155', lineHeight: 1.4 }}>
                  {act.description}
                </p>

                {/* Short farmer-friendly "Why?" Reason */}
                {act.evidenceTrace && (
                  <div style={{
                    fontSize: '0.72rem',
                    color: '#15803D',
                    background: '#F0FDF4',
                    border: '1px solid #BBF7D0',
                    padding: '3px 6px',
                    borderRadius: '6px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontWeight: 700
                  }}>
                    <span>{t('buildAi.whyQuestion')}</span>
                    <span style={{ color: '#0F172A', fontWeight: 500 }}>{act.evidenceTrace}</span>
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
