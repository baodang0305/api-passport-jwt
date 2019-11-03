const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = Schema({
    username: String,
    password: String,
    fullName: String,
    email: String
}, {collection: 'user'});

const userModel = mongoose.model('userModel', userSchema);

const checkUsername = async(username)=>{
    const userFinder = await userModel.findOne({'username': username});
    if(!userFinder){
        return false;
    }
    return true;
}

const checkUserByEmail = async(email)=>{
    const userFinder = await userModel.findOne({'email': email});
    if(!userFinder){
        return false;
    }
    return true;
}

const checkUser = async(username, password) =>{
  
    const userFinder = await userModel.findOne({'username': username});
    if(!userFinder){
        return false;
    }
    else{
        const hashPassword = await bcrypt.compare(password, userFinder.password);
        if(!hashPassword){
            return false;
        }
    }
    return true;
}


module.exports = {
    userModel,
    checkUsername,
    checkUserByEmail,
    checkUser
}

