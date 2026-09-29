import React from 'react';
import { RegenerativeAction } from '../types.js';

interface ActionGroupCardProps {
  title: string;
  icon: string;
  actions: RegenerativeAction[];
  badgeColor?: string;
}

export const ActionGroupCard: React.FC<ActionGroupCardProps> = ({ title, icon, actions, badgeColor = '#34D399' }) => {
  if (!actions || actions.length === 0) return null;

  const getPriorityStyle = (priority: string) => {
    if (priority === 'URGENT' || priority === 'HIGH') {
      return { bg: 'rgba(239, 68, 68, 0.2)', text: '#F87171', border: 'rgba(239, 68, 68, 0.3)' };
    }
    return { bg: 'rgba(255, 255, 255, 0.1)', text: 'rgba(255, 255, 255, 0.8)', border: 'rgba(255, 255, 255, 0.15)' };
  };

  return (
    <div style={{
      background: 'var(--surface-card, #12281a)',
      borderRadius: '16px',
      padding: '1.25rem',
      border: '1px solid rgba(255,255,255,0.08)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
      marginBottom: '1.25rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <span style={{ fontSize: '1.3rem' }}>{icon}</span>
        <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-primary, #fff)', fontWeight: 700 }}>
          {title} ({actions.length})
        </h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {actions.map((act) => {
          const prioStyle = getPriorityStyle(act.priority);
          return (
            <div key={act.id || act.title} style={{
              background: 'rgba(0,0,0,0.25)',
              padding: '0.85rem 1rem',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.05)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.4rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.92rem', color: '#fff' }}>
                  {act.title}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '8px' }}>
                    {act.timing}
                  </span>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: '6px',
                    background: prioStyle.bg,
                    color: prioStyle.text,
                    border: `1px solid ${prioStyle.border}`
                  }}>
                    {act.priority}
                  </span>
                </div>
              </div>

              <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.84rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.45 }}>
                {act.description}
              </p>

              {/* Evidence Trace Label */}
              {act.evidenceTrace && (
                <div style={{ fontSize: '0.72rem', color: '#34D399', background: 'rgba(52, 211, 153, 0.08)', padding: '4px 8px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <span>🔍 Evidence Trace:</span>
                  <span style={{ color: 'rgba(255,255,255,0.9)' }}>{act.evidenceTrace}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
