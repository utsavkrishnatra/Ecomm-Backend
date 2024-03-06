const express= require('express');
const mongoose= require('mongoose');
const server=express();
const cors = require('cors')
const {router:usersRouter} = require('./routes/User');
require('dotenv').config({path:'./.env'});
const productRouter=require('./routes/Products')
const {router:authRouter}=require('./routes/Auth')
// const LocalStrategy = require('passport-local').Strategy;
const {router:brandRouter}=require('./routes/Brands')
const {router:categoryRouter}=require('./routes/Category')
const {router:ordersRouter} = require('./routes/Order');
const {router:cartRouter} = require('./routes/Cart')
const  bodyParser = require('body-parser')

const { isAuth, sanitizeUser,cookieExtractor } = require('./services/common');
const path = require('path');
//-------------------------jwt modules------------------------
const {User} = require('./model/User');
// const crypto = require('crypto');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const nodemailer=require('nodemailer');
const {Order}=require('./model/Order');
// const session = require('express-session');

//----------------------------socket.io connection on server------------------------

const socketio = require('socket.io');

const httpServer = require('http').createServer(server);
const io = socketio(httpServer,{
  cors: {
    origin: "http://localhost:3000"
  }
});

// Define an array to store connected sockets
// const connectedSockets = [];
// const connectedSocketEventsMap = new Map();
//-----------------------------------------------------------------------------------
//---------------------------------------socket test --------------------------------
// io.on('connection', (socket) => {
//   console.log(`New client connected: ${socket.id}`);
    
//   // Add the socket to the array of connected sockets
//   connectedSockets.push(socket);
//   connectedSocketEvents.

//   // Listen for messages from the client
//   socket.on('message', (data) => {
//     console.log('Message received:', data.msg);
//     // Send a message back to the client who sent the message
//     socket.emit('message', {msg:"hello client,from server"});
//   });


//    // Handle disconnection
//    socket.on('disconnect', () => {
//     console.log('Client disconnected');
    
//     // Remove the socket from the array when disconnected
//     const index = connectedSockets.indexOf(socket);
//     if (index !== -1) {
//       connectedSockets.splice(index, 1);
//     }
//   });
// });

//----------------------------------------------------------------------------------------------------

 //---------------------------------------Adding webhook---------------------------------------------------------------
 //web hook me already express.raw middleware enabled hota hai, toh usse explicitly enable krne ki azaroorat nhin hai
 const webhook_endpoint_secret=process.env.WEBHOOK_SIGNIN_SECRET_KEY;
 server.post('/webhook', express.raw({type: 'application/json'}), async (request, response) => {
  let event = request.body;
  // Only verify the event if you have an endpoint secret defined.
  // Otherwise use the basic event deserialized with JSON.parse
  if (webhook_endpoint_secret) {
    // Get the signature sent by Stripe
    const signature = request.headers['stripe-signature'];
    try {
      event = stripe.webhooks.constructEvent(
        request.body,
        signature,
        webhook_endpoint_secret
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return response.sendStatus(400);
    }
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
      // Then define and call a method to handle the successful payment intent.
      // handlePaymentIntentSucceeded(paymentIntent);
      try {
        // Update the paymentStatus of the order associated with the paymentIntent
        const orderId = paymentIntent.metadata.order_id;
        await Order.findByIdAndUpdate(orderId, { paymentStatus: 'received' });
        console.log(`PaymentStatus for order ${orderId} updated to payment <b>received</b>!`);
      } catch (err) {
        console.log(`Error updating payment status: ${err}`);
        return response.sendStatus(500);
      }
      break;
    case 'payment_method.attached':
      const paymentMethod = event.data.object;
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      // handlePaymentMethodAttached(paymentMethod);
      break;
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);
  }
 
 // Emitting the event to the connected clients
  // connectedSockets.forEach((socket) => {
  //   console.log("i am emitting event 'order_updated' for " + socket.id);
  //   connectedSocketEventsMap[socket.id]=socket;
  //   // socket.emit("order_updated");
  // });
  // io.emit("order_updated");
  // Return a 200 response to acknowledge receipt of the event
  // console.log("I am acknowledge receipt");
  response.send();
});
 
 //------------------------------------------------------------------------------------------------------------


//----------------------loading static front end module------------------------------------------
// const buildPath = path.join(__dirname,'..', '\\E-Comm\\build');
//C:\Users\utsav\OneDrive\Documents\GitHub\E-Comm\build
// console.log(buildPath);
// server.use(express.static(`${buildPath}`))

//------------------------------ cookie pasrser middleware-----------------------------------------------
const cookieParser = require('cookie-parser');
server.use(cookieParser());


//-------------------------session middleware------------------------------------------------------------

const SECRET_KEY = 'SECRET_KEY';
// server.use(
//   session({
//     secret: SECRET_KEY,
//     resave: false, // don't save session if unmodified
//     saveUninitialized: false, // don't create session until something stored
//   })
// );


server.use(passport.initialize());
// server.use(passport.session());
// server.use(passport.authenticate('session'));

// JWT options
const opts = {};
opts.jwtFromRequest = cookieExtractor
opts.secretOrKey = SECRET_KEY; 
//----- -----------------------------------------------------------------------------

server.use(cors({
   origin:'http://localhost:3000',
   exposedHeaders:['X-Total-Count']
}))


//Database connection----------------------------------------------------------------
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce');
    console.log("database connection established");
  
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
  }

 main().catch(err => console.log(err));

 //---test--------------------------------

//  function test(req,res)
//  {
   
//     // res.send("Welcome");
//     // res.send("  Utsav!!");
//     res.end("Bye...")
//    // res.send("Welcome again!!");
//  }
 //----------------------------------------------------------------
 server.use(bodyParser.json());
 server.use('/products',isAuth(),productRouter)
 server.use('/auth',authRouter)
 server.use('/categories',isAuth(),categoryRouter); 
 server.use('/brands',isAuth(),brandRouter);
 server.use('/users', isAuth(),usersRouter)
 server.use('/orders', isAuth(),ordersRouter)
 server.use('/carts', isAuth(),cartRouter);


 //-------------------------adding stripe payment gateway-----------------------------------------------



 const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY
 console.log("secret key is: ",STRIPE_SECRET_KEY);
 const stripe = require("stripe")(STRIPE_SECRET_KEY);
 
 const calculateOrderAmount = (totalAmount) => {
   // Replace this constant with a calculation of the order's amount
   // Calculate the order total on the server to prevent
   // people from directly manipulating the amount on the client
   return totalAmount*100;
 };
 
 server.post("/create-payment-intent", async (req, res) => {
   console.log("Request body: " + JSON.stringify(await req.body));
  //  const { totalAmount } = await req.body;
   const { totalAmount, orderId } = req.body;
 
   // Create a PaymentIntent with the order amount and currency
   const paymentIntent = await stripe.paymentIntents.create({
     amount: calculateOrderAmount(totalAmount),
     currency: "cad",
     metadata: { order_id: orderId },
     // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
     automatic_payment_methods: {
       enabled: true,
     },
   });
 
   res.send({
     clientSecret: paymentIntent.client_secret,
   });
 });
 
 

 //creating local strategy
//  passport.use(
//    'local',
//    new LocalStrategy(async function (username, password, done) {
//      // by default passport uses username
//      try {
//        const user = await User.findOne({ email: username });
//        console.log(username, password, user);
//        if (!user) {
//          return done(null, false, { message: 'invalid credentials' }); // for safety
//        }
//        crypto.pbkdf2(
//          password,
//          user.salt,
//          310000,
//          32,
//          'sha256',
//          async function (err, hashedPassword) {
//            if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
//              return done(null, false, { message: 'invalid credentials' });
//            }
//            const token = jwt.sign(sanitizeUser(user), SECRET_KEY);
//            done(null, token); // this lines sends to serializer
//          }
//        );
//      } catch (err) {
//        done(err);
//      }
//    })
//  ); 
//------------------------------------------------------------------------------------------------------------
 //creating vertification strategy
 passport.use(
   'jwt',
   new JwtStrategy(opts, async function (jwt_payload, done) {
     //console.log("entered verify strategy of jwt",jwt_payload);
     try {
      let user=null;
      if(jwt_payload && jwt_payload.id)
        { user = await User.findOne({"_id":jwt_payload.id} );
        if (user) {
         return done(null,sanitizeUser(user)); 
       } else {
         return done(null, false);
       }
     }else{
       return done(null, false);
     } }catch (err) {
       return done(err, false);
     }
   })
 );

//  passport.serializeUser(function (user, cb) {
//   console.log('-----------------serialization starts------------------------------' );
//   console.log("user before serialization  is: " + JSON.stringify(user));
//    process.nextTick(function () {
//      return cb(null, sanitizeUser(user));
//    });
//    console.log("------------------end of serialization---------------------------");
//  });
 
 // this changes session variable req.user when called from authorized request
 
//  passport.deserializeUser(async function (user, done) {
//   console.log('-----------------de-serialization starts------------------------------' );
//   try {
//     console.log("\nThe serialized version of user is: " + JSON.stringify(user));
//     // Assuming `user` is the user ID or some unique identifier
//     const payload = await User.findOne({"_id":user.id});
//     //console.log("PAYLOAD IS",payload);
//     console.log("\n\nThe unserialed version of user is: ",JSON.stringify(payload));
//     console.log('-----------------end of de-serialization ------------------------------' );
//     return done(null, user); // Pass the deserialized user to the callback
    
//   } catch (err) {
//     return done(err); // Pass the error to the callback
//   }

// });
//------adding proxy for exposing localhost:8080 to the public--------------------------------

const port=8080
httpServer.listen(port, function(){
    console.log("Server is running on port: "+port);
 })