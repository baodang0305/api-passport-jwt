const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const FacebookTokenStrategy = require('passport-facebook-token');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt
const {checkUserByAll} = require('../models/userLCModel');
const {userFBModel, checkUserByFacebookID} = require('../models/userFBModel')

passport.use(new LocalStrategy({
    userNameField: 'username',
    passwordField: 'password'
    },
    function(username, password, cb){
      return checkUserByAll(username, password)
        .then(result => {
            if (!result) {
                return cb(null, false, {message: 'username hoặc password không đúng!'});
            }
            return cb(null, username, {message: 'Đăng nhập thành công!'});
        })
        .catch(err => cb(err));
      }
))

passport.use('facebookToken', new FacebookTokenStrategy({
    clientID: '533770450771228',
    clientSecret: '379a40c7797d3c959cb3eb8c84145b22',
    // callbackURL: 'http://localhost:3001/user/oauth/facebook/callback',
    passReqToCallback: true,
    profileFields: ['id', 'displayName', 'name', 'photos', 'emails']
    },
    async(req, accessToken, refreshToken, profile, done) => {
        try{
            console.log(profile);
            const newUser = {
                'fullName': profile.displayName,
                'email': profile.emails[0].value,
                'facebook_id': profile.id
            }
            return checkUserByFacebookID(profile.id)
            .then(result => {
                if(!result){
                    userFBModel.create(newUser)
                    .then(err=> {
                        if(err){
                            return console.log(err);
                        }
                        else{
                            console.log("insert thành công!");
                        }
                    });
                }
                return done(null, newUser, {message: 'Đăng nhập thành công'});
            })
            .catch(err=> done(err));
        }
        catch(error){
            done(error, false, error.message);
        }
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