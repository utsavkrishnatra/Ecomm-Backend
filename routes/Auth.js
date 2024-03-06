const express = require('express');
const { loginUser,createUser,checkUser,logout,resetPasswordRequest, resetPassword} = require('../controller/Auth');
const {sendMail} = require('../services/common.js');
const router = express.Router();
const passport = require('passport');
//  /brands is already added in base path
router.post('/signup', createUser)
router.post('/login', loginUser)
router.get('/logout', logout)
router.get('/check',passport.authenticate('jwt',{session:false}), checkUser);
router.post('/reset-password-request', resetPasswordRequest)
router.post('/reset-password', resetPassword)
// router.get('/send-mail',()=>sendMail({to:"sameerkaushal132@gmail.com","subject":"Hello World!","text":"","html":"<p>Hello sameer!!</p>"}));

exports.router = router;