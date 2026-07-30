import { Request, Response } from 'express';
import si from 'systeminformation';

export const getStats = async (req: Request, res: Response) => {
  try {
    const [cpu, mem, os, disk, net] = await Promise.all([
      si.currentLoad(),
      si.mem(),
      si.osInfo(),
      si.fsSize(),
      si.networkStats()
    ]);

    res.json({
      success: true,
      stats: {
        cpu: {
          load: cpu.currentLoad,
          cores: cpu.cpus.length,
        },
        memory: {
          total: mem.total,
          active: mem.active,
          used_percent: (mem.active / mem.total) * 100
        },
        os: {
          platform: os.platform,
          distro: os.distro,
          release: os.release
        },
        disk: disk.map(d => ({
          fs: d.fs,
          size: d.size,
          used: d.used,
          use_percent: d.use
        })),
        network: net[0] || {}
      }
    });
  } catch (error) {
    console.error("System Stats Error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch system stats" });
  }
};

export const getHealth = (req: Request, res: Response) => {
  res.json({
    status: "ok",
    company: "Alexanda Martinz Inc.",
    networkStatus: "Operational",
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
};
