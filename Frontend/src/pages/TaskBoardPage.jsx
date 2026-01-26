import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Layout/Navbar';
import Sidebar from '../components/Layout/Sidebar';
import KanbanBoard from '../components/Tasks/KanbanBoard';
import ActivityLog from '../components/ActivityLog/ActivityLog';
import api from '../utils/api';
import { FiArrowLeft } from 'react-icons/fi';

const TaskBoardPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/projects/${projectId}`);
      setProject(response.data);
    } catch (error) {
      console.error('Error fetching project:', error);
      alert('Failed to load project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-96 animate-fade-in">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-text-primary text-lg font-semibold">
                Loading project...
              </p>
            </div>
          ) : project ? (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-surface p-6 rounded-xl shadow-md border border-border-dark">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => navigate('/projects')}
                    className="bg-primary text-white p-3 rounded-full shadow-md hover:bg-primary-dark transition-smooth"
                  >
                    <FiArrowLeft size={20} />
                  </button>
                  <div className="flex-1">
                    <h1 className="text-2xl font-semibold text-text-primary drop-shadow-lg tracking-tight">
                      {project.title}
                    </h1>
                    <p className="text-text-secondary text-sm font-normal leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold border border-primary/20">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-[#4CAF50] opacity-75 animate-ping"></span>
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#4CAF50]"></span>
                      </span>
                      {project.status}
                    </span>
                  </div>
                </div>
              </div>

              <KanbanBoard projectId={projectId} />

              <ActivityLog projectId={projectId} />
            </div>
          ) : (
            <div className="bg-surface p-16 rounded-xl shadow-md text-center border border-border-dark">
              <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-red-500 text-4xl">⚠️</span>
              </div>
              <p className="text-text-primary text-xl font-semibold mb-2">
                Project not found
              </p>
              <p className="text-text-secondary mb-6">
                The project you&apos;re looking for doesn&apos;t exist
              </p>
              <button
                onClick={() => navigate('/projects')}
                className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition-smooth"
              >
                Back to Projects
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default TaskBoardPage;
