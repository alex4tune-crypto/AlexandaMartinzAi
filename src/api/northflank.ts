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

// Middleware to check if Northflank is configured
const checkConfig = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!NORTHFLANK_API_KEY) {
    return res.status(501).json({
      error: 'Northflank Integration Not Configured',
      message: 'Please set NORTHFLANK_API_KEY in your environment to enable real infrastructure management.'
    });
  }
  next();
};

// GET all projects
northflankRouter.get('/projects', checkConfig, async (req, res) => {
  try {
    const response = await northflankClient.get('/projects');
    res.json(response.data.data || []);
  } catch (error: any) {
    console.error('Northflank Fetch Projects Error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ 
      error: 'Failed to fetch projects from Northflank',
      details: error.response?.data
    });
  }
});

// POST create project
northflankRouter.post('/projects', checkConfig, async (req, res) => {
  try {
    const { name, description, region } = req.body;
    const response = await northflankClient.post('/projects', {
      name,
      description,
      region,
    });
    res.status(201).json(response.data.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json({ error: 'Failed to create project' });
  }
});

// GET single project
northflankRouter.get('/projects/:projectId', checkConfig, async (req, res) => {
  try {
    const response = await northflankClient.get(`/projects/${req.params.projectId}`);
    res.json(response.data.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json({ error: 'Project not found' });
  }
});

// POST deploy service
northflankRouter.post('/projects/:projectId/services', checkConfig, async (req, res) => {
  try {
    const { projectId } = req.params;
    const response = await northflankClient.post(`/projects/${projectId}/services`, req.body);
    res.status(201).json(response.data.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json({ error: 'Failed to deploy service' });
  }
});

// GET service metrics
northflankRouter.get('/projects/:projectId/services/:serviceId/metrics', checkConfig, async (req, res) => {
  try {
    const { projectId, serviceId } = req.params;
    const response = await northflankClient.get(`/projects/${projectId}/services/${serviceId}/metrics`);
    res.json(response.data.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json({ error: 'Failed to fetch service metrics' });
  }
});

// GET deployment logs
northflankRouter.get('/projects/:projectId/services/:serviceId/logs', checkConfig, async (req, res) => {
  try {
    const { projectId, serviceId } = req.params;
    const response = await northflankClient.get(`/projects/${projectId}/services/${serviceId}/logs`);
    res.json(response.data.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json({ error: 'Failed to fetch logs' });
  }
});

// PATCH scale service
northflankRouter.patch('/projects/:projectId/services/:serviceId', checkConfig, async (req, res) => {
  try {
    const { projectId, serviceId } = req.params;
    const response = await northflankClient.patch(`/projects/${projectId}/services/${serviceId}`, req.body);
    res.json(response.data.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json({ error: 'Failed to scale service' });
  }
});

// POST restart service
northflankRouter.post('/projects/:projectId/services/:serviceId/restart', checkConfig, async (req, res) => {
  try {
    const { projectId, serviceId } = req.params;
    const response = await northflankClient.post(`/projects/${projectId}/services/${serviceId}/restart`, {});
    res.json(response.data.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json({ error: 'Failed to restart service' });
  }
});

// DELETE service
northflankRouter.delete('/projects/:projectId/services/:serviceId', checkConfig, async (req, res) => {
  try {
    const { projectId, serviceId } = req.params;
    const response = await northflankClient.delete(`/projects/${projectId}/services/${serviceId}`);
    res.json(response.data.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json({ error: 'Failed to delete service' });
  }
});

export default northflankRouter;
