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

export { createChat}