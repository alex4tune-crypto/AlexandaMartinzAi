import { Request, Response } from 'express';
import prisma from '../services/prisma.service';

export const syncProfile = async (req: Request, res: Response) => {
  try {
    const { id, email, displayName, companyName, role, emailVerified } = req.body;
    
    let user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      const isDefaultAdmin = email === 'alexandamartinz4@gmail.com' || role === 'admin';
      user = await prisma.user.create({
        data: {
          id,
          email: email || '',
          displayName: displayName || email?.split('@')[0] || 'Member',
          companyName: companyName || 'Alexanda Martinz Enterprise Network',
          role: isDefaultAdmin ? 'admin' : (role || 'customer'),
          plan: isDefaultAdmin ? 'Enterprise Network' : 'Pro Foundry',
          accountBalance: isDefaultAdmin ? 250000 : 5000,
          emailVerified: !!emailVerified,
          lastLogin: new Date()
        }
      });
    } else {
      user = await prisma.user.update({
        where: { id },
        data: {
          emailVerified: !!emailVerified,
          lastLogin: new Date()
        }
      });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error("Sync Profile Error:", error);
    res.status(500).json({ success: false, error: "Failed to sync user profile" });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const user = await prisma.user.update({
      where: { id },
      data: updates
    });

    res.json({ success: true, user });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ success: false, error: "Failed to update profile" });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ success: false, error: "User not found" });
    res.json({ success: true, user });
  } catch (error) {
    console.error("Get Profile Error:", error);
    res.status(500).json({ success: false, error: "Failed to get profile" });
  }
};
