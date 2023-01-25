const mongoose=require("mongoose")

mongoose.connect("mongodb://127.0.0.1:27017/email-subscriptions")
.then(()=>{
    console.log('mongoose connected');
})
.catch((e)=>{
    console.log("failed");
})

const listSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    listname:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        required:true
    }
})

const ListCollection=new mongoose.model('lists',listSchema)

module.exports=ListCollection