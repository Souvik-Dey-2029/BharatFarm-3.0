import React from 'react';
import { Link } from 'react-router-dom';
import { ModelCardItem } from '../types.js';

interface Props {
  card: ModelCardItem;
}

const CATEGORY_BADGES: Record<string, { bg: string; color: string; icon: string }> = {
  AI_LLM: { bg: 'rgba(167, 139, 250, 0.15)', color: '#a78bfa', icon: '🤖' },
  ML_COMPUTER_VISION: { bg: 'rgba(244, 114, 182, 0.15)', color: '#f472b6', icon: '📷' },
  WEATHER: { bg: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', icon: '🌦️' },
  SATELLITE: { bg: 'rgba(52, 211, 153, 0.15)', color: '#34d399', icon: '🛰️' },
  MARKET: { bg: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24', icon: '📈' },
  KNOWLEDGE: { bg: 'rgba(96, 165, 250, 0.15)', color: '#60a5fa', icon: '🌐' }
};

export const ModelCardDetail: React.FC<Props> = ({ card }) => {
  const catBadge = CATEGORY_BADGES[card.category] || CATEGORY_BADGES.AI_LLM;

  return (
    <div style={{
      background: 'rgba(17, 24, 39, 0.7)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '16px',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: '1.25rem',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
    }}>
      <div>
        {/* Top Header Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{
            background: catBadge.bg,
            border: `1px solid ${catBadge.color}40`,
            color: catBadge.color,
            padding: '0.2rem 0.6rem',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}>
            <span>{catBadge.icon}</span> {card.categoryLabel}
          </span>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.75rem' }}>
            <span style={{
              background: card.liveOrDemo === 'live' ? 'rgba(52, 211, 153, 0.2)' : 'rgba(251, 191, 36, 0.2)',
              color: card.liveOrDemo === 'live' ? '#34d399' : '#fbbf24',
              padding: '0.15rem 0.45rem',
              borderRadius: '4px',
              fontWeight: 600
            }}>
              {card.liveOrDemo.toUpperCase()}
            </span>
            <span style={{ color: '#9ca3af' }}>{card.version}</span>
          </div>
        </div>

        {/* System Name */}
        <h3 style={{ margin: '0 0 0.5rem 0', color: '#ffffff', fontSize: '1.15rem', fontWeight: 700 }}>
          {card.name}
        </h3>

        {/* Purpose */}
        <p style={{ margin: '0 0 1.25rem 0', color: '#d1d5db', fontSize: '0.875rem', lineHeight: '1.5' }}>
          {card.purpose}
        </p>

        {/* Inputs & Outputs Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          background: 'rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '12px',
          padding: '1rem',
          marginBottom: '1.25rem'
        }}>
          <div>
            <h5 style={{ margin: '0 0 0.4rem 0', color: '#60a5fa', fontSize: '0.8rem', textTransform: 'uppercase' }}>
              📥 System Inputs
            </h5>
            <ul style={{ margin: 0, paddingLeft: '1.1rem', color: '#9ca3af', fontSize: '0.8rem', lineHeight: '1.5' }}>
              {card.inputs.map((inp, idx) => (
                <li key={idx}>{inp}</li>
              ))}
            </ul>
          </div>

          <div>
            <h5 style={{ margin: '0 0 0.4rem 0', color: '#34d399', fontSize: '0.8rem', textTransform: 'uppercase' }}>
              📤 System Outputs
            </h5>
            <ul style={{ margin: 0, paddingLeft: '1.1rem', color: '#9ca3af', fontSize: '0.8rem', lineHeight: '1.5' }}>
              {card.outputs.map((out, idx) => (
                <li key={idx}>{out}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Technical Architecture & Provider details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.825rem', marginBottom: '1.25rem' }}>
          <div>
            <strong style={{ color: '#ffffff' }}>Model / Provider / Library: </strong>
            <span style={{ color: '#9ca3af' }}>{card.modelProviderLibrary}</span>
          </div>
          <div>
            <strong style={{ color: '#ffffff' }}>Primary Data Source: </strong>
            <span style={{ color: '#9ca3af' }}>{card.dataSource}</span>
          </div>
          <div>
            <strong style={{ color: '#ffffff' }}>Update Frequency: </strong>
            <span style={{ color: '#9ca3af' }}>{card.updateFrequency}</span>
          </div>
        </div>

        {/* Limitations & Responsible Use */}
        <div style={{
          background: 'rgba(239, 68, 68, 0.08)',
          borderLeft: '3px solid #ef4444',
          borderRadius: '0 8px 8px 0',
          padding: '0.75rem',
          fontSize: '0.8rem'
        }}>
          <h5 style={{ margin: '0 0 0.3rem 0', color: '#f87171', fontSize: '0.8rem' }}>
            ⚠️ Model Limitations & Responsible Use Guidelines
          </h5>
          <ul style={{ margin: '0 0 0.5rem 0', paddingLeft: '1.1rem', color: '#e5e7eb', lineHeight: '1.4' }}>
            {card.limitations.map((lim, idx) => (
              <li key={idx}>{lim}</li>
            ))}
          </ul>
          <div style={{ color: '#9ca3af', fontStyle: 'italic', fontSize: '0.75rem' }}>
            <strong>Usage Policy:</strong> {card.responsibleUse}
          </div>
        </div>
      </div>

      {/* Footer link to feature page */}
      {card.canonicalRoute && (
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingTop: '0.85rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
            Updated: {card.lastUpdated}
          </span>

          <Link
            to={card.canonicalRoute}
            style={{
              color: '#34d399',
              fontSize: '0.85rem',
              fontWeight: 600,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            Launch Feature Workspace →
          </Link>
        </div>
      )}
    </div>
  );
};
