import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import { timeAgo } from '../../utils/formatDate';
import './BugCard.css';

const BugCard = ({ bug }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const detailPath = user.role === 'developer'
    ? `/developer/bug/${bug._id}`
    : `/tester/bug/${bug._id}`;

  return (
    <div className="bug-card" onClick={() => navigate(detailPath)}>
      <div className="bug-card-header">
        <span className="bug-id">#{bug.bugId || bug._id.slice(-6)}</span>
        <StatusBadge status={bug.status} />
      </div>
      <h3 className="bug-title">{bug.title}</h3>
      <p className="bug-desc">{bug.description?.slice(0, 100)}...</p>
      <div className="bug-card-footer">
        <PriorityBadge priority={bug.priority} />
        <span className="bug-meta">
          {bug.project?.name} · {timeAgo(bug.createdAt)}
        </span>
      </div>
    </div>
  );
};

export default BugCard;