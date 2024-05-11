
const express = require('express');
const { SignUp, sendVerificationCode, verifyCode, Login, getProfile, deleteProfile } = require('../controllers/UserController');
const router = express.Router();

router.post("/register",SignUp); 
router.post("/login",Login);
router.post("/send-verification-code",sendVerificationCode);
router.post("/verify-code",verifyCode);
router.get("/profile/:id" ,getProfile ) ; 
router.delete("/profile/:id" ,deleteProfile ) ;

module.exports = router;