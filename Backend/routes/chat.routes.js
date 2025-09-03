import express from "express";
import userAuth from "../middlewares/auth.imddleware.js";
import { createChat, getChats, getMessages } from "../controllers/chat.controllers.js";


const router = express.Router();

router.post("/",userAuth,createChat)
router.post("/",userAuth,getChats)

router.get("/messages/:id",userAuth,getMessages)

export default router;