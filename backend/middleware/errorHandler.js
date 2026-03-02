import winston from 'winston';
import { config } from '../config/production.js';

// Create logger instance
const logger = winston.createLogger({
  level: config.logging.level,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'dogan-consult-api' },
  transports: [
    new winston.transports.File({
      filename: `${config.logging.dir}/error.log`,
      level: 'error',
      maxsize: 104857600, // 100MB
      maxFiles: 30,
      tailable: true
    }),
    new winston.transports.File({
      filename: `${config.logging.dir}/combined.log`,
      maxsize: 104857600,
      maxFiles: 30,
      tailable: true
    })
  ],
  exitOnError: false
});

// Add console transport in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Error types
class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.timestamp = new Date().toISOString();
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message, details = null) {
    super(message, 400);
    this.name = 'ValidationError';
    this.details = details;
  }
}

class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

class AuthorizationError extends AppError {
  constructor(message = 'Access denied') {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}

class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404);
    this.name = 'NotFoundError';
  }
}

class ConflictError extends AppError {
  constructor(message = 'Resource conflict') {
    super(message, 409);
    this.name = 'ConflictError';
  }
}

class RateLimitError extends AppError {
  constructor(message = 'Too many requests', retryAfter = null) {
    super(message, 429);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}

class DatabaseError extends AppError {
  constructor(message = 'Database operation failed', originalError = null) {
    super(message, 500, false);
    this.name = 'DatabaseError';
    this.originalError = originalError;
  }
}

class ExternalServiceError extends AppError {
  constructor(service, message = 'External service unavailable', originalError = null) {
    super(message, 503);
    this.name = 'ExternalServiceError';
    this.service = service;
    this.originalError = originalError;
  }
}

// Async error handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Central error handling middleware
const errorHandler = (err, req, res, next) => {
  // Default error values
  let error = { ...err };
  error.message = err.message;

  // Log error
  const logError = {
    message: err.message,
    statusCode: err.statusCode || 500,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userId: req.user?.id,
    stack: err.stack,
    timestamp: new Date().toISOString()
  };

  // Handle specific error types
  if (err.code === 'EBADCSRFTOKEN') {
    error = new AppError('Invalid CSRF token', 403);
  } else if (err.code === 'ECONNREFUSED') {
    error = new DatabaseError('Database connection failed');
  } else if (err.code === '23505') { // PostgreSQL unique violation
    error = new ConflictError('Resource already exists');
  } else if (err.code === '23503') { // PostgreSQL foreign key violation
    error = new ValidationError('Invalid reference');
  } else if (err.code === '22P02') { // PostgreSQL invalid input syntax
    error = new ValidationError('Invalid input format');
  } else if (err.name === 'JsonWebTokenError') {
    error = new AuthenticationError('Invalid token');
  } else if (err.name === 'TokenExpiredError') {
    error = new AuthenticationError('Token expired');
  } else if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      error = new ValidationError('File too large');
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      error = new ValidationError('Unexpected file field');
    } else {
      error = new ValidationError('File upload error');
    }
  }

  // Set default status code
  if (!error.statusCode) {
    error.statusCode = 500;
  }

  // Log error based on severity
  if (error.statusCode >= 500) {
    logger.error(logError);
  } else if (error.statusCode >= 400) {
    logger.warn(logError);
  } else {
    logger.info(logError);
  }

  // Send error response
  const response = {
    error: true,
    message: error.message || 'Internal server error',
    statusCode: error.statusCode
  };

  // Add additional error details in development
  if (process.env.NODE_ENV !== 'production') {
    response.stack = error.stack;
    response.details = error.details;
  }

  // Add retry-after header for rate limit errors
  if (error.retryAfter) {
    res.set('Retry-After', error.retryAfter);
  }

  // Send response
  res.status(error.statusCode).json(response);
};

// Not found handler
const notFoundHandler = (req, res, next) => {
  const error = new NotFoundError(`Route ${req.originalUrl}`);
  next(error);
};

// Uncaught exception handler
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  });
  // Exit process after logging
  setTimeout(() => {
    process.exit(1);
  }, 1000);
});

// Unhandled rejection handler
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection:', {
    reason: reason,
    promise: promise,
    timestamp: new Date().toISOString()
  });
  // Exit process after logging
  setTimeout(() => {
    process.exit(1);
  }, 1000);
});

// SIGTERM handler for graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

export {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  DatabaseError,
  ExternalServiceError,
  asyncHandler,
  errorHandler,
  notFoundHandler,
  logger
};