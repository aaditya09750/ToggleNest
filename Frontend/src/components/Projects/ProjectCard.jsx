import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiUsers } from 'react-icons/fi';

const ProjectCard = ({ project, onEdit, onDelete, isAdmin }) => {
  const navigate = useNavigate();

  const handleViewTasks = () => {
    navigate(`/projects/${project._id}/tasks`);
  };

  return (
    <div className="bg-surface p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-border-dark flex flex-col h-full group">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${
            project.status === 'Active'
              ? 'bg-primary/10 text-primary border border-primary/20'
              : project.status === 'Completed'
                ? 'bg-accent-green/10 text-accent-green border border-accent-green/20'
                : 'bg-background text-text-secondary border border-border-dark'
          }`}
        >
          {project.status}
        </span>
      </div>

      <p className="text-text-secondary text-sm mb-6 line-clamp-3 flex-grow leading-relaxed">
        {project.description}
      </p>

      <div className="space-y-3 mb-6 pt-4 border-t border-border-dark/50">
        <div className="flex items-center text-xs font-medium text-text-secondary">
          <FiCalendar className="mr-2 text-primary" size={14} />
          <span>Due: {new Date(project.deadline).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center text-xs font-medium text-text-secondary">
          <FiUsers className="mr-2 text-primary" size={14} />
          <span>{project.members?.length || 0} members</span>
        </div>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={handleViewTasks}
          className="flex-1 bg-primary hover:bg-secondary text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95"
        >
          View Tasks
        </button>

        {isAdmin && (
          <>
            <button
              onClick={() => onEdit(project)}
              className="px-4 py-2.5 border border-border-dark hover:bg-background text-text-primary hover:text-primary rounded-xl text-sm font-semibold transition-all"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(project._id)}
              className="px-4 py-2.5 bg-border-error/10 hover:bg-border-error text-border-error hover:text-white rounded-xl text-sm font-semibold transition-all border border-border-error/20"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
