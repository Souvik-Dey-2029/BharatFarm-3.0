import React from 'react';
import { RegenerativeAction } from '../types.js';

interface ActionGroupCardProps {
  title: string;
  icon: string;
  actions: RegenerativeAction[];
  badgeColor?: string;
  textColor?: string;
}

export const ActionGroupCard: React.FC<ActionGroupCardProps> = ({
  title,
  icon,
  actions,
  badgeColor = '#DCFCE7',
  textColor = '#15803D'
}) => {
  if (!actions || actions.length === 0) return null;

  const getPriorityStyle = (priority: string) => {
    if (priority === 'URGENT' || priority === 'HIGH') {
      return { bg: '#FEF2F2', text: '#991B1B', border: '#FCA5A5' };
    }
    return { bg: '#F8FAFC', text: '#475569', border: '#E2E8F0' };
  };

  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: '16px',
      padding: '1.25rem',
      border: '1px solid #E2E8F0',
      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
      marginBottom: '1.25rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
        <span className="material-symbols-outlined" style={{ color: textColor, fontSize: '22px' }}>{icon}</span>
        <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0F172A', fontWeight: 800 }}>
          {title} ({actions.length})
        </h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {actions.map((act) => {
          const prioStyle = getPriorityStyle(act.priority);
          return (
            <div key={act.id || act.title} style={{
              background: '#F8FAFC',
              padding: '0.85rem 1rem',
              borderRadius: '12px',
              border: '1px solid #E2E8F0'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.4rem' }}>
                <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0F172A' }}>
                  {act.title}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748B', background: '#E2E8F0', padding: '2px 8px', borderRadius: '8px', fontWeight: 600 }}>
                    {act.timing}
                  </span>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: prioStyle.bg,
                    color: prioStyle.text,
                    border: `1px solid ${prioStyle.border}`
                  }}>
                    {act.priority}
                  </span>
                </div>
              </div>

              <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.84rem', color: '#334155', lineHeight: 1.5 }}>
                {act.description}
              </p>

              {/* Evidence Trace Label */}
              {act.evidenceTrace && (
                <div style={{ fontSize: '0.72rem', color: '#15803D', background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '4px 8px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                  <span>🔍 Evidence:</span>
                  <span style={{ color: '#0F172A' }}>{act.evidenceTrace}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
