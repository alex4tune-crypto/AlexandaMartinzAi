import { AiCeoDecision } from '../types';

export interface AgentExecuteRequest {
  agentId: string;
  agentName: string;
  firmName: string;
  domain: string;
  taskTitle: string;
  instructions?: string;
}

export interface AgentExecuteResult {
  title: string;
  firm: string;
  summary: string;
  content: string;
  deliverableType: string;
  timestamp: string;
}

export interface HolasAuditResult {
  securityScore: number;
  threatLevel: 'LOW' | 'MEDIUM' | 'ELEVATED' | 'HIGH';
  governanceStatus: string;
  scannedNodes: number;
  firewallRulesActive: number;
  activeThreatsBlocked: number;
  auditFindings: string[];
  recommendations: string[];
  timestamp: string;
}

export async function requestAiCeoDecision(
  goal: string,
  autoMode: boolean,
  networkState: any
): Promise<AiCeoDecision> {
  const res = await fetch('/api/ai/ceo/decide', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ goal, autoMode, networkState }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || `HTTP error ${res.status}`);
  return data.decision;
}

export async function executeSpecialistAgentTask(
  req: AgentExecuteRequest
): Promise<AgentExecuteResult> {
  const res = await fetch('/api/ai/agent/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || `HTTP error ${res.status}`);
  return data.output;
}

export async function requestHolasSecurityAudit(
  scanScope: string
): Promise<HolasAuditResult> {
  const res = await fetch('/api/ai/holas/audit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scanScope }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || `HTTP error ${res.status}`);
  return data.audit;
}

export async function publishContentToSurface(
  targetSurface: 'portal' | 'marketplace',
  contentType: string,
  payload: any
) {
  const res = await fetch('/api/publishing/publish', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ targetSurface, contentType, payload }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.error || `HTTP error ${res.status}`);
  return data;
}
