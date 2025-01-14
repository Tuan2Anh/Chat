import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./auth.routes.js";
import connectToMongoDB from "./connectToMongoDB.js";
import cors from "cors";
import { app, server } from "../socket/socket.js";

dotenv.config();
const PORT = process.env.AUTH_PORT || 4000; // Separate port for auth server

app.use(express.json()); // Parse incoming JSON payloads
app.use(cookieParser());

app.use("/api/auth", authRoutes);

server.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Main Server Running on port ${PORT}`);
});



app.use(
    cors({
        origin: "https://chat-5vv7.onrender.com",
        credentials: true,
    })
);