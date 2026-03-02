import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load production environment variables
dotenv.config({ path: path.join(__dirname, '../../.env.production') });

export const config = {
  // Environment
  env: 'production',
  port: process.env.PORT || 4000,
  apiVersion: process.env.API_VERSION || 'v1',

  // Database Configuration
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'dogan_consult_prod',
    user: process.env.DB_USER || 'dogan_prod_user',
    password: process.env.DB_PASSWORD,
    max: parseInt(process.env.DB_MAX_CONNECTIONS || '100'),
    idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000'),
    connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT || '10000'),
    ssl: process.env.DB_SSL_MODE === 'require' ? { rejectUnauthorized: false } : false,
    statement_timeout: 30000,
    query_timeout: 30000,
    application_name: 'dogan-consult-api',
    keepAlive: true,
    keepAliveInitialDelayMillis: 10000
  },

  // Security Configuration
  security: {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiry: process.env.JWT_EXPIRY || '7d',
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
    refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY || '30d',
    sessionSecret: process.env.SESSION_SECRET,
    encryptionKey: process.env.ENCRYPTION_KEY,
    bcryptRounds: 12,
    maxLoginAttempts: 5,
    lockoutDuration: 900000, // 15 minutes
    passwordMinLength: 12,
    passwordRequireUppercase: true,
    passwordRequireLowercase: true,
    passwordRequireNumber: true,
    passwordRequireSpecial: true
  },

  // CORS Configuration
  cors: {
    enabled: process.env.ENABLE_CORS === 'true',
    origins: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [],
    credentials: true,
    maxAge: 86400,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-API-Key'],
    exposedHeaders: ['X-Total-Count', 'X-Page-Count']
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.API_RATE_LIMIT_WINDOW || '900000'),
    max: parseInt(process.env.API_RATE_LIMIT_MAX || '200'),
    burstLimit: parseInt(process.env.API_BURST_LIMIT || '50'),
    skipSuccessfulRequests: false,
    skipFailedRequests: false,
    keyGenerator: (req) => req.ip || req.connection.remoteAddress,
    handler: (req, res) => {
      res.status(429).json({
        error: 'Too many requests',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
      });
    }
  },

  // Email Configuration
  email: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    },
    from: process.env.EMAIL_FROM || 'Dogan Consult <noreply@doganconsult.com>',
    replyTo: process.env.EMAIL_REPLY_TO || 'support@doganconsult.com',
    tls: {
      rejectUnauthorized: true,
      minVersion: 'TLSv1.2'
    },
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
    rateDelta: 1000,
    rateLimit: 5
  },

  // AI Configuration
  ai: {
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
    maxTokens: parseInt(process.env.AI_MAX_TOKENS || '4000'),
    temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7'),
    timeout: parseInt(process.env.AI_TIMEOUT || '60000'),
    retryAttempts: parseInt(process.env.AI_RETRY_ATTEMPTS || '3'),
    rateLimit: parseInt(process.env.AI_RATE_LIMIT || '100'),
    model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5-20250929',
    systemPrompt: 'You are Shahin AI, an expert ICT consultant specializing in Saudi Arabian regulations and business practices.'
  },

  // File Upload Configuration
  upload: {
    maxFileSize: parseInt(process.env.UPLOAD_MAX_FILE_SIZE || '52428800'), // 50MB
    allowedExtensions: process.env.UPLOAD_ALLOWED_EXTENSIONS ?
      process.env.UPLOAD_ALLOWED_EXTENSIONS.split(',') :
      ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'png', 'jpg', 'jpeg'],
    storagePath: process.env.UPLOAD_STORAGE_PATH || '/var/dogan-consult/uploads',
    tempPath: process.env.TEMP_FILES_PATH || '/var/dogan-consult/temp',
    scanForViruses: true,
    preserveExtension: true,
    createParentPath: true,
    useTempFiles: true,
    tempFileDir: '/tmp',
    safeFileNames: true,
    limitHandler: false
  },

  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'json',
    dir: process.env.LOG_DIR || '/var/log/dogan-consult',
    maxSize: '100m',
    maxFiles: '30d',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    handleExceptions: true,
    handleRejections: true,
    exitOnError: false,
    timestamp: true,
    colorize: false
  },

  // Cache Configuration (Redis)
  cache: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB || '0'),
    ttl: parseInt(process.env.CACHE_TTL || '3600'),
    sessionTTL: parseInt(process.env.SESSION_TTL || '86400'),
    keyPrefix: 'dogan:',
    enableOfflineQueue: true,
    connectTimeout: 10000,
    maxRetriesPerRequest: 3,
    retryStrategy: (times) => Math.min(times * 50, 2000),
    reconnectOnError: (err) => {
      const targetError = 'READONLY';
      if (err.message.includes(targetError)) {
        return true;
      }
      return false;
    }
  },

  // Performance Configuration
  performance: {
    requestTimeout: parseInt(process.env.REQUEST_TIMEOUT || '30000'),
    maxRequestSize: process.env.MAX_REQUEST_SIZE || '10mb',
    compression: process.env.ENABLE_COMPRESSION !== 'false',
    compressionLevel: 6,
    compressionThreshold: '1kb',
    trustProxy: true,
    xPoweredBy: false,
    etag: 'strong',
    queryParser: 'extended',
    strictRouting: false,
    caseSensitive: false
  },

  // Monitoring
  monitoring: {
    enabled: process.env.ENABLE_METRICS === 'true',
    metricsPort: parseInt(process.env.METRICS_PORT || '9090'),
    healthCheckInterval: parseInt(process.env.HEALTH_CHECK_INTERVAL || '30000'),
    apmEnabled: process.env.ENABLE_APM === 'true',
    apmServiceName: process.env.APM_SERVICE_NAME || 'dogan-consult-api',
    sentryDsn: process.env.SENTRY_DSN,
    sentryEnvironment: 'production',
    sentryTracesSampleRate: 0.1,
    collectDefaultMetrics: true,
    gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5]
  },

  // Feature Flags
  features: {
    aiEnabled: process.env.ENABLE_AI_FEATURES !== 'false',
    partnerPortal: process.env.ENABLE_PARTNER_PORTAL !== 'false',
    adminPortal: process.env.ENABLE_ADMIN_PORTAL !== 'false',
    emailNotifications: process.env.ENABLE_EMAIL_NOTIFICATIONS !== 'false',
    realTimeUpdates: process.env.ENABLE_REAL_TIME_UPDATES === 'true',
    advancedAnalytics: process.env.ENABLE_ADVANCED_ANALYTICS === 'true',
    maintenanceMode: process.env.MAINTENANCE_MODE === 'true'
  },

  // SSL/TLS Configuration
  ssl: {
    enabled: process.env.FORCE_SSL === 'true',
    certPath: process.env.SSL_CERT_PATH,
    keyPath: process.env.SSL_KEY_PATH,
    caPath: process.env.SSL_CA_PATH,
    hstsMaxAge: parseInt(process.env.HSTS_MAX_AGE || '31536000'),
    hstsIncludeSubDomains: true,
    hstsPreload: true
  },

  // Backup Configuration
  backup: {
    enabled: process.env.BACKUP_ENABLED === 'true',
    schedule: process.env.BACKUP_SCHEDULE || '0 2 * * *',
    retentionDays: parseInt(process.env.BACKUP_RETENTION_DAYS || '30'),
    s3Bucket: process.env.BACKUP_S3_BUCKET,
    localPath: '/var/backups/dogan-consult',
    compress: true,
    encrypt: true
  },

  // External Services
  external: {
    cloudflare: {
      zoneId: process.env.CLOUDFLARE_ZONE_ID,
      apiToken: process.env.CLOUDFLARE_API_TOKEN
    },
    aws: {
      region: process.env.AWS_REGION || 'me-south-1',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      s3BucketName: process.env.S3_BUCKET_NAME
    }
  }
};

export default config;