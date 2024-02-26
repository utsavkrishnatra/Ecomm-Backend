const {User} = require('../model/User');
const crypto = require('crypto');
const { sanitizeUser } = require('../services/common');
const SECRET_KEY = 'SECRET_KEY';
const jwt = require('jsonwebtoken');


exports.loginUser = async function(req, res, next) {

  try {

    
    const { email, password } = await req.body;
    console.log(JSON.stringify(req.body),email,password);
    const user = await User.findOne({ email: email });
    console.log("\nI am before user check!!\n")
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return; // Exit the function early if user doesn't exist
    }

  
      crypto.pbkdf2(
        password,
        user.salt,
        310000,
        32,
        'sha256',
        async function(err, hashedPassword) {
          if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
            res.status(401).json({ message: 'Invalid credentials' });
            return; // Exit the function early if passwords don't match
          }

          const token = jwt.sign(sanitizeUser(user), SECRET_KEY);
          res.cookie('jwt', token, { expires: new Date(Date.now() + 60 * 60 * 1000)});
          res.status(201).json(sanitizeUser(user));
        }
      );
    
  } catch (err) {
    res.status(400).json(err);
  }
};


exports.createUser = async (req, res) => {
    //const user = new User(req.body);
   // console.log(user);
    try {
    //   const doc = await user.save();
    //   res.status(201).json({id:doc.id,role:doc.role});
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      req.body.password,
      salt,
      310000,
      32,
      'sha256',
       async function (err, derivedKey) {
        const user = new User({ ...req.body, password: derivedKey, salt });
        const doc = await user.save();
        console.log("\nStep 1:I am here in createUser before login........................");
        // req.login(doc, (err) => {  // this also calls serializer and adds to session
        //   if (err) {
        //     console.log(err);
        //     res.status(400).json(err);
        //   } else {
        //     const token = jwt.sign(sanitizeUser(doc), SECRET_KEY);
        //     console.log("Step 1: createUser");
        //     res.status(201).json(token);
        //   }
        // });
        const token = jwt.sign(sanitizeUser(doc), SECRET_KEY);
        console.log("\nStep 2: sending the token..........");
        //Send the token dynamically to the server----------------------------------------------------------------
        res.cookie('jwt', token ,{ expires: new Date(Date.now() + 60*60*1000 ) })
        //Sending it statically to the server--------------------------------------------------------------------
        
        res.status(201).json(token);

      }
    );
    } catch (err) {
      res.status(400).json(err);
    }
  };

  exports.checkUser = async (req, res) => {
    //console.log("Deserialize will be called after this!!");
    console.log("\n------------------------entered check-user--------------------------\n");
    const user=await req.user;
    console.log("the user found is",user);
    res.json(sanitizeUser(user));
  }


  exports.logout = async (req, res) => {
    res
      .cookie('jwt', null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      })
      .sendStatus(200)
  };