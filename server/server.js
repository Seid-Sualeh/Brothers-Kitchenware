const http = require("http");
const { Server } = require("socket.io");
const { app, initDatabase } = require("./app");

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  },
});

app.locals.io = io;
io.on("connection", () => {});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(
      `Port ${PORT} is already in use. Stop the other process or set PORT to a free port.`,
    );
    process.exit(1);
  }
  throw err;
});

initDatabase().then(() => {
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
