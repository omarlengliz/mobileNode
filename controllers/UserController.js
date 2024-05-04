const { sendEmail } = require("../config/mailer");
const Users = require("../models/Users");
const bcrypt= require("bcrypt");


const Login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await Users
            .findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        res.status(200).json({ status: "success" ,data : user } );
    }
    catch (error) {
        res.status(500).json({ message: "Failed to login" });
    }
}
const SignUp = async (req, res) => {
    const {firstname , lastname , username , email , phone , password , fcmToken} = req.body;

    try {

        if(!firstname || !lastname || !username || !email || !phone || !password) return res.status(400).json({ "status" : "failed"  , message: "All fields are required" });
        const existedUser = await Users.findOne({ email });
        if (existedUser) {
            return res.status(302).json({"status" : "failed"  , message: "Email already exists" });
        }

        
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new Users({
            firstname,
            lastname,
            username,
            email,
            phone,
            password : hashedPassword , 
            fcmToken
        });
        const result= await user.save();
        res.status(201).json({"status" : "success" , "data" : result});
    } catch (error) {
        res.status(500).json({ message: "Failed to create user" , mess : error.message });
    }
} 

const sendVerificationCode = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const verificationCode = Math.floor(1000 + Math.random() * 9000);
        user.verificationCode = verificationCode;
        await user.save();
        const subject = "Verification Code";
        const content = `Your verification code is ${verificationCode}`;
        await sendEmail(subject, email, false, content);
        const data = { email     };
        res.status(200).json({ status: "success", data: data});
    }
    catch (error) {
        res.status(500).json({ message: "Failed to send verification code"  , error: error.message});
    }
}
const verifyCode = async (req, res) => {
    const { email, verificationCode } = req.body;
    try {
        if(verificationCode.length !== 4) return res.status(400).json({ message: "Invalid verification code" } ) ;
        const user = await
            Users.findOne({ email, verificationCode });
        if (!user) {
            return res.status(404).json({ message: "Invalid verification code" });
        }
        user.status = "active";
        await user.save();
        res.status(200).json({ status: "success"});
    }
    catch (error) {
        res.status(500).json({ message: "Failed to verify account" });
    }
}



module.exports = {
    SignUp , 
    Login ,
    sendVerificationCode ,
    verifyCode

}
