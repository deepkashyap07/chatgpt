import express from "express";
import userAuth from "../middlewares/auth.imddleware.js";
import { createChat } from "../controllers/chat.controllers.js";

const router = express.Router();

router.post("/",userAuth,createChat)

export default router;