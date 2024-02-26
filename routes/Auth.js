const express = require('express');
const { loginUser,createUser,checkUser,logout } = require('../controller/Auth');

const router = express.Router();
const passport = require('passport');
//  /brands is already added in base path
router.post('/signup', createUser)
router.post('/login', loginUser)
router.get('/logout', logout)
router.get('/check',passport.authenticate('jwt',{session:false}), checkUser);

exports.router = router;