const mongoose = require('mongoose')
const validator = require('validator')
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"username is required"],
        unique:true,
        trim:true,
        index:true,
        maxLength:[30,"Name cannot exceed 30 characters"]

    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        validate:[validator.isEmail,"Please Enter a valid Email"],

    },
    password:{
        type:String,
        required:true,
        select:false
    }
}, {timestamps:true})

const User = mongoose.model('User',userSchema)
module.exports = User;