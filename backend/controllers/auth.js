import User from "../models/user_model.js"
import bcrypt from "bcryptjs"
import genToken from "../utils/token.js"
import { sendOtpMail } from "../utils/mail.js"
export const signUp = async (req, res) => {
    try {
        const { fullName, email, password, mobile, role } = req.body
        let user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ message: "User Already exist." })
        }
        if (!fullName || !email || !password || !mobile || !role) {
            return res.status(400).json({ message: "All fields are required." })
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "password must be at least 6 characters." })
        }
        if (mobile.length < 10) {
            return res.status(400).json({ message: "mobile number must be atleast 10 digits." })
        }

        const hasedPassword = await bcrypt.hash(password, 10)
        user = await User.create({
            fullName,
            email,
            role,
            mobile,
            password: hasedPassword
        })
        const token = await genToken(user._id)
        res.cookie("token", token, {
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true
        })
        return res.status(201).json(user)
    }
    catch (error) {
        return res.status(500).json({ message: `sign up error ${error.message}` })
    }
}
export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "User does not exist." })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: "incorrect Password" })
        }
        const token = await genToken(user._id)
        res.cookie("token", token, {
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true
        })
        return res.status(200).json(user)
    }
    catch (error) {
        return res.status(500).json({ message: `sign in error ${error.message}` })
    }
}

export const signOut = async (params) => {
    try {
        res.clearCookie("token")
        return res.status(200).json({ message: "sign out sucessfully" })
    }
    catch (error) {
        return res.status(500).json(`sign out error ${error}`)
    }
}

export const sendOTP = async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "User does not exist." })
        }
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        user.resetOtp = otp;
        user.otpExpires = Date.now() + 5 * 60 * 1000
        user.isOtpVerified = false
        await user.save()
        await sendOtpMail(email, otp)
        return res.status(200).json({ message: "Otp sent sucessfully" })
    }
    catch (error) {
        return res.status(500).json(`send otp error ${error}`)
    }
}

export const verifyOTP = async(req,res)=>{
    try{
        const {email,otp} = req.body
        const user = await User.findOne({email})
        if(!user || user.resetOtp!=otp || user.otpExpires<Date.now())
        {
            return res.status(400).json({message:"invalid/expired OTP"})
        }
        user.isOtpVerified = true
        user.resetOtp = undefined
        user.otpExpires = undefined
        await user.save()
        return res.status(200).json({message:"Otp verified Sucessfully"})
    }
    catch(error)
    {
         return res.status(500).json(`verify otp error ${error}`)
    }
}

export const resetPassword = async (req,res)=>{
    try{
        const {email,newPassword}=req.body
        const user = await User.findOne({ email })
        if (!user || !user.isOtpVerified) {
            return res.status(400).json({ message: "Otp verification required" })
        }
        const hasedPassword =await bcrypt.hash(newPassword,10)
        user.password = hasedPassword
        user.isOtpVerified = false
        await user.save()
        return res.status(200).json({message:"password reset sucessfully"})

    }
    catch(error){
        return res.status(500).json(`reset password error ${error}`)
    }
}

export const googleAuth = async(req,res)=>{
    try{
        const {fullName,email,mobile,role} = req.body
        let user = await User.findOne({ email })
        if(!user)
        {
            user = await User.create({
                fullName,email,mobile,role
            })
        }
         const token = await genToken(user._id)
        res.cookie("token", token, {
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true
        })

        return res.status(200).json(user)

    }
    catch(error){
         return res.status(500).json(`Google auth error ${error}`)
    }
}