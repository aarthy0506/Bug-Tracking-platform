import React from 'react';
import './StatsCard.css';

const StatsCard = ({ label, value, icon, color = '#6366f1' }) => (
  <div className="stats-card" style={{ borderLeft: `4px solid ${color}` }}>
    <div className="stats-icon" style={{ color }}>{icon}</div>
    <div>
      <p className="stats-label">{label}</p>
      <h2 className="stats-value">{value}</h2>
    </div>
  </div>
);

export default StatsCard;