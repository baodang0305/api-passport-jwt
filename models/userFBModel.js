const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = Schema({
    facebook_id: String,
    fullName: String,
    email: String
}, {collection: 'userFB'});

const userFBModel = mongoose.model('userFBModel', userSchema);

const checkUserByFacebookID = async(facebook_id)=>{
    const userFinder = await userFBModel.findOne({'facebook_id': facebook_id});
    if(!userFinder){
        return false;
    }
    return true;
}

module.exports = {
    userFBModel,
    checkUserByFacebookID
}

