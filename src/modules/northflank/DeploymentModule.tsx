import React, { useState, useEffect } from 'react';
import { northflankService, NorthflankService, DeploymentMetrics } from '../../services/northflank';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { BarChart3, Activity, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { useRealtimeMetrics } from '../../hooks/useRealtime';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DeploymentModuleProps {
  projectId: string;
  serviceId: string;
}

export const DeploymentModule: React.FC<DeploymentModuleProps> = ({ projectId, serviceId }) => {
  const [service, setService] = useState<NorthflankService | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [metricsHistory, setMetricsHistory] = useState<any[]>([]);
  const { metrics, loading: metricsLoading } = useRealtimeMetrics(projectId, serviceId);

  useEffect(() => {
    fetchServiceData();
  }, [projectId, serviceId]);

  useEffect(() => {
    if (metrics) {
      setMetricsHistory((prev) => [
        ...prev.slice(-29), // Keep last 30 data points
        {
          time: new Date().toLocaleTimeString(),
          cpu: metrics.cpuUsage || 0,
          memory: metrics.memoryUsage || 0,
          latency: metrics.latency || 0,
        },
      ]);
    }
  }, [metrics]);

  const fetchServiceData = async () => {
    try {
      setLoading(true);
      // Fetch service and logs
      const project = await northflankService.getProject(projectId);
      const svc = project.services?.find((s) => s.id === serviceId);
      if (svc) setService(svc);

      const deployLogs = await northflankService.getDeploymentLogs(projectId, serviceId, 50);
      setLogs(deployLogs);
    } catch (error) {
      console.error('Failed to fetch service data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Service Status */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            {service?.status === 'running' ? (
              <CheckCircle className="text-green-400" />
            ) : service?.status === 'error' ? (
              <AlertCircle className="text-red-400" />
            ) : (
              <Clock className="text-yellow-400" />
            )}
            {service?.name}
          </h3>
          <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${
            service?.status === 'running' ? 'bg-green-600' :
            service?.status === 'error' ? 'bg-red-600' :
            'bg-yellow-600'
          }`}>
            {service?.status?.toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div>
            <p className="text-slate-400 text-sm mb-1">Replicas</p>
            <p className="text-2xl font-bold text-white">{service?.replicas}</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm mb-1">CPU</p>
            <p className="text-2xl font-bold text-blue-400">{service?.cpu}</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm mb-1">Memory</p>
            <p className="text-2xl font-bold text-purple-400">{service?.memory}</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm mb-1">Uptime</p>
            <p className="text-2xl font-bold text-green-400">{service?.uptime}</p>
          </div>
        </div>
      </div>

      {/* Real-time Metrics Chart */}
      {metricsHistory.length > 0 && (
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Activity className="text-blue-400" /> Live Metrics
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={metricsHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                labelStyle={{ color: '#fff' }}
              />
              <Legend />
              <Line type="monotone" dataKey="cpu" stroke="#3b82f6" dot={false} />
              <Line type="monotone" dataKey="memory" stroke="#8b5cf6" dot={false} />
              <Line type="monotone" dataKey="latency" stroke="#ec4899" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Current Metrics */}
      {metrics && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'CPU Usage', value: `${metrics.cpuUsage}%`, color: 'bg-blue-600' },
            { label: 'Memory', value: `${metrics.memoryUsage}%`, color: 'bg-purple-600' },
            { label: 'Requests/s', value: metrics.requestsPerSecond, color: 'bg-green-600' },
            { label: 'Error Rate', value: `${metrics.errorRate}%`, color: 'bg-red-600' },
            { label: 'Latency', value: `${metrics.latency}ms`, color: 'bg-yellow-600' },
          ].map((metric, idx) => (
            <div key={idx} className={`${metric.color} rounded-lg p-4 text-white`}>
              <p className="text-xs opacity-80 mb-1">{metric.label}</p>
              <p className="text-2xl font-bold">{metric.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Deployment Logs */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <BarChart3 className="text-blue-400" /> Deployment Logs
        </h3>
        <div className="bg-black rounded p-4 font-mono text-sm text-slate-300 h-64 overflow-y-auto">
          {logs.length === 0 ? (
            <p className="text-slate-500">No logs available</p>
          ) : (
            logs.map((log, idx) => (
              <div key={idx} className="text-green-400">
                {log}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
