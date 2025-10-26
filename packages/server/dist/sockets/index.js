"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lobbyHandler_1 = __importDefault(require("./lobbyHandler"));
function registerSocketHandlers(io) {
    io.on("connect", (socket) => {
        console.log(`socket ${socket.id} just connected`);
        (0, lobbyHandler_1.default)(io, socket);
        socket.on("diconnect", (socket) => {
            console.log(`socket ${socket.id} just disconnected`);
        });
    });
}
exports.default = registerSocketHandlers;
