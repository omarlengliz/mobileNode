
const express = require('express');
const { SignUp, sendVerificationCode, verifyCode } = require('../controllers/UserController');
const router = express.Router();

router.post("/register",SignUp); 
router.post("/send-verification-code",sendVerificationCode);
router.post("/verify-code",verifyCode);

module.exports = router;