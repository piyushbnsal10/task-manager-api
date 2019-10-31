var mongodb= require('mongodb')
var mongoClient=mongodb.MongoClient;

var mongoURL="mongodb://127.0.0.1:27017"
var dbName='task-manager'

mongoClient.connect(mongoURL,{useNewUrlParser: true},(error,client)=>{
    if(error)
        return console.log("Unable to connect to database")
    
    console.log("Database Connected")

    var db=client.db(dbName)
    db.collection('users').findOne({
        name: 'Piyush'
    }
    ,(error,user)=>{
        if(error)
            return console.log("Unable to insert User")

        console.log(user)
    })
})



