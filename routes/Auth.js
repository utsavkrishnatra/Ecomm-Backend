const express = require('express');
const { login,createUser } = require('../controller/Auth');

const router = express.Router();
//  /brands is already added in base path
router.post('/login', login).post('/signup', createUser)

exports.router = router;