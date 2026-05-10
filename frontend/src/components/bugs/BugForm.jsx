import React, { useState, useEffect } from 'react';
import { projectService } from '../../services/projectService';
import { userService } from '../../services/userService';
import './BugForm.css';

const BugForm = ({ initialData = {}, onSubmit, loading }) => {
  const [form, setForm] = useState({
    title: '', description: '', stepsToReproduce: '',
    severity: 'major', priority: 'medium',
    project: '', assignedTo: '', screenshots: [],
    ...initialData,
  });
  const [projects, setProjects] = useState([]);
  const [developers, setDevelopers] = useState([]);

  useEffect(() => {
    projectService.getAllProjects().then(setProjects);
    // BACKEND ROUTE: GET /api/users?role=developer
    userService.getAllUsers().then((users) =>
      setDevelopers(users.filter((u) => u.role === 'developer'))
    );
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFiles = (e) =>
    setForm({ ...form, screenshots: Array.from(e.target.files) });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form className="bug-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Bug Title *</label>
        <input name="title" value={form.title} onChange={handleChange}
          placeholder="Short descriptive title" required />
      </div>

      <div className="form-group">
        <label>Description *</label>
        <textarea name="description" value={form.description}
          onChange={handleChange} rows={4} placeholder="What went wrong?" required />
      </div>

      <div className="form-group">
        <label>Steps to Reproduce</label>
        <textarea name="stepsToReproduce" value={form.stepsToReproduce}
          onChange={handleChange} rows={3} placeholder="1. Go to... 2. Click..." />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Severity</label>
          <select name="severity" value={form.severity} onChange={handleChange}>
            <option value="minor">Minor</option>
            <option value="major">Major</option>
            <option value="critical">Critical</option>
            <option value="blocker">Blocker</option>
          </select>
        </div>
        <div className="form-group">
          <label>Priority</label>
          <select name="priority" value={form.priority} onChange={handleChange}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Project *</label>
          <select name="project" value={form.project} onChange={handleChange} required>
            <option value="">Select Project</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Assign To (Developer)</label>
          <select name="assignedTo" value={form.assignedTo} onChange={handleChange}>
            <option value="">Unassigned</option>
            {developers.map((d) => (
              <option key={d._id} value={d._id}>{d.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Screenshots</label>
        <input type="file" multiple accept="image/*" onChange={handleFiles} />
      </div>

      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Bug Report'}
      </button>
    </form>
  );
};

export default BugForm;