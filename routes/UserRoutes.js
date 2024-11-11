
const express = require('express');
const { SignUp, sendVerificationCode, verifyCode, Login, getProfile, deleteProfile, LoginAuthor, blockUser, getUsers } = require('../controllers/UserController');
const router = express.Router();

router.post("/register",SignUp); 
router.post("/login",Login);
router.post("/login/author",LoginAuthor);
router.post("/send-verification-code",sendVerificationCode);
router.post("/verify-code",verifyCode);
router.get("/profile/:id" ,getProfile ) ; 
router.delete("/profile/:id" ,deleteProfile ) ;
router.put("/block/:id" ,blockUser ) ;
router.get("/getAll" ,getUsers ) ;

module.exports = router;