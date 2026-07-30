import { Request, Response } from 'express';
import prisma from '../services/prisma.service';

export const logEvent = async (req: Request, res: Response) => {
  try {
    const event = req.body;
    await prisma.analyticsEvent.create({
      data: {
        type: event.type || 'unknown',
        payload: event.payload || {},
        timestamp: new Date()
      }
    });
    res.json({ success: true });
  } catch (error) {
    console.error("Log Event Error:", error);
    res.status(500).json({ success: false, error: "Failed to log event" });
  }
};

export const getEvents = async (req: Request, res: Response) => {
  try {
    const events = await prisma.analyticsEvent.findMany({
      orderBy: { timestamp: 'desc' },
      take: 100
    });
    res.json({ success: true, events });
  } catch (error) {
    console.error("Fetch Events Error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch events" });
  }
};

export const getRetention = async (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      retention: {
        day1: "82%",
        day7: "45%",
        day30: "12%"
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch retention" });
  }
};
