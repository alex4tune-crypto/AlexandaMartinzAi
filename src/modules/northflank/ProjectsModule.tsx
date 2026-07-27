import React, { useState, useEffect } from 'react';
import { NorthflankProject } from '../../services/northflank';
import { northflankService } from '../../services/northflank';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Plus, Play, Pause, Trash2, Settings, TrendingUp } from 'lucide-react';
import { useToast } from '../../components/Toast';

export const ProjectsModule: React.FC = () => {
  const { showToast } = useToast();
  const [projects, setProjects] = useState<NorthflankProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await northflankService.getProjects();
      setProjects(data);
    } catch (error) {
      showToast('Failed to load projects', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      const newProject = await northflankService.createProject({
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        environment: formData.get('environment') as string,
        region: formData.get('region') as string,
      });
      setProjects([...projects, newProject]);
      showToast('Project created successfully!', 'success');
      setShowNewProjectForm(false);
    } catch (error) {
      showToast('Failed to create project', 'error');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex-1 bg-slate-950 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="text-blue-400" /> Northflank Projects
            </h1>
            <p className="text-slate-400 mt-2">Manage your cloud deployments</p>
          </div>
          <button
            onClick={() => setShowNewProjectForm(!showNewProjectForm)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <Plus size={20} /> New Project
          </button>
        </div>

        {/* New Project Form */}
        {showNewProjectForm && (
          <form onSubmit={handleCreateProject} className="bg-slate-800 rounded-lg p-6 mb-8 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Create New Project</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                name="name"
                placeholder="Project Name"
                className="bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-slate-400"
                required
              />
              <select
                name="environment"
                className="bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white"
                required
              >
                <option>Production</option>
                <option>Staging</option>
                <option>Development</option>
              </select>
            </div>
            <select
              name="region"
              className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white mb-4"
              required
            >
              <option>US East</option>
              <option>US West</option>
              <option>EU West</option>
              <option>Asia Pacific</option>
            </select>
            <textarea
              name="description"
              placeholder="Project Description"
              className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white placeholder-slate-400 mb-4 h-20"
              required
            />
            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                Create Project
              </button>
              <button
                type="button"
                onClick={() => setShowNewProjectForm(false)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden hover:border-blue-500 transition-all"
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
                <h3 className="text-xl font-bold text-white">{project.name}</h3>
                <p className="text-blue-100 text-sm">Environment: {project.environment}</p>
              </div>
              <div className="p-4">
                <div className="mb-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Status</span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      project.status === 'active' ? 'bg-green-600' :
                      project.status === 'deploying' ? 'bg-blue-600' :
                      'bg-slate-600'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Services</span>
                    <span className="text-white font-bold">{project.services?.length || 0}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-semibold transition-colors flex items-center justify-center gap-1">
                    <Settings size={16} /> Manage
                  </button>
                  <button className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded text-sm font-semibold transition-colors flex items-center justify-center gap-1">
                    <TrendingUp size={16} /> Metrics
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
