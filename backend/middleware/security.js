import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import cors from 'cors';
import { config } from '../config/production.js';
import { RateLimitError } from './errorHandler.js';
import crypto from 'crypto';

// Security headers middleware
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      connectSrc: ["'self'", "https://api.anthropic.com"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
      blockAllMixedContent: []
    }
  },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: { policy: "cross-origin" },
  dnsPrefetchControl: true,
  frameguard: { action: 'deny' },
  hidePoweredBy: true,
  hsts: {
    maxAge: config.ssl.hstsMaxAge,
    includeSubDomains: config.ssl.hstsIncludeSubDomains,
    preload: config.ssl.hstsPreload
  },
  ieNoOpen: true,
  noSniff: true,
  originAgentCluster: true,
  permittedCrossDomainPolicies: false,
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  xssFilter: true
});

// CORS configuration
export const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || config.cors.origins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: config.cors.credentials,
  maxAge: config.cors.maxAge,
  methods: config.cors.methods,
  allowedHeaders: config.cors.allowedHeaders,
  exposedHeaders: config.cors.exposedHeaders,
  optionsSuccessStatus: 200
};

// Rate limiting middleware
export const apiRateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: config.rateLimit.skipSuccessfulRequests,
  skipFailedRequests: config.rateLimit.skipFailedRequests,
  keyGenerator: config.rateLimit.keyGenerator,
  handler: (req, res) => {
    throw new RateLimitError('Too many requests', Math.ceil(req.rateLimit.resetTime / 1000));
  }
});

// Strict rate limiter for authentication endpoints
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true
});

// Speed limiter to slow down repeated requests
export const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 100, // Allow 100 requests per window without delay
  delayMs: 100, // Add 100ms delay per request after delayAfter
  maxDelayMs: 2000, // Maximum delay of 2 seconds
  skipSuccessfulRequests: false
});

// Request sanitization
export const sanitizeInput = (req, res, next) => {
  // Remove any MongoDB operators from req.body, req.query, and req.params
  if (req.body) sanitizeObject(req.body);
  if (req.query) sanitizeObject(req.query);
  if (req.params) sanitizeObject(req.params);
  next();
};

function sanitizeObject(obj) {
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      // Remove dangerous characters
      obj[key] = obj[key]
        .replace(/[<>]/g, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .trim();

      // Prevent SQL injection
      if (obj[key].match(/(\bDROP\b|\bDELETE\b|\bINSERT\b|\bUPDATE\b|\bEXEC\b|\bUNION\b)/i)) {
        obj[key] = '';
      }
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      sanitizeObject(obj[key]);
    }
  }
}

// HTTP Parameter Pollution prevention
export const preventHPP = hpp({
  whitelist: ['sort', 'filter', 'page', 'limit', 'fields']
});

// Request ID middleware for tracking
export const requestId = (req, res, next) => {
  req.id = crypto.randomUUID();
  res.setHeader('X-Request-Id', req.id);
  next();
};

// IP filtering middleware
export const ipFilter = (allowedIPs = []) => {
  return (req, res, next) => {
    if (allowedIPs.length === 0) return next();

    const clientIp = req.ip || req.connection.remoteAddress;
    if (allowedIPs.includes(clientIp)) {
      next();
    } else {
      res.status(403).json({
        error: true,
        message: 'Access denied from this IP address'
      });
    }
  };
};

// Session security
export const sessionSecurity = (req, res, next) => {
  if (req.session) {
    // Regenerate session ID on login
    if (req.body && req.body.regenerateSession) {
      req.session.regenerate((err) => {
        if (err) next(err);
        else next();
      });
    } else {
      // Set secure session options
      req.session.cookie.secure = config.ssl.enabled;
      req.session.cookie.httpOnly = true;
      req.session.cookie.sameSite = 'strict';
      req.session.cookie.maxAge = config.cache.sessionTTL * 1000;
      next();
    }
  } else {
    next();
  }
};

// Content type validation
export const validateContentType = (expectedType = 'application/json') => {
  return (req, res, next) => {
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
      const contentType = req.headers['content-type'];
      if (!contentType || !contentType.includes(expectedType)) {
        return res.status(415).json({
          error: true,
          message: `Content-Type must be ${expectedType}`
        });
      }
    }
    next();
  };
};

// API key validation middleware
export const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.query.apiKey;

  if (!apiKey) {
    return res.status(401).json({
      error: true,
      message: 'API key required'
    });
  }

  // Validate API key (implement your validation logic)
  if (!isValidApiKey(apiKey)) {
    return res.status(401).json({
      error: true,
      message: 'Invalid API key'
    });
  }

  next();
};

function isValidApiKey(apiKey) {
  // Implement API key validation logic
  // This should check against database or cache
  return apiKey.length === 32; // Simple validation for now
}

// Security audit logging
export const auditLog = (action) => {
  return (req, res, next) => {
    const log = {
      action,
      userId: req.user?.id,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      timestamp: new Date().toISOString(),
      requestId: req.id,
      method: req.method,
      path: req.path,
      query: req.query,
      statusCode: res.statusCode
    };

    // Log to audit file or database
    console.log('AUDIT:', JSON.stringify(log));

    next();
  };
};

// Combined security middleware
export const applySecurity = (app) => {
  // Basic security
  app.use(securityHeaders);
  app.use(cors(corsOptions));
  app.use(requestId);

  // Rate limiting
  app.use('/api/', apiRateLimiter);
  app.use('/api/auth/', authRateLimiter);
  app.use(speedLimiter);

  // Input validation and sanitization
  app.use(sanitizeInput);
  app.use(preventHPP);
  app.use(validateContentType('application/json'));

  // Session security
  app.use(sessionSecurity);

  // Trust proxy for accurate IP addresses
  app.set('trust proxy', config.performance.trustProxy);

  // Disable X-Powered-By header
  app.disable('x-powered-by');

  // Set secure defaults
  app.set('query parser', config.performance.queryParser);
  app.set('strict routing', config.performance.strictRouting);
  app.set('case sensitive routing', config.performance.caseSensitive);
  app.set('etag', config.performance.etag);
};

export default {
  securityHeaders,
  corsOptions,
  apiRateLimiter,
  authRateLimiter,
  speedLimiter,
  sanitizeInput,
  preventHPP,
  requestId,
  ipFilter,
  sessionSecurity,
  validateContentType,
  validateApiKey,
  auditLog,
  applySecurity
};