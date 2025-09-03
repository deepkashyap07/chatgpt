import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import authRouter from "../routes/auth.routes.js";
import chatRouter from "../routes/chat.routes.js";
import path from "path";

const app = express();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "../public")));

app.use("/api/auth",authRouter)
app.use("/api/chat",chatRouter)

app.get("*name",(req,res)=>{
    res.sendFile(path.join(__dirname,"../public/index.html"))
})

export default app;