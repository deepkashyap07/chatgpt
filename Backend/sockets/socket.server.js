import { Server } from "socket.io";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import { generateResponse, generateVectors } from "../services/ai.services.js";
import messageModel from "../models/message.model.js";
import { createMemory, queryMemory } from "../services/vector.services.js";

function initSocketServer(httpServer) {
  const io = new Server(httpServer, {});

  io.use(async (socket, next) => {
    try {
      const cookies = cookie.parse(socket.handshake.headers?.cookie || "");
      // console.log(cookies);

      if (!cookies.token) {
        return next(new Error("authentication error no token was provided"));
      }

      // console.log(cookies);

      const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET);

      if (!decoded) {
        return next(new Error("authentication error no token was provided"));
      }

      const user = await userModel.findById(decoded.id);

      socket.user = user;

      next();
    } catch (error) {
      console.log(error);
    }
  });

  io.on("connection", (socket) => {
    console.log(socket.id);

    socket.on("ai-message", async (messagePayload) => {
      console.log(messagePayload.content);

      const message = await messageModel.create({
        chat: messagePayload.chat,
        user: socket.user._id,
        content: messagePayload.content,
        role: "user",
      });

      const vectors = await generateVectors(messagePayload.content);

      const memory = await queryMemory({
        queryVector: vectors,
        limit: 3,
        metadata: {
            user:socket.user._id
        },
      });

      await createMemory({
        vectors,
        messageId: message._id,
        metadata: {
          chat: messagePayload.chat,
          user: socket.user._id,
          text: messagePayload.content,
        },
      });

      console.log(memory);

      console.log(vectors);

      const chatHistory = (
        await messageModel
          .find({ chat: messagePayload.chat })
          .sort({ createdAt: -1 })
          .limit(4)
          .lean()
      ).reverse();
      console.log(chatHistory);
      const stm = chatHistory.map((item) => {
        return {
          role: item.role,
          parts: [{ text: item.content }],
        };
      });
      const ltm = [{
        role:"user",
        parts:[{text:`
            these are some previous chat history , you can use them for references

            ${memory.map(item=>(item.metadata.text)).join("\n")}

            `}]
      }]
      const response = await generateResponse([...ltm,...stm]);

      const responsemessage = await messageModel.create({
        chat: messagePayload.chat,
        user: socket.user._id,
        content: response,
        role: "model",
      });

      const responseVectors = await generateVectors(response);

      await createMemory({
        vectors: responseVectors,
        messageId: responsemessage._id,
        metadata: {
          chat: messagePayload.chat,
          user: socket.user._id,
          text: response,
        },
      });

      socket.emit("ai-response", {
        content: response,
        chat: messagePayload.chat,
      });
    });
  });
}

export default initSocketServer;
