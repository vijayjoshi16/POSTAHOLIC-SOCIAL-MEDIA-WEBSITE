import React,{useState,useEffect} from 'react';
import {Link,useHistory} from 'react-router-dom';
import M from 'materialize-css';

const SignUp = ()=>{
    const history = useHistory();
    const [name,setName] = useState("");
    const [password,setPassword] = useState("");
    const [email,setEmail] = useState("");
    const [image,setImage] = useState("");
    const [url,setUrl] = useState(undefined);
    useEffect(()=>{
        if(url){
            uploadFields()
        }
    },[url])

    const uploadPic = ()=>{
       const data = new FormData()
       data.append("file",image)
       data.append("upload_preset","social-media-clone")
       data.append("cloud_name","vijayscloud")
       fetch("https://api.cloudinary.com/v1_1/vijayscloud/image/upload",{
           method:"post",
           body:data
       })
       .then(res=>res.json())
       .then(data=>{
          setUrl(data.url)
       })
       .catch(err=>{
           console.log(err)
       })
    }

    const uploadFields = ()=>{
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html:'Invalid email'});
            return;
        }
        fetch("/signup",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name:name,
                password:password,
                email:email,
                pic:url
            })
        }).then(res=>res.json())
        .then(data=>{
            if(data.err){
                M.toast({html:data.err});
            }else{
                M.toast({html:data.message});
                history.push('/signin')
            }
        }).catch(err=>{
            console.log(err);
        });
    }

    const PostData = ()=>{
        if(image){
            uploadPic()
        }else{
            uploadFields()
        }
        
    }
    return (
        <div className="myCard row">
            <div className="card auth-card input-field" style={{width:"50%"}}>
                <h2>Postaholic</h2>
                <input type="text" placeholder="Name"
                 value={name} onChange={(e)=>setName(e.target.value)}/>
                <input type="text" placeholder="Email" 
                value={email} onChange={(e)=>setEmail(e.target.value)}/>
                <input type="password" placeholder="Password" 
                value={password} onChange={(e)=>setPassword(e.target.value)}/>
                <div className="file-field input-field">
                <div className="btn waves-effect waves-light #424242 grey darken-3">
                    <span>Upload Profile Picture</span>
                    <input type="file" onChange={(e)=>setImage(e.target.files[0])} />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
                </div>
                <button className="btn waves-effect waves-light #424242 grey darken-3"
                onClick={()=>PostData()}>
                    Sign Up
                </button>
                <h5>
                    <Link to="/signin">Already have an account?SignIn here</Link>
                </h5>
            </div>
        </div>
    );
};

export default SignUp;