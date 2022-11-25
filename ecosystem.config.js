module.exports = {
  apps: [
    {
      name: 'app',
      script: 'dist/apps/api/main.js',
      instances: 2,
      exec_mode: 'cluster',
      wait_ready: true,
      env: {
        NODE_ENV: 'prod',
      },
    },
  ],
};
