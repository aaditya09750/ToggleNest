import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { FiX } from 'react-icons/fi';

const TaskForm = ({ task, projectId, onClose, onSuccess }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'Admin';

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    dueDate: '',
    assignedTo: '',
    status: 'To Do',
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: task.dueDate.split('T')[0],
        assignedTo: task.assignedTo?._id || '',
        status: task.status,
      });
    }
  }, [task]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const taskData = {
        ...formData,
        project: projectId,
        assignedTo: formData.assignedTo || null,
      };

      if (task) {
        await api.put(`/tasks/${task._id}`, taskData);
      } else {
        await api.post('/tasks', taskData);
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
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-xs animate-fade-in">
      <div className="bg-surface rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border-dark custom-scrollbar">
        <div className="p-6 border-b border-border-dark bg-gradient-to-r from-primary/10 to-secondary/10 flex items-center justify-between">
          <h2 className="text-2xl font-normal text-text-primary">
            {task ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition"
            aria-label="Close form"
          >
            <FiX
              size={18}
              className="text-text-secondary hover:text-text-primary"
            />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-border-error/10 border border-border-error text-border-error px-4 py-3 rounded-xl text-xs font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-normal text-text-primary mb-2">
              Task Title
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-background border border-border-dark rounded-xl text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-primary placeholder-text-secondary/50 transition-xsooth"
              placeholder="Enter task title"
            />
          </div>

          <div>
            <label className="block text-xs font-normal text-text-primary mb-2">
              Description
            </label>
            <textarea
              name="description"
              required
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-3 bg-background border border-border-dark rounded-xl text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-primary placeholder-text-secondary/50 resize-none transition-xsooth"
              placeholder="Enter task description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-normal text-text-primary mb-2">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-background border border-border-dark rounded-xl text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-primary transition-xsooth"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-normal text-text-primary mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-background border border-border-dark rounded-xl text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-primary transition-xsooth"
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-normal text-text-primary mb-2">
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                required
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-background border border-border-dark rounded-xl text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-primary transition-xsooth"
              />
            </div>

            <div>
              <label className="block text-xs font-normal text-text-primary mb-2">
                Assign To{' '}
                {!isAdmin && (
                  <span className="text-xs text-text-secondary font-normal">
                    (Admin only)
                  </span>
                )}
              </label>
              <select
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                disabled={!isAdmin}
                className="w-full px-4 py-3 bg-background border border-border-dark rounded-xl text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-xsooth"
              >
                <option value="">Unassigned</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))}
              </select>
              {!isAdmin && (
                <p className="text-xs text-text-secondary mt-1">
                  Only Admin can assign tasks to team members
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-border-dark">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-border-dark rounded-xl text-text-secondary hover:bg-background font-normal transition-xsooth text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white rounded-xl font-normal transition-xsooth disabled:opacity-50 text-xs"
            >
              {loading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
