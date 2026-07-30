// Northflank Cloud Platform Integration Service
import { api } from '../lib/api';

export interface NorthflankProject {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'deploying';
  createdAt: string;
  services: NorthflankService[];
  environment: string;
}

export interface NorthflankService {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'restarting' | 'error';
  replicas: number;
  cpu: string;
  memory: string;
  uptime: string;
  lastDeployed: string;
}

export interface DeploymentMetrics {
  cpuUsage: number;
  memoryUsage: number;
  requestsPerSecond: number;
  errorRate: number;
  latency: number;
  uptime: number;
}

export const northflankService = {
  // Get all projects
  async getProjects(): Promise<NorthflankProject[]> {
    return api.get('/api/northflank/projects');
  },

  // Get single project details
  async getProject(projectId: string): Promise<NorthflankProject> {
    return api.get(`/api/northflank/projects/${projectId}`);
  },

  // Create new project
  async createProject(data: {
    name: string;
    description: string;
    environment: string;
    region: string;
  }): Promise<NorthflankProject> {
    return api.post('/api/northflank/projects', data);
  },

  // Deploy service
  async deployService(projectId: string, data: {
    name: string;
    image: string;
    port: number;
    replicas: number;
    cpu: string;
    memory: string;
    env: Record<string, string>;
  }): Promise<{ deploymentId: string; status: string }> {
    return api.post(`/api/northflank/projects/${projectId}/services`, data);
  },

  // Get service metrics
  async getServiceMetrics(projectId: string, serviceId: string): Promise<DeploymentMetrics> {
    return api.get(`/api/northflank/projects/${projectId}/services/${serviceId}/metrics`);
  },

  // Get deployment logs
  async getDeploymentLogs(projectId: string, serviceId: string, lines?: number): Promise<string[]> {
    return api.get(`/api/northflank/projects/${projectId}/services/${serviceId}/logs?lines=${lines || 100}`);
  },

  // Scale service
  async scaleService(projectId: string, serviceId: string, replicas: number): Promise<{ status: string }> {
    return api.patch(`/api/northflank/projects/${projectId}/services/${serviceId}`, { replicas });
  },

  // Restart service
  async restartService(projectId: string, serviceId: string): Promise<{ status: string }> {
    return api.post(`/api/northflank/projects/${projectId}/services/${serviceId}/restart`, {});
  },

  // Delete service
  async deleteService(projectId: string, serviceId: string): Promise<{ status: string }> {
    return api.delete(`/api/northflank/projects/${projectId}/services/${serviceId}`);
  },
};
