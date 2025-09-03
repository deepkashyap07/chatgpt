import chatModel from "../models/chat.model.js";

async function createChat(req,res){
    try {
        const {title} = req.body;
        if(!title){
            return res.status(400).json({
                message:"title is required"
            })
        }
        const user = req.user;
        const chat = await chatModel.create({
            user:user._id,
            title
        })

        res.status(201).json({
            message:"chat created succesfully",
            chat:{
                _id : chat._id,
                title:chat.title,
                lastActive:chat.lastActivity
            }
        })
    } catch (error) {
        
    }
}
async function getChats(req,res){
    try {
        const user = req.user;
        const chats = await chatModel.find({user:user._id});
        res.status(200).json({
            message:"chats fetched successfully",       
            chats:chats.map(chat => ({
                _id:chat._id,
                title:chat.title,
                lastActive:chat.lastActivity,
                user:chat.user
            }))
        })
    } catch (error) {
        res.status(500).json({
            message:"internal server error"
        })
    }   }


    async function getMessages(req, res) {

    const chatId = req.params.id;

    const messages = await messageModel.find({ chat: chatId }).sort({ createdAt: 1 });

    res.status(200).json({
        message: "Messages retrieved successfully",
        messages: messages
    })

}
export { createChat,getChats,getMessages}