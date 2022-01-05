import * as http from "http";
import * as path from "path";

import * as tmi from "tmi.js";
import * as SocketIO from "socket.io";
import * as express from "express";

import {CHANNEL} from "./constants";

const app = express();
const server = new http.Server(app);
const io = new SocketIO.Server({
  cors: {
    origin: "*",
  },
});
const client = new tmi.Client({
  channels: [CHANNEL],
});
let endTime = +new Date() + 60 * 60 * 24 * 1000;
let bitsTime = 5 * 1000;
let subscriptionTime = 60 * 5 * 1000;

io.attach(server);

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);

io.on("connection", (socket) => {
  socket.on("update", (diff: number) => {
    endTime += diff;

    io.emit("endtime", endTime);
  });

  io.emit("endtime", endTime);
});

client.on("cheer", (_channel, userstate) => {
  const bits = userstate.bits ? parseInt(userstate.bits) : 0;

  endTime += bitsTime * bits;

  io.emit("endtime", endTime);
});

client.on("subscription", () => {
  endTime += subscriptionTime;

  io.emit("endtime", endTime);
});

client.on("resub", () => {
  endTime += subscriptionTime;

  io.emit("endtime", endTime);
});

app.get("/admin", (_req, res) => {
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.resolve(__dirname + "/../../admin/dist")));

    res.sendFile("index.html", {root: path.resolve(__dirname + "/../../admin/dist")});
  } else {
    res.redirect("http://localhost:8002");
  }
});

app.get("/client", (_req, res) => {
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.resolve(__dirname + "/../../client/dist")));

    res.sendFile(path.resolve(__dirname + "/../../client/dist/index.html"));
  } else {
    res.redirect("http://localhost:8001");
  }
});

server.listen(8000, () => {
  console.log(`Listening on port 8000`);

  client.connect();
});
