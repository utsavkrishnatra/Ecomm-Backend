const express= require('express');
const mongoose= require('mongoose');
const server=express();
const cors = require('cors')
const {router:usersRouter} = require('./routes/User');

const productRouter=require('./routes/Products')
const {router:authRouter}=require('./routes/Auth')

const {router:brandRouter}=require('./routes/Brands')
const {router:categoryRouter}=require('./routes/Category')
const {router:ordersRouter} = require('./routes/Order');
const {router:cartRouter} = require('./routes/Cart')
const  bodyParser = require('body-parser')

server.use(cors({
   origin:['http://localhost:3000', 'http://localhost:3001'],
   exposedHeaders:['X-Total-Count']
}))
//Database connection----------------------------------------------------------------
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce');
    console.log("database connection established");
  
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
  }

 main().catch(err => console.log(err));
 //----------------------------------------------------------------
 server.use(bodyParser.json());
 server.use('/products',productRouter)
 server.use('/auth',authRouter)
 server.use('/categories',categoryRouter); 
 server.use('/brands',brandRouter);
 server.use('/users', usersRouter)
 server.use('/orders', ordersRouter)
 server.use('/carts', cartRouter)
 
const port=8080
 server.listen(port, function(){
    console.log("Server is running on port: "+port);
 })