import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { FiClock, FiUser } from 'react-icons/fi';

const TaskCard = ({ task, index, onEdit, onDelete }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-border-error/20 text-border-error';
      case 'Medium':
        return 'bg-accent-orange/20 text-accent-orange';
      case 'Low':
        return 'bg-accent-green/20 text-accent-green';
      default:
        return 'bg-border-dark text-text-secondary';
    }
  };

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-surface p-4 rounded-xl shadow-md mb-3 border transition-smooth ${
            snapshot.isDragging
              ? 'shadow-xl border-primary scale-105 shadow-primary/20'
              : 'border-border-dark hover:shadow-lg'
          }`}
        >
          <div className="flex justify-between items-start mb-2 gap-2">
            <h4 className="font-semibold text-text-primary text-base leading-snug">
              {task.title}
            </h4>
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold shrink-0 ${getPriorityColor(
                task.priority,
              )}`}
            >
              {task.priority}
            </span>
          </div>

          <p className="text-text-secondary text-sm mb-4 line-clamp-2 leading-relaxed">
            {task.description}
          </p>

          <div className="space-y-2 mb-4">
            <div className="flex items-center text-xs font-medium text-text-secondary">
              <FiClock className="mr-2" size={14} />
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
            {task.assignedTo && (
              <div className="flex items-center text-xs font-medium text-text-secondary">
                <FiUser className="mr-2" size={14} />
                <span>{task.assignedTo.name}</span>
              </div>
            )}
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(task)}
              className="flex-1 bg-primary hover:bg-secondary text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-smooth shadow-md"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(task._id)}
              className="px-3 py-1.5 bg-border-dark hover:bg-border-error text-text-primary hover:text-white rounded-lg text-xs font-semibold transition-smooth"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
