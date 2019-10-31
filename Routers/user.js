var User=require('../models/user')
var express=require('express')
var auth = require('../middleware/auth')
var multer=require('multer')
var {sendWelcomeEmail,sendCancellationEmail}=require('../emails/account')
var router=new express.Router()

router.get('/users/me',auth ,async (req,res)=>{

    res.send(req.user)
    // try{
    //     var users= await User.find({})
    //     res.send(users)
    // }
    // catch(error) {
    //     res.status(500).send(error)
    // }
})

router.get('/users/:id',async (req,res)=>{
    var id=req.params.id

    try{
        var user= await User.findById(id)

        if(!user)
            return res.send(400).send()
        res.send(user)
    }
   catch(error){
        res.status(500).send()
    }
})


router.post('/users/login', async(req,res)=>{

    try{
        var user=await User.findByCredentials(req.body.email, req.body.password)
        var token= await user.generateAuthToken()
        res.send({user,token})
    }
    catch{
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async (req,res,next)=>{
    try{
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })

        req.user.save()
        res.send('Logged out Successfully')
    }
    catch(error){
        res.status(500).send("Error in Logging out")
    }
})

router.post('/users/logoutAll', auth, async (req,res,next)=>{
    try{
        req.user.tokens=[]

        req.user.save()
        res.send('Logged out from all Sessions')
    }
    catch(error){
        res.status(500).send("Error in Logging out")
    }
})

router.post('/users',async (req,res)=>{
    var user =new User(req.body)

    try{
        await user.save()
        sendWelcomeEmail(user.email,user.name)
        var token= await user.generateAuthToken()
        res.status(201).send({user,token})
    }
    catch(error){
        res.status(400).send(error);
    }
    
})

router.patch('/users/me', auth,async (req,res)=>{
    var userKeys=Object.keys(req.body)
    var allowed=['name','email','password','age']
    var isValidOperation = userKeys.every((update)=>allowed.includes(update))

    if(!isValidOperation)
        return res.status(400).send()
    try{
        userKeys.forEach((update)=> req.user[update]=req.body[update])
        await req.user.save()
        res.send(req.user)
    }

    catch(error)
    {
        res.send(400).send()
    }
})

router.delete('/users/me',auth,async (req,res) => {
    try{
        await req.user.remove()
        sendCancellationEmail(user.email,user.name)
        res.send(req.user)
    }
    catch(error){
        res.status(400).send()
    }
})

var upload=multer({
    limits:{
        fileSize: 1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/))
            return cb(new Error('upload file must be a image file7'))
        
        cb(undefined,true)
    }
})
router.post('/users/me/avatar',auth,upload.single('upload'),async (req,res)=>{
   // var buffer=await sharp(req.file.buffer).resize({width:  250,height:250}).png().toBuffer()
    //req.user.avatar=buffer
    req.user.avatar=req.file.buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error: error.message})
})

router.delete('/users/me/avatar',auth,async (req,res)=>{
    req.user.avatar=undefined
    await req.user.save()
    res.send("profile pic Deleted")
})
router.get('/users/:id/avatar',async(req,res)=>{
    try{
        var user =await User.findById(req.params.id)

        if(!user || !user.avatar)
            throw new Error()
        
        res.set('Content-Type','application/png')
        res.send(user.avatar)
    }
    catch(error){
        res.status(404).send()
    }
})
module.exports=router