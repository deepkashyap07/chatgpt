import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

async function userAuth(req,res,next){
    try {
        const {token} = req.cookies;
        if(!token){
            return res.status(400).json({
                message:"unauthorized user",
            })
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET)

        const user = await userModel.findById(decoded.id);

        if(!user){
             return res.status(400).json({
                message:"unauthorized user",
            }) 
        }

        req.user = user;

        next()

        
    } catch (error) {
        res.status(400).json({
                message:error.message,
    })
}
} 

export default userAuth;