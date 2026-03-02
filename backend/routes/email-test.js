import { Router } from 'express';
import emailService from '../services/email-service.js';

export default function emailTestRouter(pool) {
  const router = Router();

  // Test email endpoint - Admin only
  router.post('/test-email', async (req, res) => {
    try {
      const { to, type = 'test' } = req.body;

      // For production, add authentication check here
      // For now, we'll allow testing

      let result;

      switch(type) {
        case 'welcome':
          result = await emailService.sendWelcomeEmail(
            to || 'doganlap@gmail.com',
            'Test User'
          );
          break;

        case 'lead':
          result = await emailService.sendLeadNotification({
            company_name: 'Test Company',
            contact_name: 'Test Contact',
            contact_email: 'test@example.com',
            contact_phone: '+966 50 123 4567',
            service_interest: 'Cloud & DevOps',
            budget_range: 'SAR 100,000 - 500,000',
            timeline: 'Q2 2026',
            message: 'This is a test lead notification',
            source: 'Website'
          });
          break;

        case 'commission':
          result = await emailService.sendCommissionNotification(
            to || 'doganlap@gmail.com',
            {
              amount: '15,000',
              status: 'Approved',
              leadId: 'TEST-001'
            }
          );
          break;

        default:
          result = await emailService.sendTestEmail(to);
      }

      if (result.success) {
        res.json({
          success: true,
          message: `Email sent successfully to ${result.to || to || 'admin'}`,
          messageId: result.messageId,
          type: type
        });
      } else {
        res.status(500).json({
          success: false,
          error: result.error,
          message: 'Failed to send email'
        });
      }

    } catch (error) {
      console.error('Email test error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Verify email configuration
  router.get('/verify-email', async (req, res) => {
    try {
      const isConnected = await emailService.verifyConnection();

      res.json({
        success: isConnected,
        message: isConnected
          ? 'Email service is configured and ready'
          : 'Email service is not properly configured',
        config: {
          method: 'Microsoft Graph API (OAuth2)',
          platform_sender: process.env.MSGRAPH_SENDER || 'info@doganconsult.com',
          admin_mailbox: process.env.MSGRAPH_ADMIN_EMAIL || 'ahmet.dogan@doganconsult.com',
        }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  return router;
}