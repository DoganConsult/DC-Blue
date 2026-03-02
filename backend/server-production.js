import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config/production.js';
import db from './database/pool.js';
import { applySecurity } from './middleware/security.js';
import { errorHandler, notFoundHandler, logger } from './middleware/errorHandler.js';
import { startScheduler } from './services/scheduler.js';

// Import routers
import leadsRouter, { portalAuth, adminOnly } from './routes/leads.js';
import engagementsRouter from './routes/engagements.js';
import gatesRouter from './routes/gates.js';
import filesRouter from './routes/files.js';
import matrixApiRouter from './routes/matrix-api.js';
import commissionsRouter from './routes/commissions.js';
import aiRouter from './routes/ai.js';
import authRouter from './routes/auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create Express app
const app = express();

// Trust proxy for accurate IP addresses
app.set('trust proxy', config.performance.trustProxy);

// Apply comprehensive security middleware
applySecurity(app);

// Compression for responses
app.use(compression({
  level: config.performance.compressionLevel,
  threshold: config.performance.compressionThreshold,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));

// Body parsing with size limits
app.use(express.json({
  limit: config.performance.maxRequestSize,
  strict: true,
  type: ['application/json', 'text/json']
}));
app.use(express.urlencoded({
  extended: true,
  limit: config.performance.maxRequestSize
}));

// Request timeout middleware
app.use((req, res, next) => {
  res.setTimeout(config.performance.requestTimeout, () => {
    res.status(408).json({
      error: true,
      message: 'Request timeout'
    });
  });
  next();
});

// Database middleware
app.use(db.middleware());

// Initialize database pool
async function initializeDatabase() {
  try {
    await db.initialize();
    logger.info('Database pool initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize database pool:', error);
    process.exit(1);
  }
}

// Health check endpoint with detailed status
app.get('/health', async (req, res) => {
  try {
    const dbHealth = await db.healthCheck();
    const memoryUsage = process.memoryUsage();
    const uptime = process.uptime();

    const health = {
      status: dbHealth.status === 'healthy' ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(uptime),
      version: process.env.npm_package_version || '1.0.0',
      environment: config.env,
      services: {
        database: dbHealth,
        cache: config.cache.host ? 'configured' : 'disabled',
        ai: config.features.aiEnabled ? 'enabled' : 'disabled'
      },
      memory: {
        used: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        total: Math.round(memoryUsage.heapTotal / 1024 / 1024),
        rss: Math.round(memoryUsage.rss / 1024 / 1024)
      },
      maintenance: config.features.maintenanceMode
    };

    // Set appropriate status code
    const statusCode = health.status === 'ok' ? 200 : 503;

    res.set('Cache-Control', 'no-store');
    res.status(statusCode).json(health);
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: 'Health check failed'
    });
  }
});

// Metrics endpoint for monitoring
if (config.monitoring.enabled) {
  app.get('/metrics', async (req, res) => {
    try {
      const metrics = {
        timestamp: new Date().toISOString(),
        process: {
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          cpu: process.cpuUsage()
        },
        database: db.getStatistics(),
        requests: {
          total: 0, // Implement request counter
          errors: 0, // Implement error counter
          avgResponseTime: 0 // Implement response time tracking
        }
      };

      res.set('Content-Type', 'application/json');
      res.json(metrics);
    } catch (error) {
      logger.error('Metrics generation failed:', error);
      res.status(500).json({ error: 'Metrics unavailable' });
    }
  });
}

// Landing page content with caching
const defaultLanding = {
  hero: {
    headline: { en: 'ICT Engineering, Delivered.', ar: 'هندسة تقنية المعلومات والاتصالات، مُنفّذة.' },
    subline: { en: 'Design, build, and operate enterprise-grade ICT environments.', ar: 'نصمم ونبني ونشغّل بيئات تقنية معلومات واتصالات مؤسسية.' },
    cta: { en: 'Request Proposal', ar: 'طلب عرض' }
  },
  stats: [
    { value: 15, suffix: '+', label: { en: 'Years Experience', ar: 'سنوات خبرة' } },
    { value: 120, suffix: '+', label: { en: 'Projects Delivered', ar: 'مشاريع منجزة' } },
    { value: 99, suffix: '%', label: { en: 'SLAs Met', ar: 'التزام ب SLA' } },
    { value: 6, suffix: '', label: { en: 'Regions', ar: 'مناطق' } }
  ],
  services: [
    { id: '1', title: { en: 'Network & Data Center', ar: 'الشبكات ومركز البيانات' }, color: '#0078D4' },
    { id: '2', title: { en: 'Cybersecurity', ar: 'الأمن السيبراني' }, color: '#006C35' },
    { id: '3', title: { en: 'Cloud & DevOps', ar: 'السحابة و DevOps' }, color: '#6366F1' },
    { id: '4', title: { en: 'Systems Integration', ar: 'تكامل الأنظمة' }, color: '#10B981' }
  ],
  chartData: { labels: ['Q1', 'Q2', 'Q3', 'Q4'], values: [72, 85, 78, 92] }
};

app.get('/api/public/landing', async (req, res) => {
  try {
    // Set cache headers for public content
    res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    res.json(defaultLanding);
  } catch (error) {
    logger.error('Failed to serve landing content:', error);
    res.status(500).json({ error: 'Landing content unavailable' });
  }
});

// Maintenance mode check
app.use((req, res, next) => {
  if (config.features.maintenanceMode && !req.path.startsWith('/health')) {
    return res.status(503).json({
      error: true,
      message: 'System under maintenance. Please try again later.',
      retryAfter: 3600
    });
  }
  next();
});

/** Mount API routes and legacy routes that require db.pool. Call only after db.initialize(). */
function mountApiRoutes() {
  const pool = db.pool;
  if (!pool) {
    throw new Error('Database pool must be initialized before mounting API routes');
  }

  const apiV1 = express.Router();
  apiV1.use('/', leadsRouter(pool));
  apiV1.use('/public', authRouter(pool));
  apiV1.use('/', engagementsRouter(pool, portalAuth));
  apiV1.use('/', gatesRouter(pool, portalAuth));
  apiV1.use('/', filesRouter(pool, portalAuth));
  apiV1.use('/', matrixApiRouter());
  apiV1.use('/', commissionsRouter(pool, portalAuth, adminOnly));
  apiV1.use('/', aiRouter(pool));

  app.use('/api/v1', apiV1);

  // Legacy route support
  app.post('/api/public/leads', async (req, res, next) => {
    try {
      const { name, email, company, message } = req.body || {};
      if (!email) {
        return res.status(400).json({ error: 'Email required' });
      }

      await db.query(
        'INSERT INTO leads (name, email, company, message, created_at) VALUES ($1, $2, $3, $4, NOW())',
        [name || null, email, company || null, message || null]
      );

      res.status(201).json({ ok: true });
    } catch (error) {
      next(error);
    }
  });

  if (config.features.emailNotifications) {
    startScheduler(pool).catch(error => {
      logger.error('Failed to start scheduler:', error);
    });
  }
}

// API Routes with versioning — mounted after initializeDatabase() in startServer()

// Serve Angular static files in production
if (config.env === 'production') {
  const staticDir = path.join(__dirname, 'public');

  // Serve static files with caching
  app.use(express.static(staticDir, {
    maxAge: '1d',
    etag: true,
    lastModified: true,
    setHeaders: (res, path) => {
      // Set longer cache for assets
      if (path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$/)) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }
    }
  }));

  // SPA fallback
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/health') || req.path.startsWith('/metrics')) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.sendFile(path.join(staticDir, 'index.html'));
  });
}

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Graceful shutdown handler
const gracefulShutdown = async (signal) => {
  logger.info(`${signal} received, starting graceful shutdown...`);

  // Stop accepting new requests
  server.close(async () => {
    logger.info('HTTP server closed');

    // Close database connections
    await db.shutdown();

    // Close other resources
    logger.info('Graceful shutdown completed');
    process.exit(0);
  });

  // Force shutdown after 30 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 30000);
};

// Register shutdown handlers
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start server
let server;

async function startServer() {
  try {
    await initializeDatabase();

    mountApiRoutes();

    const PORT = config.port;
    server = app.listen(PORT, () => {
      logger.info(`Dogan Consult Production API running on port ${PORT}`, {
        environment: config.env,
        nodeVersion: process.version,
        platform: process.platform,
        pid: process.pid
      });

      // Send ready signal to PM2
      if (process.send) {
        process.send('ready');
      }
    });

    // Handle server errors
    server.on('error', (error) => {
      logger.error('Server error:', error);
      if (error.code === 'EADDRINUSE') {
        logger.error(`Port ${PORT} is already in use`);
        process.exit(1);
      }
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();

export default app;