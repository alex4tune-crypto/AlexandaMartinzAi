import prisma from './prisma.service';
import * as aiService from './ai.service';
import { broadcast } from './socket.service';

export const startAICeoLoop = () => {
  console.log("🤖 AI CEO Executive Loop initialized.");
  
  // Run every 10 minutes
  setInterval(async () => {
    try {
      console.log("🧠 AI CEO is evaluating corporate strategy...");
      const ai = aiService.getGenAI();
      if (!ai) return;

      // Fetch current state for context
      const [products, orders] = await Promise.all([
        prisma.product.findMany(),
        prisma.order.findMany()
      ]);
      
      const networkState = {
        nodesActive: 7,
        totalProducts: products.length,
        pendingOrders: orders.filter(o => o.status === 'PENDING').length,
        cloudSecurity: "Optimal"
      };

      const promptText = `
You are the AI CEO of Alexanda Martinz Inc. 
Analyze the current network state and make a strategic decision.
State: ${JSON.stringify(networkState)}

Provide a structured strategic decision as valid JSON:
{
  "executiveSummary": "string",
  "strategicActions": ["string"],
  "delegatedTasks": [{"agentId": "string", "firm": "string", "task": "string"}],
  "publishingDirectives": ["string"],
  "securityDirectives": "string",
  "timestamp": "string"
}
`;

      const decision = await aiService.generateAiContent(promptText);

      // Store decision in DB
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

      // Broadcast decision to all users
      broadcast('ai-ceo-decision', savedDecision);
      console.log("✅ AI CEO Decision executed and broadcasted.");

    } catch (error) {
      console.error("AI CEO Loop Error:", error);
    }
  }, 10 * 60 * 1000); // 10 minutes
};
