import express, { Express, Request, Response } from "express";
import cors from "cors";
import { Server } from "socket.io";

const app: Express = express();
const port: number = 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());

app.post("/api", (req: Request, res: Response) => {
  const req_name = req.body.name;
  res.send({ id: 1, name: req_name });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
