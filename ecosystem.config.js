module.exports = {
  apps: [
    {
      name: 'dogan-consult-api',
      script: './backend/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 4000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 4000
      },
      error_file: '/var/log/dogan-consult/pm2-error.log',
      out_file: '/var/log/dogan-consult/pm2-out.log',
      log_file: '/var/log/dogan-consult/pm2-combined.log',
      time: true,
      max_memory_restart: '2G',
      min_uptime: '10s',
      max_restarts: 10,
      autorestart: true,
      cron_restart: '0 2 * * *',
      watch: false,
      ignore_watch: ['node_modules', 'logs', 'uploads', '.git'],
      merge_logs: true,
      vizion: false,
      kill_timeout: 5000,
      listen_timeout: 10000,
      wait_ready: true,
      node_args: '--max-old-space-size=4096',
      interpreter_args: '--harmony',
      post_update: ['npm install'],
      force: false
    }
  ],

  deploy: {
    production: {
      user: 'dogan',
      host: 'doganconsult.com',
      ref: 'origin/main',
      repo: 'git@github.com:doganconsult/platform.git',
      path: '/var/www/dogan-consult',
      'post-deploy': 'npm install && npm run build:prod && pm2 reload ecosystem.config.js --env production',
      'pre-deploy-local': 'npm run test',
      env: {
        NODE_ENV: 'production'
      }
    }
  }
};