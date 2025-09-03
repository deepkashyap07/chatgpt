import mongoose from "mongoose";

async function connectDb() {
     try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("connect to db");
     } catch (error) {
        console.log(error);
        
     }

}

export default connectDb;
