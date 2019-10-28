const {userModel, checkUser} = require('../models/userModel');
const passport = require('passport');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async(req, res) => {
    const {username, password, fullName} = req.body;
    console.log(password);
    if(await checkUser(username, password)){
        return res.send('user is already');
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = {
        'username': username,
        'password': hashPassword,
        'fullName': fullName
    }
    userModel.create(user, function(err, res){
        if(err){
            return console.log(err);
        }
        else{
            console.log("insert is success");
        }
    });
    res.json({user});
}

exports.login =  function (req, res, next) {
    passport.authenticate('local', {session: false}, (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({
                message: 'Something is not right',
                user   : user
            });
        }
       req.login(user, {session: false}, (err) => {
           if (err) {
               res.send(err);
           }
           const token = jwt.sign(user, 'bao_dang');
           return res.status(200).json({user, token});
        });
    })(req, res);
}

/* GET user profile. */
exports.profile = function(req, res, next) {
    passport.authenticate('jwt', {session: false}, (err, user, info)=>{
        if(err){
            return res.status(400).json(err);
        }
        else if(info){
            return res.status(400).json({message: info.message});
        }
        return res.status(200).json({user});
    })(req, res, next);
}
  