import express, { Express, Request, Response } from "express";
import cors from "cors";
const { createServer } = require("node:http");
import { Server } from "socket.io";
import registerSocketHandlers from "./sockets";

const app: Express = express();
const port: number = 3000;
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());

registerSocketHandlers(io);

app.post("/api", (req: Request, res: Response) => {
  const req_name = req.body.name;
  res.send({ id: 1, name: req_name });
});

httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
