const {User} = require('../model/User');

exports.login = async function(req, res, next) {
    const { email, password } = req.body;
    console.log("In auth/login with user email: " + email);
    try {
        const user = await User.findOne({ "email": email });
        console.log("User found: " + JSON.stringify(user));
        if (user) {
            // Compare hashed passwords here
            if (user.password === password) {
                res.status(200).json({ id: user.id, role: user.role });
            } else {
                res.status(400).json({ message: "Password is incorrect" });
            }
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

exports.createUser = async (req, res) => {
    const user = new User(req.body);
    console.log(user);
    try {
      const doc = await user.save();
      res.status(201).json({id:doc.id,role:doc.role});
    } catch (err) {
      res.status(400).json(err);
    }
  };