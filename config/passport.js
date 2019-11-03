const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const FacebookStrategy = require('passport-facebook').Strategy;
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt
const {userModel, checkUser, checkUsername} = require('../models/userModel');

passport.use(new LocalStrategy({
    userNameField: 'username',
    passwordField: 'password'
    },
    function(username, password, cb){
      return checkUser(username, password)
        .then(result => {
            if (!result) {
                return cb(null, false, {message: 'username hoặc password không đúng!'});
            }
            return cb(null, username, {message: 'Đăng nhập thành công!'});
        })
        .catch(err => cb(err));
      }
))

passport.use(new FacebookStrategy({
    clientID: '696276870872659',
    clientSecret: 'dfc97a6c909688e1dbe41c2c2d7fe14c',
    callbackURL: 'https://api-passport-jwt.herokuapp.com/user/auth/facebook/callback',
    profileFields: ['email', 'gender', 'locale', 'name', 'displayName']
    },
    function(accessToken, refreshToken, profile, done){
        const userInfor = profile._json;
        return checkUserByEmail(userInfor.email)
        .then(result => {
            if(!result){
                const user = {
                    'username': userInfor.name,
                    'email': userInfor.email
                }
                userModel.create(user, function(err, res){
                    if(err){
                        return console.log(err);
                    }
                    else{
                        console.log("insert thành công!");
                    }
                });
            }
            return done(null, userInfor, {message: 'Đăng nhập thành công'});
        })
        .catch(err=> done(err));
    }

))

passport.use(new JWTStrategy({
    jwtFromRequest : ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'bao_dang'
    },
    function(jwtPayload, cb){
        console.log(jwtPayload)
        return userModel.findOne({'username': jwtPayload})
        .then(user => {
            console.log(user);
            return cb(null, user);
        })
        .catch(err => {
            return cb(err);
        })
    }
))

module.exports = passport;