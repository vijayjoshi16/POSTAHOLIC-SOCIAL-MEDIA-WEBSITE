const moongoose = require('mongoose')
const {ObjectId} = moongoose.Schema.Types;
const postSchema = new moongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    photo:{
        type:String,
        required:true
    },
    likes:[{
        type:ObjectId,
        ref:"User"
    }],
    postedBy:{
        type:ObjectId,
        ref:"User"
    },
    comments:[{
        text:String,
        postedBy:String
    }],
});

moongoose.model("Post",postSchema);