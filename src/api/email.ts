// Email Notification Service
import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Configure your email service (Gmail, SendGrid, etc.)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const emailService = {
  async sendOrderConfirmation(
    email: string,
    orderData: { id: string; items: any[]; total: number }
  ) {
    const html = `
      <h2>Order Confirmation</h2>
      <p>Thank you for your order!</p>
      <p><strong>Order ID:</strong> ${orderData.id}</p>
      <h3>Items:</h3>
      <ul>
        ${orderData.items.map((item) => `<li>${item.title} - $${item.price}</li>`).join('')}
      </ul>
      <p><strong>Total:</strong> $${orderData.total}</p>
      <p>Your order will be processed shortly.</p>
    `;
    return transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@alexandamartinz.com',
      to: email,
      subject: 'Order Confirmation',
      html,
    });
  },

  async sendDeploymentNotification(
    email: string,
    deploymentData: { projectName: string; status: string; timestamp: string }
  ) {
    const html = `
      <h2>Deployment Update</h2>
      <p><strong>Project:</strong> ${deploymentData.projectName}</p>
      <p><strong>Status:</strong> ${deploymentData.status}</p>
      <p><strong>Time:</strong> ${deploymentData.timestamp}</p>
    `;
    return transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@alexandamartinz.com',
      to: email,
      subject: `Deployment ${deploymentData.status}: ${deploymentData.projectName}`,
      html,
    });
  },

  async sendAlertNotification(
    email: string,
    alertData: { service: string; severity: string; message: string }
  ) {
    const html = `
      <h2>Service Alert</h2>
      <p><strong>Service:</strong> ${alertData.service}</p>
      <p><strong>Severity:</strong> ${alertData.severity}</p>
      <p><strong>Message:</strong> ${alertData.message}</p>
    `;
    return transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@alexandamartinz.com',
      to: email,
      subject: `Alert: ${alertData.service}`,
      html,
    });
  },

  async sendWelcomeEmail(email: string, name: string) {
    const html = `
      <h2>Welcome to Alexanda Martinz AI Factory!</h2>
      <p>Hi ${name},</p>
      <p>Welcome to our platform. Get started by exploring our marketplace or managing your cloud deployments.</p>
      <p><a href="https://alexandamartinz.com/dashboard" style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Go to Dashboard</a></p>
    `;
    return transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@alexandamartinz.com',
      to: email,
      subject: 'Welcome to Alexanda Martinz AI Factory!',
      html,
    });
  },
};
