import React, { useState } from 'react';
import { bugService } from '../../services/bugService';
import { useAuth } from '../../hooks/useAuth';
import { timeAgo } from '../../utils/formatDate';
import toast from 'react-hot-toast';
import './CommentSection.css';

const CommentSection = ({ bugId, comments = [], onCommentAdded }) => {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    try {
      const updated = await bugService.addComment(bugId, text);
      onCommentAdded(updated);
      setText('');
      toast.success('Comment added');
    } catch {
      toast.error('Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="comment-section">
      <h4>Comments ({comments.length})</h4>
      <div className="comments-list">
        {comments.map((c, i) => (
          <div key={i} className="comment-item">
            <div className="comment-author">
              <span className="avatar">{c.author?.name?.[0]}</span>
              <strong>{c.author?.name}</strong>
              <span className="comment-time">{timeAgo(c.createdAt)}</span>
            </div>
            <p className="comment-text">{c.text}</p>
          </div>
        ))}
      </div>
      <form className="comment-form" onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment..."
          rows={3}
        />
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Posting...' : 'Post Comment'}
        </button>
      </form>
    </div>
  );
};

export default CommentSection;