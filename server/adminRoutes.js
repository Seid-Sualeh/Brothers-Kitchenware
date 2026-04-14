const createAdminRouter = require("./src/routes/admin.routes");

module.exports = function registerAdminRoutes(app, getCtx) {
  app.use("/api", createAdminRouter(getCtx));
};
