const express = require('express');
const { loginUser,createUser,checkUser } = require('../controller/Auth');

const router = express.Router();
const passport = require('passport');
//  /brands is already added in base path
router.post('/signup', createUser)
router.post('/login', loginUser)
router.get('/check',passport.authenticate('jwt',{session:false}), checkUser);

exports.router = router;