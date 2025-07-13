import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createUser } from "../services/userService.js";
import prisma from "../prisma/index.js";
import transporter from "../config/nodemailer.js";
import { sendOtp } from "../utils/sendOtp.js";
import { generateOtp } from "../utils/createOtp.js";
import { redis } from "../config/redis.js";

export const register = async (req, res) => {

    const { email, password, batch, branch } = req.body;

    if (!email || !password || !branch || !batch) {
        return res.status(400).json({
            success : false,
            message : "Missing credentials."
        });
    }

    if(!email.endsWith("@iiitd.ac.in")){
        return res.status(403).json({
            success : false,
            message : "Only IIIT-Delhi email addresses are allowed to register."
        });
    }

    try {

        const userExists = await prisma.user.findFirst({
            where : {
                email : email
            }
        });

        if(userExists){
            return res.status(409).json({
                success : false,
                message : "User already exists, please login."
            });
        }

        const tempUserExists = await redis.get(`tempUser:${email}`);

        if(tempUserExists){
            return res.status(200).json({
                success : true,
                message : "Check your email for the verification OTP."
            });
        }

        const otp = generateOtp();

        // Hashing the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        const hashedOtp = await bcrypt.hash(otp, 10);
        const username = email.split("@")[0].toLowerCase();

        const tempUserData = {
            email,
            password : hashedPassword,
            branch,
            batch,
            verifyOtp : hashedOtp,
            username
        };
        
        const OTP_EXPIRY = process.env.VERIFY_OTP_EXPIRY || 900;

        // Saving to redis with TTL of 15 minutes.
        await redis.setex(`tempUser:${email}`, OTP_EXPIRY, JSON.stringify(tempUserData));
        
        // Sending the user the otp after they signup.
        await sendOtp(email, otp);

        const token = jwt.sign(
            { email : email },
            process.env.JWT_TEMP_SECRET,
            { expiresIn : '15m'}
        );
        
        res.cookie('token', token, {
            httpOnly: true,
            secure : process.env.NODE_ENV === 'production',
            sameSite : process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge : 15 * 60 * 1000 // 15 mins
        });

        return res.status(200).json({
            success : true,
            message : "Success, please proceed to verification !"
        });
            
    } catch(error) {
        return res.status(500).json({
            success : false,
            message : "Internal server error."
        });
    }

};

export const login = async (req, res) => {
    
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success : false,
            message : "Email and Password are required."
        });
    }

    try {
        const user = await prisma.user.findFirst({
            where : {
                email : email
            }
        });

        if (!user) {
            return res.status(401).json({
                success : false,
                message : "Invalid Email."
            });
        }
        
        const correctPassword = await bcrypt.compare(password, user.password);
        
        if (!correctPassword) {
            return res.json({
                success : false,
                message : "Invalid Password."
            });
        }

        const token = jwt.sign(
            { id : user.id, role : user.role },
            process.env.JWT_SECRET,
            { expiresIn : '7d'}
        );
        
        res.cookie('token', token, {
            httpOnly: true,
            secure : process.env.NODE_ENV === 'production',
            sameSite : process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge : 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            success : true,
            message : "Logged in succesfully !"
        });

    } catch(error) {
        return res.status(500).json({
            success : false,
            message : "Internal server error"
        });
    }

};

export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure : process.env.NODE_ENV === 'production',
            sameSite : process.env.NODE_ENV === 'production' ? 'none' : 'strict'
        });

        return res.status(200).json({
            success : true,
            message : "Logged Out Successfully !"
        });

    }
    catch(error) {
        return res.status(500).json({
            success : false,
            message : "Internal server error."
        });
    }
};

export const verifyAccount = async (req, res) => {
    
    const { email, otp } = req.body;
    
    if ( !email || !otp ) {
        return res.status(400).json({
            success : false,
            message : "Missing credentials."
        });
    }
    
    try {
        
        const userExists = await prisma.user.findFirst({
            where : {
                email : email
            }
        });
        
        if(userExists) {
            return res.status(409).json({
                success : false,
                message : "Already verified !"
            });
        }

        const tempUser = await redis.get(`tempUser:${email}`);

        if (!tempUser) {
            return res.status(404).json({
                success : false,
                message : "User not found, please register."
            });
        }

        const userData = JSON.parse(tempUser);

        const isOtpEqual = await bcrypt.compare(otp, userData.verifyOtp);
        
        if(!isOtpEqual){
            return res.status(401).json({
                success : false,
                message : "Invalid OTP."
            });
        }

        const newUser = await createUser({
            email : userData.email,
            username : userData.username,
            password : userData.password,
            batch : parseInt(userData.batch),
            branch : userData.branch,
            role : "STUDENT"
        });

        if(newUser){
            // Clearing temporary user from redis
            await redis.del(`tempUser:${email}`);
            await redis.del(`rateLimit:${email}`);

            const token = jwt.sign(
                { id : newUser.id, role : newUser.role },
                process.env.JWT_SECRET,
                { expiresIn : '7d'}
            );
            
            res.cookie('token', token, {
                httpOnly: true,
                secure : process.env.NODE_ENV === 'production',
                sameSite : process.env.NODE_ENV === 'production' ? 'none' : 'strict',
                maxAge : 7 * 24 * 60 * 60 * 1000
            });
    
            return res.status(200).json({
                success : true,
                message : "Verified, Logged In Successfully !"
            });
        }

    } catch(error) {
        return res.status(500).json({
            success : false,
            message : "Internal server error."
        });
    }

};

// To send password change OTP to User's email
export const sendResetOtp = async (req, res) => {
    
    const { email } = req.body;

    try {

        const foundUser = await prisma.user.findFirst({
            where : {
                email
            }
        });

        if (!foundUser) {
            return res.status(404).json({
                success : false,
                message : "Incorrect credentials !"
            });
        }
        
        const otp = String(Math.floor(100000 + Math.random() * 900000));

        await prisma.user.update({
            where : {
                email : foundUser.email
            }, data : {
                resetOtp : otp,
                resetOtpExpiresAt : new Date(Date.now() + 15 * 60  * 1000) // Expires in 15mins
            }
        });

        const mailOptions = {
            from : process.env.SENDER_EMAIL,
            to : foundUser.email,
            subject : "Password Reset OTP",
            text : `Your otp is : ${otp}. You can reset your password using this otp.`
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({
            success : true,
            message : "Password reset OTP sent to Email."
        });

    } catch(error) {
        return res.status(500).json({
            success : false,
            message : "Internal server error."
        });
    }


};

export const resetPassword = async (req, res) => {

    const { userId, otp, newPassword } = req.body;

    if (!userId || !otp || !newPassword) {
       return res.status(400).json({
        success : false,
        message : "Missing credentials."
       }); 
    }

    try {

        const foundUser = await prisma.user.findFirst({
            where : {
                id : userId
            }
        });

        if(!foundUser) {
            return res.status(404).json({
                success : false,
                message : "User not found."
            });
        }
    
        if(foundUser.resetOtp === "" || foundUser.resetOtp !== otp){
            return res.status(401).json({
                success : false,
                message : "Invalid OTP."
            });
        }

        if(foundUser.resetOtpExpiresAt < Date.now()){
            return res.status(401).json({
                success : false,
                message : "OTP has expired."
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Verifying user
        await prisma.user.update({
            where : {
                id : userId
            }, data : {
                password : hashedPassword,
                resetOtp : "",
                resetOtpExpiresAt : null
            }
        });

        return res.status(200).json({
            success : true,
            message : "Password changed successfully !"
        });

    } catch (error) {
        return res.status(500).json({
            success : false,
            message : "Internal server error."
        });
    }

};