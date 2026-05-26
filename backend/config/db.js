import mongoose from "mongoose"
const connectDB = async () =>{
    try{
        await mongoose.connect(process.env.MONDODB_URI)
        console.log("DB connected")
    }
    catch(error){
        console.log("DB error");
    }
}
 
export default connectDB;