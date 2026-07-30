import { Request, Response } from 'express';
import * as aiService from '../services/ai.service';
import prisma from '../services/prisma.service';
import { broadcast } from '../services/socket.service';

export const decide = async (req: Request, res: Response) => {
  try {
    const { goal, autoMode, networkState } = req.body;
    
    const promptText = `
You are the custom AI CEO of "Alexanda Martinz Inc.", a elite corporate AI production network and holding company.
You report directly to the Human CEO (Alexanda Martinz) and oversee Holas (God of the Cloud & Security Head), executive directors, and 7 specialist AI firms.

Current Platform Objective / Input from Human CEO or System: "${goal || "Optimize corporate production network, increase digital asset deployment, and ensure Holas cloud security."}"
Current Mode: ${autoMode ? "AUTOMATIC (AI CEO is running company operations)" : "MANUAL (Assisting Human CEO with strategic recommendations)"}

Network State Overview:
${JSON.stringify(networkState || { nodesActive: 7, totalProducts: 12, cloudSecurity: "Optimal" }, null, 2)}

Provide a structured strategic decision as valid JSON with the following schema:
{
  "executiveSummary": "string describing the decision and current status",
  "strategicActions": ["action 1", "action 2", "action 3"],
  "delegatedTasks": [
    { "agentId": "agent-research | agent-code | agent-fashion | agent-econ | agent-health | agent-marketing", "firm": "string firm name", "task": "specific action item" }
  ],
  "publishingDirectives": ["item to publish to public portal or marketplace"],
  "securityDirectives": "security guidance for Holas Cloud Shield",
  "timestamp": "ISO timestamp"
}
Ensure output is ONLY pure JSON with no extra commentary or markdown formatting.
`;

    const decision = await aiService.generateAiContent(promptText);

    // Save to DB
    const savedDecision = await prisma.aiDecision.create({
      data: {
        executiveSummary: decision.executiveSummary,
        strategicActions: decision.strategicActions,
        delegatedTasks: decision.delegatedTasks,
        publishingDirectives: decision.publishingDirectives,
        securityDirectives: decision.securityDirectives,
        timestamp: new Date(decision.timestamp || Date.now())
      }
    });

    // Broadcast
    broadcast('ai-ceo-decision', savedDecision);

    res.json({ success: true, decision: savedDecision });
  } catch (error) {
    console.error("AI CEO Decision Error:", error);
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : "Failed to execute AI CEO decision engine" });
  }
};

export const executeAgent = async (req: Request, res: Response) => {
  try {
    const { agentId, agentName, firmName, domain, taskTitle, instructions } = req.body;
    
    const promptText = `
You are ${agentName}, an elite specialist AI Agent working at "${firmName}" under the parent company Alexanda Martinz Inc.
Your domain of expertise is: ${domain}.
Task Assigned by Corporate Hierarchy: "${taskTitle}"
Detailed Instructions: "${instructions || "Provide a high-quality, professional, production-ready deliverable."}"

Return a structured JSON output with the exact schema:
{
  "title": "Clean concise title",
  "firm": "${firmName}",
  "summary": "1-2 sentence high-level summary",
  "content": "Detailed markdown formatted deliverable content (include headings, bullet points, data tables or code snippets where appropriate for domain)",
  "deliverableType": "Document | Codebase | Concept Specification | Report | Design Spec",
  "timestamp": "ISO timestamp"
}
Output MUST be pure JSON only.
`;

    const output = await aiService.generateAiContent(promptText);
    res.json({ success: true, output });
  } catch (error) {
    console.error("Agent Execution Error:", error);
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : "Failed to execute AI agent task" });
  }
};

export const auditSecurity = async (req: Request, res: Response) => {
  try {
    const { scanScope } = req.body;
    
    const promptText = `
You are Holas, God of the Cloud, Head of Cloud Governance & Security Guardian for Alexanda Martinz Inc. AI Network.
You control cloud policies, firewalls, permissions, threat oversight, and operational platform protection.

Scope of Scan Requested: "${scanScope || "Full Network Cloud Security & Policy Audit"}"

Perform a security audit and return a structured JSON response:
{
  "securityScore": 98,
  "threatLevel": "LOW | MEDIUM | ELEVATED | HIGH",
  "governanceStatus": "COMPLIANT | ATTENTION REQUIRED",
  "scannedNodes": 7,
  "firewallRulesActive": 48,
  "activeThreatsBlocked": 19,
  "auditFindings": [
    "finding 1",
    "finding 2",
    "finding 3"
  ],
  "recommendations": [
    "rec 1",
    "rec 2"
  ],
  "timestamp": "ISO timestamp"
}
Output MUST be pure JSON only.
`;

    const audit = await aiService.generateAiContent(promptText);
    res.json({ success: true, audit });
  } catch (error) {
    console.error("Holas Security Audit Error:", error);
    res.status(500).json({ success: false, error: error instanceof Error ? error.message : "Failed to run Holas cloud security audit" });
  }
};
