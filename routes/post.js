const express = require('express');
const router = express.Router();
const mongoose=require('mongoose');
const requireLogin = require('../middleware/requireLogin');
const { route } = require('./auth');
const Post = mongoose.model("Post");

router.get("/allpost",requireLogin,(req,res)=>{
    Post.find().populate("postedBy","_id name").then(posts=>{
        res.json({posts:posts})
    }).catch(err=>{
        console.log(err);
    });
});

router.get("/getsubpost",requireLogin,(req,res)=>{
    Post.find({postedBy:{$in:req.user.following}}).populate("postedBy","_id name").then(posts=>{
        res.json({posts:posts})
    }).catch(err=>{
        console.log(err);
    });
});

router.post("/createpost",requireLogin,(req,res)=>{
    console.log('Req:',req);
    const {title,body,pic} = req.body;
    //console.log(req);
    if(!pic)
    console.log("err")
    else
    console.log("noerr");
    if(!title || !body || !pic){
        return res.status(422).json({err:"Please add all the fields"});
    }
    req.user.password = undefined;
    const post = new Post({
        title:title,
        body:body,
        photo:pic,
        postedBy:req.user
    });
    post.save().then(result=>{
        res.json({post:result})
    }).catch(err=>{
        console.log(err);
    });
});

router.get("/mypost",requireLogin,(req,res)=>{
    Post.find({postedBy:req.user._id}).populate("PostedBy","_id name").then(mypost=>{
        res.json({mypost:mypost});
    }).catch(err=>{
        console.log(err);
    });
});

router.put('/like',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.put('/unlike',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.put('/comment',requireLogin,(req,res)=>{
    const comment = {
        text:req.body.text,
        postedBy:req.user.name
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    })
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.delete('/deletepost/:postId',requireLogin,(req,res)=>{
    Post.findOne(P={_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err || !post){
            return res.status(422).json({error:err})
        }
        if(post.postedBy._id.toString() === req.user._id.toString()){
            post.remove()
            .then(result=>{
                res.json(result)
            }).catch(err=>{
                console.log(err)
            })
        }
    })
})

module.exports = router;