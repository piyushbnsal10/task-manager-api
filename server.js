//Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned

// Libraries   
var mongoose =require('mongoose');
var express= require('express')
var userRouter=require('./Routers/user')
var taskRouter=require('./Routers/task')


//Connect MongoDB
mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser:true,
    useCreateIndex: true
})


var app= express()
var port = process.env.PORT

// app.use((req,res,next)=>{
//      res.status(503).send("Website under Maintainace")        
// })

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)



// Server Port
app.listen(port,()=>{
    console.log("Server is running on "+ port)
})