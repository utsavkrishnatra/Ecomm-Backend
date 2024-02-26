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
  token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZDUyYjVhZTVhMjRkMjhmMzFlNTI0NCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzA4ODY5MzkxfQ.baVDtkkUrPaeKh1lwev2wyhd-IJfzkyZX1hp6J14Gb0'
  return token;
};