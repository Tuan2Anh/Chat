import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";

import authRoutes from "./auth.routes.js";
import connectToMongoDB from "./connectToMongoDB.js";

dotenv.config();

const app = express();
const PORT = process.env.AUTH_PORT || 4000; // Separate port for auth server

app.use(express.json()); // Parse incoming JSON payloads
app.use(cookieParser());

app.use("/api/auth", authRoutes);


app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});


app.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Auth Server Running on port ${PORT}`);
});
