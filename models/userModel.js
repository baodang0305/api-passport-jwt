const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = Schema({
    username: String,
    password: String
}, {collection: 'User'});

const userModel = mongoose.model('userModel', userSchema);

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
    checkUser
}

