import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BugForm from '../../components/bugs/BugForm';
import { bugService } from '../../services/bugService';
import toast from 'react-hot-toast';

const CreateBug = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      await bugService.createBug(formData);
      toast.success('Bug reported successfully!');
      navigate('/tester/my-bugs');
    } catch {
      toast.error('Failed to submit bug report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h2>Report a Bug</h2>
      <BugForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
};

export default CreateBug;