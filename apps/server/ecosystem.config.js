module.exports = {
  apps: [
    {
      name: 'zxm_toolkit_admin',
      script: 'dist/main.js',
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      autorestart: true,
      max_restarts: 10,
      max_memory_restart: '512M',
      node_args: '',
      env: {
        NODE_ENV: 'production',
      },
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      time: true,
    },
  ],
};
