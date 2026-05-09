import React from 'react';
import { PRIORITY_COLORS } from '../../utils/constants';

const PriorityBadge = ({ priority }) => (
  <span
    style={{
      backgroundColor: PRIORITY_COLORS[priority] + '22',
      color: PRIORITY_COLORS[priority],
      border: `1px solid ${PRIORITY_COLORS[priority]}44`,
      padding: '2px 10px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: 600,
      textTransform: 'capitalize',
    }}
  >
    ▲ {priority}
  </span>
);

export default PriorityBadge;