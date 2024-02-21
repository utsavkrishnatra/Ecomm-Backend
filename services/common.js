const passport = require('passport');

exports.isAuth = (req, res) => {
  return passport.authenticate('jwt',{session:false})
};

exports.sanitizeUser = (user)=>{
    return {id:user.id, role:user.role}
}

exports.cookieExtractor = function(req) {
  var token = null;
  if (req && req.cookies) {
      token = req.cookies['jwt'];
  }
  return token;
};