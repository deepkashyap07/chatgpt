import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import authRouter from "../routes/auth.routes.js";
import chatRouter from "../routes/chat.routes.js";
import path from "path";
import { fileURLToPath } from "url";

// ✅ Recreate __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
    origin: ["http://localhost:5173","https://chatgpt-tu26.onrender.com"],
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// ✅ Serve static files
app.use(express.static(path.join(__dirname, "../public")));

// ✅ API routes
app.use("/api/auth", authRouter);
app.use("/api/chat", chatRouter);

// ✅ Catch-all route for SPA (React/Vite build)
app.get("*name", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

export default app;
