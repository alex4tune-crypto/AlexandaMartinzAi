// Northflank API Integration Endpoints
import express from 'express';
import axios from 'axios';

const northflankRouter = express.Router();

const NORTHFLANK_BASE_URL = 'https://api.northflank.com/v1';
const NORTHFLANK_API_KEY = process.env.NORTHFLANK_API_KEY;
const NORTHFLANK_ORG_ID = process.env.NORTHFLANK_ORGANIZATION_ID;

const northflankClient = axios.create({
  baseURL: NORTHFLANK_BASE_URL,
  headers: {
    'Authorization': `Bearer ${NORTHFLANK_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

// Mock in-memory storage for projects (in production, use real Northflank API)
let projects: any[] = [
  {
    id: 'proj-1',
    name: 'AI Factory Production',
    status: 'active',
    environment: 'Production',
    region: 'US East',
    createdAt: new Date().toISOString(),
    services: [
      {
        id: 'svc-1',
        name: 'API Server',
        status: 'running',
        replicas: 3,
        cpu: '2000m',
        memory: '2Gi',
        uptime: '99.95%',
        lastDeployed: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 'svc-2',
        name: 'Frontend App',
        status: 'running',
        replicas: 2,
        cpu: '1000m',
        memory: '1Gi',
        uptime: '99.98%',
        lastDeployed: new Date(Date.now() - 172800000).toISOString(),
      },
    ],
  },
  {
    id: 'proj-2',
    name: 'AI Models Training',
    status: 'active',
    environment: 'Staging',
    region: 'EU West',
    createdAt: new Date(Date.now() - 604800000).toISOString(),
    services: [
      {
        id: 'svc-3',
        name: 'Training Job',
        status: 'running',
        replicas: 1,
        cpu: '8000m',
        memory: '16Gi',
        uptime: '98.5%',
        lastDeployed: new Date(Date.now() - 259200000).toISOString(),
      },
    ],
  },
];

// Metrics storage
let metricsStorage: any = {};

// Generate mock metrics
const generateMetrics = () => ({
  cpuUsage: Math.random() * 80 + 10,
  memoryUsage: Math.random() * 70 + 20,
  requestsPerSecond: Math.random() * 500 + 100,
  errorRate: Math.random() * 5,
  latency: Math.random() * 200 + 50,
  uptime: 99.95 + Math.random() * 0.04,
  timestamp: new Date().toISOString(),
});

// GET all projects
northflankRouter.get('/projects', (req, res) => {
  res.json(projects);
});

// POST create project
northflankRouter.post('/projects', (req, res) => {
  const { name, description, environment, region } = req.body;
  const newProject = {
    id: `proj-${Date.now()}`,
    name,
    description,
    status: 'active',
    environment,
    region,
    createdAt: new Date().toISOString(),
    services: [],
  };
  projects.push(newProject);
  res.status(201).json(newProject);
});

// GET single project
northflankRouter.get('/projects/:projectId', (req, res) => {
  const project = projects.find((p) => p.id === req.params.projectId);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  res.json(project);
});

// POST deploy service
northflankRouter.post('/projects/:projectId/deploy', (req, res) => {
  const { projectId } = req.params;
  const { name, image, port, replicas, cpu, memory, env } = req.body;
  const project = projects.find((p) => p.id === projectId);
  
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const newService = {
    id: `svc-${Date.now()}`,
    name,
    image,
    port,
    status: 'deploying',
    replicas,
    cpu,
    memory,
    env,
    uptime: '0%',
    lastDeployed: new Date().toISOString(),
  };

  project.services.push(newService);
  const deploymentId = `deploy-${Date.now()}`;

  // Simulate deployment completion
  setTimeout(() => {
    const service = project.services.find((s) => s.id === newService.id);
    if (service) {
      service.status = 'running';
      service.uptime = '99.5%';
    }
  }, 3000);

  res.status(201).json({
    deploymentId,
    status: 'deploying',
    message: 'Service deployment started',
  });
});

// GET service metrics
northflankRouter.get('/projects/:projectId/services/:serviceId/metrics', (req, res) => {
  const { projectId, serviceId } = req.params;
  const key = `${projectId}-${serviceId}`;
  
  if (!metricsStorage[key]) {
    metricsStorage[key] = [];
  }

  const metrics = generateMetrics();
  metricsStorage[key].push(metrics);
  
  // Keep only last 100 metrics
  if (metricsStorage[key].length > 100) {
    metricsStorage[key].shift();
  }

  res.json(metrics);
});

// GET deployment logs
northflankRouter.get('/projects/:projectId/services/:serviceId/logs', (req, res) => {
  const lines = parseInt(req.query.lines as string) || 100;
  const logs = [
    '2026-07-27T15:45:23.123Z [INFO] Starting deployment pipeline',
    '2026-07-27T15:45:25.456Z [INFO] Pulling container image from registry',
    '2026-07-27T15:45:30.789Z [INFO] Image pulled successfully',
    '2026-07-27T15:45:32.012Z [INFO] Creating service replicas',
    '2026-07-27T15:45:35.345Z [INFO] Replica 1 starting',
    '2026-07-27T15:45:38.678Z [INFO] Replica 1 healthy',
    '2026-07-27T15:45:40.901Z [INFO] Replica 2 starting',
    '2026-07-27T15:45:43.234Z [INFO] Replica 2 healthy',
    '2026-07-27T15:45:45.567Z [INFO] Running health checks',
    '2026-07-27T15:45:48.890Z [INFO] All health checks passed',
    '2026-07-27T15:45:50.123Z [INFO] Service deployed successfully',
    '2026-07-27T15:45:52.456Z [INFO] Monitoring started',
    '2026-07-27T15:46:00.789Z [INFO] Service is healthy',
    '2026-07-27T15:46:10.012Z [INFO] Processing incoming requests',
  ];
  
  res.json(logs.slice(-lines));
});

// PATCH scale service
northflankRouter.patch('/projects/:projectId/services/:serviceId/scale', (req, res) => {
  const { projectId, serviceId } = req.params;
  const { replicas } = req.body;
  const project = projects.find((p) => p.id === projectId);
  
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const service = project.services.find((s) => s.id === serviceId);
  if (!service) {
    return res.status(404).json({ error: 'Service not found' });
  }

  const oldReplicas = service.replicas;
  service.replicas = replicas;
  
  res.json({
    status: 'scaling',
    message: `Scaling service from ${oldReplicas} to ${replicas} replicas`,
    serviceName: service.name,
  });
});

// POST restart service
northflankRouter.post('/projects/:projectId/services/:serviceId/restart', (req, res) => {
  const { projectId, serviceId } = req.params;
  const project = projects.find((p) => p.id === projectId);
  
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const service = project.services.find((s) => s.id === serviceId);
  if (!service) {
    return res.status(404).json({ error: 'Service not found' });
  }

  const oldStatus = service.status;
  service.status = 'restarting';
  
  setTimeout(() => {
    service.status = 'running';
  }, 2000);

  res.json({
    status: 'restarting',
    message: `Service ${service.name} is restarting`,
  });
});

// POST delete service
northflankRouter.post('/projects/:projectId/services/:serviceId/delete', (req, res) => {
  const { projectId, serviceId } = req.params;
  const project = projects.find((p) => p.id === projectId);
  
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const serviceIndex = project.services.findIndex((s) => s.id === serviceId);
  if (serviceIndex === -1) {
    return res.status(404).json({ error: 'Service not found' });
  }

  const service = project.services[serviceIndex];
  project.services.splice(serviceIndex, 1);
  
  res.json({
    status: 'deleted',
    message: `Service ${service.name} has been deleted`,
  });
});

export default northflankRouter;
