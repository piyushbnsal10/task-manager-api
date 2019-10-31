var jwt=require('jsonwebtoken')
var User= require('../models/user')

var auth = async (req,res,next)=>{

    try{
        
        
        var token= req.header('Authorization').replace('Bearer ','')
        var decoded= jwt.verify(token,process.env.JWT)
        var user=await User.findOne({_id: decoded._id,'tokens.token':token})

        if(!user)
            throw new Error()

        req.token=token
        req.user=user
        next()
    }
    catch(error){
        res.status(401).send("error : please Authenticate")
    }
}

module.exports= auth