const passport = require('passport');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {userLCModel, checkUserByUsername} = require('../models/userLCModel');

exports.register = async(req, res) => {
    const {username, password, fullName} = req.body;
    if(await checkUserByUsername(username)){
        return res.status(400).json({message : 'user đã tồn tại!'});
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = {
        'username': username,
        'password': hashPassword,
        'fullName': fullName
    }
    userLCModel.create(user, function(err, res){
        if(err){
            return console.log(err);
        }
        else{
            console.log("insert thành công!");
        }
    });
    res.json(user);
}

exports.login_local =  function (req, res, next) {
    passport.authenticate('local', {session: false}, (err, username) => {
        if (err || !username) {
            return res.status(400).json({
                message: 'username hoặc password không đúng!'
            });
        }
        req.login(username, {session: false}, (err) => {
           if (err) {
               res.send(err);
           }
           const token = jwt.sign(username, 'bao_dang');
           return res.status(200).json({username, token});
        });
    })(req, res);
}

exports.facebookOauth = function(req, res, next){
    passport.authenticate('facebookToken', { scope: ['profile', 'email'], session: false}, (err, user) => {
        if(err || !user) {
            return res.status(400).json({
                message: 'Đăng nhập facebook thất bại!'
            });
        }
        const token = jwt.sign(user, 'bao_dang');
        return res.status(200).json({user, token});
    })(req, res, next);
}

// exports.authe_facebook_callback = function(req, res){
//     passport.authenticate('facebookToken', {successRedirect: '/', failureRedirect: '/'})(req, res);
// }

/* GET user profile. */
exports.profile = function(req, res, next) {
    passport.authenticate('jwt', {session: false}, (err, user, info)=>{
        if(err){
            return res.status(400).json(err);
        }
        else if(info){
            return res.status(400).json({message: info.message});
        }
        return res.status(200).json(user);
    })(req, res, next);
}

exports.update = async(req, res) => {
    const {username, newUsername, newFullName} = req.body;
    if(await checkUserByUsername(username)){
        const user = {
            'username': newUsername,
            'fullName': newFullName
        }
        userLCModel.updateOne({"username": username}, {$set: {"username": newUsername, "fullName": newFullName}}, function(err, res){
            if(err){
                return res.status(400).json({
                    message: 'Cập nhật thất bại!'
                });
            }
            else{
                console.log("Cập nhật thành công!");
            }
        });
        res.status(200).json(user);
    }
}
  