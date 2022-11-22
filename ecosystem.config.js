module.exports = {
  apps: [
    {
      name: 'app',
      script: 'dist/apps/api/main.js',
      env: {
        NODE_ENV: 'prod',
      },
    },
  ],
};
