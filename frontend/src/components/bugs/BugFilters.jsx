import React, { useState } from 'react';
import { BUG_STATUS, BUG_PRIORITY } from '../../utils/constants';
import './BugFilters.css';

const BugFilters = ({ onFilter }) => {
  const [filters, setFilters] = useState({ status: '', priority: '' });

  const handleChange = (e) => {
    const updated = { ...filters, [e.target.name]: e.target.value };
    setFilters(updated);
    onFilter(updated);
  };

  return (
    <div className="bug-filters">
      <select name="status" value={filters.status} onChange={handleChange}>
        <option value="">All Statuses</option>
        {Object.values(BUG_STATUS).map((s) => (
          <option key={s} value={s}>{s.replace('_', ' ')}</option>
        ))}
      </select>
      <select name="priority" value={filters.priority} onChange={handleChange}>
        <option value="">All Priorities</option>
        {Object.values(BUG_PRIORITY).map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
    </div>
  );
};

export default BugFilters;