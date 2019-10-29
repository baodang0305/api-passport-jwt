const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt
const {userModel, checkUser} = require('../models/userModel');

passport.use(new LocalStrategy({
    userNameField: 'username',
    passwordField: 'password'
    },
    function(username, password, cb){
      return checkUser(username, password)
             .then(result => {
                 if (!result) {
                     return cb(null, false, {message: 'Incorrect email or password.'});
                 }
                 return cb(null, username, {message: 'Login is successed'});
            })
            .catch(err => cb(err));
      }
))

passport.use(new JWTStrategy({
    jwtFromRequest : ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'bao_dang'
    },
    function(jwtPayload, cb){
        console.log(jwtPayload.username)
        return userModel.findOne(jwtPayload.username)
            .then(user => {
                return cb(null, user);
            })
            .catch(err => {
                return cb(err);
            })
    }
))

module.exports = passport;