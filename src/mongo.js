const mongoose=require("mongoose")

mongoose.connect("mongodb://127.0.0.1:27017/email-subscriptions")
.then(()=>{
    console.log('mongoose connected');
})
.catch((e)=>{
    console.log("failed");
})

const logInSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:false
    },
    phone:{
        type:String,
        required:false
    }
})

const LogInCollection=new mongoose.model('users',logInSchema)

module.exports=LogInCollection