import pg from 'pg';
import { config } from '../config/production.js';
import { getConnectionString } from '../config/database.js';
import { logger } from '../middleware/errorHandler.js';

const { Pool } = pg;

// Production-grade database connection pool
class DatabasePool {
  constructor() {
    this.pool = null;
    this.connected = false;
    this.retryCount = 0;
    this.maxRetries = 5;
    this.retryDelay = 5000;
  }

  async initialize() {
    try {
      const connectionString = getConnectionString();
      this.pool = new Pool({
        connectionString,
        max: config.database.max,
        idleTimeoutMillis: config.database.idleTimeoutMillis,
        connectionTimeoutMillis: config.database.connectionTimeoutMillis,
        ssl: config.database.ssl,
        statement_timeout: config.database.statement_timeout,
        query_timeout: config.database.query_timeout,
        application_name: config.database.application_name,
        keepAlive: config.database.keepAlive,
        keepAliveInitialDelayMillis: config.database.keepAliveInitialDelayMillis
      });

      // Error handling
      this.pool.on('error', (err, client) => {
        logger.error('Unexpected database error on idle client', {
          error: err.message,
          stack: err.stack
        });
      });

      // Connection event handling
      this.pool.on('connect', (client) => {
        logger.debug('New database client connected');
        // Set session parameters for each new connection
        client.query('SET timezone = "UTC"');
        client.query('SET statement_timeout = 30000');
      });

      this.pool.on('acquire', (client) => {
        logger.debug('Database client acquired from pool');
      });

      this.pool.on('remove', (client) => {
        logger.debug('Database client removed from pool');
      });

      // Test connection
      await this.testConnection();

      // Create required database objects
      await this.initializeDatabase();

      this.connected = true;
      logger.info('Database pool initialized successfully', {
        poolSize: config.database.max
      });

      return this.pool;
    } catch (error) {
      logger.error('Failed to initialize database pool', {
        error: error.message,
        retryCount: this.retryCount
      });

      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        logger.info(`Retrying database connection in ${this.retryDelay / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        return this.initialize();
      }

      throw error;
    }
  }

  async testConnection() {
    try {
      const result = await this.pool.query('SELECT NOW()');
      logger.info('Database connection test successful', {
        serverTime: result.rows[0].now
      });
      return true;
    } catch (error) {
      logger.error('Database connection test failed', {
        error: error.message
      });
      throw error;
    }
  }

  async initializeDatabase() {
    try {
      // Create schemas if not exists
      await this.pool.query(`
        CREATE SCHEMA IF NOT EXISTS public;
      `);

      // Enable required extensions
      await this.pool.query(`
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        CREATE EXTENSION IF NOT EXISTS "pg_trgm";
        CREATE EXTENSION IF NOT EXISTS "pgcrypto";
      `);

      // Create performance indexes
      await this.createIndexes();

      logger.info('Database initialized with required objects');
    } catch (error) {
      logger.error('Failed to initialize database objects', {
        error: error.message
      });
      throw error;
    }
  }

  async createIndexes() {
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_leads_ticket_number ON leads(ticket_number)',
      'CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status)',
      'CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC)',
      'CREATE INDEX IF NOT EXISTS idx_leads_company_name ON leads USING gin(company_name gin_trgm_ops)',
      'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)',
      'CREATE INDEX IF NOT EXISTS idx_partner_leads_partner_id ON partner_leads(partner_id)',
      'CREATE INDEX IF NOT EXISTS idx_partner_leads_lead_id ON partner_leads(lead_id)',
      'CREATE INDEX IF NOT EXISTS idx_opportunities_lead_id ON opportunities(lead_id)',
      'CREATE INDEX IF NOT EXISTS idx_engagements_lead_id ON engagements(lead_id)',
      'CREATE INDEX IF NOT EXISTS idx_gates_entity_id ON gates(entity_id)',
      'CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expire)',
      'CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id) WHERE user_id IS NOT NULL',
      'CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC)'
    ];

    for (const index of indexes) {
      try {
        await this.pool.query(index);
      } catch (error) {
        logger.warn(`Failed to create index: ${index}`, {
          error: error.message
        });
      }
    }
  }

  // Execute query with automatic retries and circuit breaking
  async query(text, params, options = {}) {
    if (!this.connected) {
      throw new Error('Database pool not initialized');
    }

    const startTime = Date.now();
    const { retries = 3, retryDelay = 1000 } = options;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const result = await this.pool.query(text, params);

        // Log slow queries
        const duration = Date.now() - startTime;
        if (duration > 1000) {
          logger.warn('Slow query detected', {
            query: text,
            duration,
            rows: result.rowCount
          });
        }

        return result;
      } catch (error) {
        logger.error(`Query failed (attempt ${attempt}/${retries})`, {
          query: text,
          error: error.message,
          code: error.code,
          attempt
        });

        if (attempt === retries) {
          throw error;
        }

        // Check if error is retryable
        if (this.isRetryableError(error)) {
          await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
        } else {
          throw error;
        }
      }
    }
  }

  // Transaction support with automatic rollback
  async transaction(callback) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Batch operations for better performance
  async batchInsert(table, columns, values) {
    if (!values || values.length === 0) {
      return { rowCount: 0 };
    }

    const placeholders = values.map((_, i) =>
      `(${columns.map((_, j) => `$${i * columns.length + j + 1}`).join(', ')})`
    ).join(', ');

    const flatValues = values.flat();
    const query = `
      INSERT INTO ${table} (${columns.join(', ')})
      VALUES ${placeholders}
      ON CONFLICT DO NOTHING
      RETURNING *
    `;

    return this.query(query, flatValues);
  }

  // Check if error is retryable
  isRetryableError(error) {
    const retryableCodes = [
      'ECONNREFUSED',
      'ENOTFOUND',
      'ETIMEDOUT',
      'ECONNRESET',
      '57P03', // cannot_connect_now
      '53300', // too_many_connections
      '53400', // configuration_limit_exceeded
      '08006', // connection_failure
      '08001', // sqlclient_unable_to_establish_sqlconnection
      '08004'  // sqlserver_rejected_establishment_of_sqlconnection
    ];

    return retryableCodes.includes(error.code);
  }

  // Health check
  async healthCheck() {
    try {
      const result = await this.query('SELECT 1 as health', [], { retries: 1 });
      return {
        status: 'healthy',
        poolSize: this.pool.totalCount,
        idleConnections: this.pool.idleCount,
        waitingClients: this.pool.waitingCount
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message
      };
    }
  }

  // Get pool statistics
  getStatistics() {
    if (!this.pool) {
      return null;
    }

    return {
      total: this.pool.totalCount,
      idle: this.pool.idleCount,
      waiting: this.pool.waitingCount
    };
  }

  // Graceful shutdown
  async shutdown() {
    if (this.pool) {
      logger.info('Closing database pool...');
      await this.pool.end();
      this.connected = false;
      logger.info('Database pool closed');
    }
  }

  // Connection middleware for Express
  middleware() {
    return async (req, res, next) => {
      req.db = this;
      next();
    };
  }
}

// Create singleton instance
const db = new DatabasePool();

// Graceful shutdown handlers
process.on('SIGTERM', async () => {
  await db.shutdown();
});

process.on('SIGINT', async () => {
  await db.shutdown();
});

export default db;
export { DatabasePool };