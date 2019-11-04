const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = Schema({
    username: String,
    password: String,
    fullName: String
}, {collection: 'userLocal'});

const userLCModel = mongoose.model('userLCModel', userSchema);

const checkUserByUsername = async(username)=>{
    const userFinder = await userLCModel.findOne({'username': username});
    if(!userFinder){
        return false;
    }
    return true;
}

const checkUserByAll = async(username, password) =>{
    const userFinder = await userLCModel.findOne({'username': username});
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
    userLCModel,
    checkUserByUsername,
    checkUserByAll
}

