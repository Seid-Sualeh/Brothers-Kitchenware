function requireDatabase(getCtx) {
  return (req, res, next) => {
    const { pool, dbReady } = getCtx();
    if (!dbReady || !pool) {
      return res.status(503).json({
        error:
          "Database is required for this feature. Configure MySQL and run migrations.",
      });
    }
    req.db = pool;
    next();
  };
}

module.exports = { requireDatabase };
