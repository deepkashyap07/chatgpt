import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import authRouter from "../routes/auth.routes.js";
import chatRouter from "../routes/chat.routes.js";

const app = express();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authRouter)
app.use("/api/chat",chatRouter)



export default app;