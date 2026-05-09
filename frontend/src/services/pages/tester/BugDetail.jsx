import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { bugService } from '../../../services/bugService';
import StatusBadge from './components/bugs/StatusBadge';
import PriorityBadge from './components/bugs/PriorityBadge';
import CommentSection from './components/bugs/CommentSection';
import Loader from './components/common/Loader';
import { formatDateTime } from '../../../utils/formatDate';

const BugDetail = () => {
  const { id } = useParams();
  const [bug, setBug] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bugService.getBugById(id)
      .then(setBug)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (!bug) return <p>Bug not found.</p>;

  return (
    <div className="page bug-detail">
      <div className="bug-detail-header">
        <h2>{bug.title}</h2>
        <div className="bug-detail-badges">
          <StatusBadge status={bug.status} />
          <PriorityBadge priority={bug.priority} />
        </div>
      </div>

      <div className="detail-grid">
        <div className="detail-main">
          <section>
            <h4>Description</h4>
            <p>{bug.description}</p>
          </section>
          {bug.stepsToReproduce && (
            <section>
              <h4>Steps to Reproduce</h4>
              <pre>{bug.stepsToReproduce}</pre>
            </section>
          )}
          {bug.screenshots?.length > 0 && (
            <section>
              <h4>Screenshots</h4>
              <div className="screenshots">
                {bug.screenshots.map((url, i) => (
                  <a key={i} href={url} target="_blank" rel="noreferrer">
                    <img src={url} alt={`screenshot-${i}`} />
                  </a>
                ))}
              </div>
            </section>
          )}
          <CommentSection
            bugId={id}
            comments={bug.comments || []}
            onCommentAdded={(updated) => setBug(updated)}
          />
        </div>

        <aside className="detail-sidebar">
          <div className="detail-meta">
            <p><strong>Project:</strong> {bug.project?.name}</p>
            <p><strong>Severity:</strong> {bug.severity}</p>
            <p><strong>Reported by:</strong> {bug.reportedBy?.name}</p>
            <p><strong>Assigned to:</strong> {bug.assignedTo?.name || 'Unassigned'}</p>
            <p><strong>Created:</strong> {formatDateTime(bug.createdAt)}</p>
            <p><strong>Updated:</strong> {formatDateTime(bug.updatedAt)}</p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default BugDetail;