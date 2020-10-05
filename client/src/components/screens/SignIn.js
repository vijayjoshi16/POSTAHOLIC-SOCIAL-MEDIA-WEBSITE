import React,{useState,useContext} from 'react';
import {userContext} from '../../App';
import {Link,useHistory} from 'react-router-dom'
import M from 'materialize-css';

const SignIn = ()=>{
    const {state,dispatch} = useContext(userContext);
    const history = useHistory();
    const [password,setPassword] = useState("");
    const [email,setEmail] = useState("");
    const PostData = ()=>{
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html:'Invalid email'});
            return;
        }
        fetch("/signin",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                password:password,
                email:email
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data);
            if(data.err){
                M.toast({html:data.err});
            }else{
                localStorage.setItem("jwt",data.token);
                localStorage.setItem("user",JSON.stringify(data.user));
                dispatch({type:"USER",payload:data.user});
                M.toast({html:'Signed In Successfully'});
                history.push('/')
            }
        }).catch(err=>{
            console.log(err);
        });
    }
    return (
        <div>
        <div className="myCard">
            <div className="card auth-card input-field signInCard">
                <h2>Postaholic</h2>
                <input type="text" placeholder="Email" 
                value={email} onChange={(e)=>setEmail(e.target.value)}/>
                <input type="password" placeholder="Password" 
                value={password} onChange={(e)=>setPassword(e.target.value)}/>
                <button className="btn waves-effect waves-light #424242 grey darken-3"
                onClick={()=>PostData()}>
                    Sign In
                </button>
                <h5>
                    <Link to="/signup">New User?SignUp here</Link>
                </h5>
            </div>
        </div>
        </div>
    );
};

export default SignIn;