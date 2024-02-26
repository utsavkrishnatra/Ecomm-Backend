// const path = require('path');

// const {log}=require('console')
// const buildPath = path.join(__dirname,'..\\..', '\\E-Comm\\build');
// log("path is: ",buildPath)

//C:\Users\utsav\OneDrive\Documents\GitHub\E-Comm\build
require('dotenv').config({path:'./.env'});
const secrets = process.env.STRIPE_SECRET_KEY
console.log(secrets);