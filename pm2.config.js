module.exports = {
    apps: [
      {
        name: "if-bot-website",                 // Application name
        script: "npm",                     // Use npm to run the start script
        args: "run start",                 // Arguments to pass (npm run start)
        env: {
          PORT: 2048,                      // Environment variable (your port)
          NODE_ENV: "production",          // You can change this to "development" if needed
        },
        instances: 2,                      // Number of instances (2 in this case)
        exec_mode: "cluster",              // Cluster mode to scale across CPUs
        watch: true,                      // Enable file watching
        max_memory_restart: "1500M",        // Restart if it exceeds 500MB memory usage
      },
    ],
  };