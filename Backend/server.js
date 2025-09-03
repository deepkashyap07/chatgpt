import { config } from "dotenv";
config()
import app from "./src/app.js";
import connectDb from "./src/db/db.js";
import http from "http";
import initSocketServer from "./sockets/socket.server.js";



// console.log(process.env.GEMINI_API_KEY);


const httpServer=http.createServer(app)
initSocketServer(httpServer)
connectDb();

httpServer.listen(3000,()=>{
    console.log("server is running on port 3000");
    
});


