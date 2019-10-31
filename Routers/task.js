var Task=require('../models/task')
var express=require('express')
var auth = require('../middleware/auth')
var router=new express.Router()

router.get('/tasks',auth,async (req,res)=>{

    try{
        var tasks=await Task.findOne({owner:req.user._id})
        res.send(tasks)
    }
    catch(error) {
        res.status(500).send()
    }
})

router.get('/tasks/:id',auth,async (req,res)=>{
    var id=req.params.id

    try{
        var task= await Task.findOne({_id:id,owner:req.user._id})

        if(!task)
            return res.send(400).send()
        res.send(task)
    }
   catch(error){
        res.status(500).send()
    }
})


router.post('/task',auth,async(req,res)=>{
   // var task=new Task(req.body)
        var task= new Task({
            ...req.body,
            owner:req.user._id
        })
    try{
        await task.save()
        res.status(201).send(task)
    }
    catch(error){
        res.status(400).send();
    }
})


router.patch('/tasks/:id',auth, async (req,res)=>{
    var taskKeys=Object.keys(req.body);
    var allowed=['description','completed']
    var isValidOperation=taskKeys.every((update)=>allowed.includes(update))

    if(!isValidOperation)
        return res.status(404).send()
    
    try{
        var task=await Task.findOne({_id:req.params.id,owner:req.user._id})
        if(!task)
            return res.status(404).send()
        
        taskKeys.forEach((updates)=> task[updates]=req.body[updates])
        await task.save()
        res.send(task)
    }
    catch(error){
        res.send(400).send()
    }
})

router.delete('/tasks/:id',auth,async (req,res)=>{
    try{
        var task=await Task.findOneAndRemove({_id:req.params.id,owner:req.user._id});
        if(!task)
            return res.status(404).send("Task not found !!!")
        res.send(task)
    }
    catch(error){
        res.status(400).send()
    }
})


module.exports=router