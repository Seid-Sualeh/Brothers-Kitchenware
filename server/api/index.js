const { app, initDatabase } = require("../app");

// Initialize database once on cold start.
initDatabase().catch((err) => {
  console.error(
    "Failed to initialize database in Vercel function:",
    err.message,
  );
});

module.exports = app;
