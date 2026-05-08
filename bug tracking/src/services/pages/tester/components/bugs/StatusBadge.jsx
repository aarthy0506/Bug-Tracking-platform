import React from 'react';
import { STATUS_COLORS } from '../../utils/constants';

const STATUS_LABELS = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
  reopened: 'Reopened',
};

const StatusBadge = ({ status }) => (
  <span
    style={{
      backgroundColor: STATUS_COLORS[status] + '22',
      color: STATUS_COLORS[status],
      border: `1px solid ${STATUS_COLORS[status]}44`,
      padding: '2px 10px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: 600,
    }}
  >
    {STATUS_LABELS[status] || status}
  </span>
);

export default StatusBadge;