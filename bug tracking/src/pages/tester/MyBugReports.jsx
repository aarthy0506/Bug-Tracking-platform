import React, { useEffect, useState } from 'react';
import { bugService } from '../../services/bugService';
import BugCard from '../../components/bugs/BugCard';
import BugFilters from '../../components/bugs/BugFilters';
import Loader from '../../components/common/Loader';

const MyBugReports = () => {
  const [bugs, setBugs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bugService.getMyBugs()
      .then((data) => { setBugs(data); setFiltered(data); })
      .finally(() => setLoading(false));
  }, []);

  const handleFilter = ({ status, priority }) => {
    let result = bugs;
    if (status) result = result.filter((b) => b.status === status);
    if (priority) result = result.filter((b) => b.priority === priority);
    setFiltered(result);
  };

  if (loading) return <Loader />;

  return (
    <div className="page">
      <h2>My Bug Reports ({filtered.length})</h2>
      <BugFilters onFilter={handleFilter} />
      <div className="bug-grid">
        {filtered.map((bug) => <BugCard key={bug._id} bug={bug} />)}
      </div>
      {filtered.length === 0 && <p className="empty-state">No bugs found.</p>}
    </div>
  );
};

export default MyBugReports;