import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const ProjectForm = ({ project, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    members: [],
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
    if (project) {
      setFormData({
        title: project.title,
        description: project.description,
        deadline: project.deadline.split('T')[0],
        members: project.members?.map((m) => m._id) || [],
      });
    }
  }, [project]);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/auth/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMemberToggle = (userId) => {
    const isSelected = formData.members.includes(userId);
    setFormData({
      ...formData,
      members: isSelected
        ? formData.members.filter((id) => id !== userId)
        : [...formData.members, userId],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (project) {
        await api.put(`/projects/${project._id}`, formData);
      } else {
        await api.post('/projects', formData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border-dark flex flex-col">
        <div className="p-6 border-b border-border-dark bg-gradient-to-r from-primary/10 to-secondary/10 flex-shrink-0">
          <h2 className="text-2xl font-bold text-text-primary">
            {project ? 'Edit Project' : 'Create New Project'}
          </h2>
          <p className="text-text-secondary text-sm mt-1 font-medium">
            Fill in the details below to manage your project
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5 flex-grow overflow-y-auto custom-scrollbar"
        >
          {error && (
            <div className="bg-border-error/10 border border-border-error text-border-error px-4 py-3 rounded-xl text-sm font-medium">
              <strong>Error:</strong> {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              Project Title
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-background border border-border-dark rounded-xl text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth placeholder-text-secondary"
              placeholder="Enter project title"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              Description
            </label>
            <textarea
              name="description"
              required
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-3 bg-background border border-border-dark rounded-xl text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth resize-none placeholder-text-secondary"
              placeholder="Enter project description"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              Deadline
            </label>
            <input
              type="date"
              name="deadline"
              required
              value={formData.deadline}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-background border border-border-dark rounded-xl text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              Assign Team Members
            </label>
            <div className="border border-border-dark rounded-xl p-4 max-h-48 overflow-y-auto bg-background/50 custom-scrollbar">
              {users.length > 0 ? (
                users.map((user) => (
                  <label
                    key={user._id}
                    className="flex items-center py-2.5 hover:bg-primary/10 px-3 rounded-lg cursor-pointer transition-smooth group"
                  >
                    <input
                      type="checkbox"
                      checked={formData.members.includes(user._id)}
                      onChange={() => handleMemberToggle(user._id)}
                      className="mr-3 w-4 h-4 text-primary border-border-dark rounded focus:ring-primary bg-background"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-text-primary group-hover:text-primary transition-smooth">
                        {user.name}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {user.email}
                      </p>
                    </div>
                  </label>
                ))
              ) : (
                <p className="text-center text-text-secondary py-4 text-sm">
                  No team members available
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-border-dark flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-border-dark rounded-xl text-text-secondary hover:bg-background font-semibold transition-smooth text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-primary hover:bg-secondary text-white rounded-xl font-semibold transition-smooth disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading
                ? 'Saving...'
                : project
                  ? 'Update Project'
                  : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;
