const mongoose=require("mongoose")

mongoose.connect("mongodb://127.0.0.1:27017/email-subscriptions")
.then(()=>{
    console.log('mongoose connected');
})
.catch((e)=>{
    console.log("failed");
})

const subscriberSchema=new mongoose.Schema({
    owner:{
        type:String,
        required:true
    },
    listname:{
        type:String,
        required:true
    },
    subscriber_email:{
        type:String,
        required:true
    },
    subscriber_name:{
        type:String,
        required:false
    }
})

const SubscriberCollection=new mongoose.model('subscribers',subscriberSchema)

module.exports=SubscriberCollection