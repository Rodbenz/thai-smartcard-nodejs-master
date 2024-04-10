const path = require("path");
const { publicDir } = require("./helper/path");
const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const smc = require("./smc");
const { initializeSMC } = require("../public");
const cors = require("cors");

require("dotenv").config();

const PORT = process.env.SMC_AGENT_PORT || 9898;

app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    `${process.env.CORS_ALLOW_ORIGIN}`
  );
  console.log(process.env.CORS_ALLOW_ORIGIN, "process.env.CORS_ALLOW_ORIGIN");
  // Other CORS-related headers can be set here if needed
  next();
});

app.use(
  cors({
    origin: `${process.env.CORS_ALLOW_ORIGIN}`,
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
  })
);

if (app.env === "production") {
  io.origins([`localhost:${PORT}`]);
}

if (app.env !== "production") {
  app.get("/readSmart", (req, res) => {
    res.sendFile(path.join(publicDir, "example.html"));
  });

  app.get("/readSmartCard", initializeSMC);
}

io.on("connection", (socket) => {
  console.log(`New connection from ${socket.id}`);

  socket.on("set-query", (data = {}) => {
    const { query = undefined } = data;
    console.log(`set-query: ${query}`);
    smc.setQuery(query);
  });

  socket.on("set-all-query", (data = {}) => {
    const { query = undefined } = data;
    console.log(`set-query: ${query}`);
    smc.setQuery(query);
  });

  socket.on("disconnect", () => {
    console.log("client disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`listening smartcard start on *:${PORT}`);
  // connect to smart card reader after server started.
  // delay because if restart by pm2, need to wait connection from client to set query
  setTimeout(() => {
    smc.init(io);
  }, 1500);
});
