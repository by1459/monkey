"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const { createServer } = require("node:http");
const socket_io_1 = require("socket.io");
const sockets_1 = __importDefault(require("./sockets"));
const app = (0, express_1.default)();
const port = 3000;
const httpServer = createServer(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(express_1.default.json());
(0, sockets_1.default)(io);
app.post("/api", (req, res) => {
    const req_name = req.body.name;
    res.send({ id: 1, name: req_name });
});
httpServer.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
