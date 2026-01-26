import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { FiActivity, FiUser, FiClock } from 'react-icons/fi';

const ActivityLog = ({ projectId }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const fetchActivities = async () => {
    try {
      const url = projectId
        ? `/activities?project=${projectId}`
        : '/activities';
      const response = await api.get(url);
      setActivities(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching activities:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-text-secondary">Loading activities...</div>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-2xl shadow-md p-6 border border-border-dark">
      <h3 className="text-xl font-bold text-text-primary mb-6 flex items-center">
        <FiActivity className="mr-3 text-primary" />
        Activity Log
      </h3>

      <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div
              key={activity._id}
              className="flex items-start space-x-4 p-4 rounded-xl hover:bg-background transition-smooth border border-border-dark/30 hover:border-border-dark group"
            >
              <div className="bg-primary/10 p-2 rounded-full mt-0.5 group-hover:bg-primary/20 transition-colors">
                <FiActivity className="text-primary" size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-text-primary truncate pr-2">
                    {activity.action}
                  </p>
                  <span className="text-xs font-medium text-text-secondary whitespace-nowrap flex items-center bg-background/50 px-2.5 py-1 rounded">
                    <FiClock className="mr-1.5" size={12} />
                    {new Date(activity.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed mb-2">
                  {activity.description}
                </p>
                {activity.user && (
                  <div className="flex items-center text-xs font-medium text-primary/80">
                    <FiUser className="mr-1.5" size={12} />
                    <span>By: {activity.user.name}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mx-auto mb-4 border border-border-dark">
              <FiActivity className="text-text-secondary" size={32} />
            </div>
            <p className="text-text-secondary font-medium">No activities yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLog;
