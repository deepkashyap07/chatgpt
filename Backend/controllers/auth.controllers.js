import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

async function registerUser(req,res){
    try {
        const {fullName:{firstName,lastName},email,password} = req.body;
        const userExists = await userModel.findOne({email});
        if(userExists){
           return res.status(400).json({
                message:"user alaready exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password,10)

        const user = await userModel.create({
            fullName:{
                firstName,
                lastName
            },
            email,
            password:hashedPassword
        })

        const token =  jwt.sign({id:user._id},process.env.JWT_SECRET);
        res.cookie("token",token)
        res.status(200).json({
            message:"user registered succesfully",
            user:{
               email:user.email,
               _id : user._id,
               fullName:user.fullName
            }
        })





    } catch (error) {
        res.status(500).json({
            message:error.message,
        })
    }
}
async function loginUser(req,res){
    try {
        const {email,password} = req.body;
        const user = await userModel.findOne({email});
        if(!user){
           return res.status(400).json({
                message:"credentials do not matched"
            })
        }

        const ispasswordCorrect = await bcrypt.compare(password,user.password)
         if(!ispasswordCorrect){
           return res.status(400).json({
                message:"credentials do not matched"
            })
        }
       

        const token =  jwt.sign({id:user._id},process.env.JWT_SECRET);
        res.cookie("token",token)
        res.status(200).json({
            message:"user loggedin succesfully",
            user:{
               email:user.email,
               _id : user._id,
               fullName:user.fullName
            }
        })





    } catch (error) {
        res.status(500).json({
            message:error.message,
        })
    }
}
export {registerUser,loginUser};