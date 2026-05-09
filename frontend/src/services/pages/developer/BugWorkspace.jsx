import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { bugService } from '../../../services/bugService';
import StatusBadge from '../tester/components/bugs/StatusBadge';
import CommentSection from '../tester/components/bugs/CommentSection';
import Loader from '../tester/components/common/Loader';
import toast from 'react-hot-toast';
import { BUG_STATUS } from '../../../utils/constants';


const BugWorkspace = () => {
  const { id } = useParams();
  const [bug, setBug] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    bugService.getBugById(id).then(setBug).finally(() => setLoading(false));
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      const updated = await bugService.updateStatus(id, newStatus);
      setBug(updated);
      toast.success(`Status updated to ${newStatus}`);
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <Loader />;
  if (!bug) return <p>Bug not found.</p>;

  return (
    <div className="page bug-detail">
      <div className="bug-detail-header">
        <h2>{bug.title}</h2>
        <StatusBadge status={bug.status} />
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

          <section>
            <h4>Update Status</h4>
            <div className="status-actions">
              {Object.values(BUG_STATUS).map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  disabled={bug.status === s || updating}
                  className={`btn-status ${bug.status === s ? 'active' : ''}`}
                >
                  {s.replace('_', ' ')}
                </button>
              ))}
            </div>
          </section>

          <CommentSection
            bugId={id}
            comments={bug.comments || []}
            onCommentAdded={setBug}
          />
        </div>

        <aside className="detail-sidebar">
          <div className="detail-meta">
            <p><strong>Project:</strong> {bug.project?.name}</p>
            <p><strong>Priority:</strong> {bug.priority}</p>
            <p><strong>Severity:</strong> {bug.severity}</p>
            <p><strong>Reported by:</strong> {bug.reportedBy?.name}</p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default BugWorkspace;