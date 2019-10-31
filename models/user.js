var mongoose = require('mongoose')
var validator =require('validator')
var bcryptjs = require('bcryptjs')
var jwt=require('jsonwebtoken')
var Task=require('./task')

mongoose.connect("mongodb://127.0.0.1:27017/task-manager-api",{
    useNewUrlParser:true,
    useCreateIndex: true
})

var userSchema=mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },

    email:{
        type: String,
        unique: true,
        required: true,
        trim:true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value))
                throw new Error('Email is invalid')
        }
    },

    password:{
        type: String,
        requried:true,
        minlength: 9,
        validate(value){
            if(value.toLowerCase().includes('password'))
                throw new Error('Password cannot contain "password"')
        }
    },

    age:{
        type: Number,
        default:0,
        validate(value){
            if(value<0)
                throw new Error('Age must be a positive Number')
        }
    },

    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],

    avatar:{
        type:Buffer
    }
},
{
    timestamps: true
})

userSchema.statics.findByCredentials =async (email,password)=>{
    var user= await User.findOne({email})

    if(!user)
        throw new Error('Unable to Login')
    
    var isMatch = await bcryptjs.compare(password,user.password)

    if(!isMatch)
        throw new Error('Unable to Login')
    
    return user
}

userSchema.methods.toJSON=function(){
    var user =this
    var userObject=user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

userSchema.methods.generateAuthToken = async function(){
    var user=this
    var token=jwt.sign({_id:user._id.toString()},'12345678')
    user.tokens=user.tokens.concat({ token})
    await user.save()
    return token
}

userSchema.pre('save',async function(next){
    var user =this

     if(user.isModified('password'))
        user.password=await bcryptjs.hash(user.password,8)

    console.log("YO!!!!!")
    next()
})

userSchema.pre('remove',async function(next){
    var user=this

    await Task.deleteMany({owner:user._id})
    next()
})

var User=mongoose.model('User',userSchema)


module.exports=User