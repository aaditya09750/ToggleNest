import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { FiCheckCircle, FiClock, FiFolder, FiPercent } from 'react-icons/fi';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [projectsRes, tasksRes, activitiesRes] = await Promise.all([
          api.get('/projects'),
          api.get('/tasks'),
          api.get('/activities'),
        ]);

        setProjects(projectsRes.data);
        setTasks(tasksRes.data);
        setActivities(activitiesRes.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Derive stats from loaded data (no useEffect needed)
  const completedTasks = tasks.filter((t) => t.status === 'Done').length;
  const pendingTasks = tasks.filter((t) => t.status !== 'Done').length;
  const totalTasks = tasks.length;
  const totalProjects = projects.length;
  const completionPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const completedPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const pendingPercentage =
    totalTasks > 0 ? Math.round((pendingTasks / totalTasks) * 100) : 0;
  const projectsPercentage = projects.length > 0 ? 100 : 0;

  const recentActivities = activities.slice(0, 10);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-text-secondary">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-semibold text-text-primary mb-2 drop-shadow-lg tracking-tight">
            DASHBOARD
          </h1>
          <p className="text-text-secondary text-base font-normal">
            Welcome back! Here&apos;s your Project Overview...
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-border-dark group">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-text-secondary font-medium mb-1">
                Total Projects
              </p>
              <p className="text-2xl font-bold text-text-primary group-hover:text-primary transition-colors">
                {totalProjects}
              </p>
            </div>
            <div className="bg-primary/10 p-3 rounded-full group-hover:bg-primary/20 transition-colors">
              <FiFolder className="text-primary" size={24} />
            </div>
          </div>
          <div className="h-1.5 bg-background rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000 ease-out"
              style={{ width: `${projectsPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-surface p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-border-dark group">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-text-secondary font-medium mb-1">
                Completed Tasks
              </p>
              <p className="text-2xl font-bold text-text-primary group-hover:text-accent-green transition-colors">
                {completedTasks}
              </p>
            </div>
            <div className="bg-accent-green/10 p-3 rounded-full group-hover:bg-accent-green/20 transition-colors">
              <FiCheckCircle className="text-accent-green" size={24} />
            </div>
          </div>
          <div className="h-1.5 bg-background rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent-green to-emerald-400 transition-all duration-1000 ease-out"
              style={{ width: `${completedPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-surface p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-border-dark group">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-text-secondary font-medium mb-1">
                Pending Tasks
              </p>
              <p className="text-2xl font-bold text-text-primary group-hover:text-accent-orange transition-colors">
                {pendingTasks}
              </p>
            </div>
            <div className="bg-accent-orange/10 p-3 rounded-full group-hover:bg-accent-orange/20 transition-colors">
              <FiClock className="text-accent-orange" size={24} />
            </div>
          </div>
          <div className="h-1.5 bg-background rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent-orange to-amber-500 transition-all duration-1000 ease-out"
              style={{ width: `${pendingPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-surface p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-border-dark group">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-text-secondary font-medium mb-1">
                Completion Rate
              </p>
              <p className="text-2xl font-bold text-text-primary group-hover:text-primary transition-colors">
                {completionPercentage}%
              </p>
            </div>
            <div className="bg-primary/10 p-3 rounded-full group-hover:bg-primary/20 transition-colors">
              <FiPercent className="text-primary" size={24} />
            </div>
          </div>
          <div className="h-1.5 bg-background rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000 ease-out"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-surface p-6 rounded-2xl shadow-lg border border-border-dark">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-text-primary">
            RECENT ACTIVITIES
          </h2>
          <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-primary to-secondary text-white text-xs font-semibold rounded-full shadow-sm tracking-wide">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#F44336] opacity-75 animate-ping"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#F44336]"></span>
            </span>
            Live
          </div>
        </div>
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
          {recentActivities.length > 0 ? (
            recentActivities.map((activity) => (
              <div
                key={activity._id}
                className="flex items-start space-x-4 p-4 rounded-xl hover:bg-background transition-smooth border border-border-dark/30 hover:border-border-dark"
              >
                <div className="bg-primary/10 p-2.5 rounded-full flex-shrink-0">
                  <FiCheckCircle className="text-primary" size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary truncate">
                    {activity.action}
                  </p>
                  <p className="text-xs text-text-secondary mt-1 truncate">
                    {activity.description}
                  </p>
                  <p className="text-[10px] text-text-secondary/70 mt-2 flex items-center font-medium">
                    <FiClock className="mr-1" size={10} />
                    {new Date(activity.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mx-auto mb-4 border border-border-dark">
                <FiCheckCircle className="text-text-secondary" size={32} />
              </div>
              <p className="text-text-secondary font-medium">
                No recent activities
              </p>
              <p className="text-text-secondary/70 text-xs mt-1">
                Activities will appear here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
