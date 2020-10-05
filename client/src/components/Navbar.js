import React,{useContext} from 'react';
import {Link,useHistory} from 'react-router-dom';
import {userContext} from '../App';

const Navbar = ()=>{
  const {state,dispatch} = useContext(userContext)
  const history = useHistory()
  const renderList = ()=>{
    if(state){
      return [
        <li><Link to="/profile">Profile</Link></li>,
        <li><Link to="/createpost">Create Post</Link></li>,
        <li><Link to="/myfollowingpost">Explore</Link></li>,
        <li>
          <button className="btn waves-effect waves-light #424242 grey darken-3"
                onClick={()=>{
                  localStorage.clear()
                  dispatch({type:'CLEAR'})
                  history.push('/signin')
                }}>
                   Logout
          </button>
        </li>
      ]
    }else{
      return [
        <li><Link to="/signin">SignIn</Link></li>,
        <li><Link to="/signup">SignUp</Link></li>
      ]
    }
  }
    return(
        <nav>
        <div className="nav-wrapper black">
          <Link to={state?"/":"/signin"} className="brand-logo left" style={{marginLeft:"10px"}}>Postaholic</Link>
          <ul id="nav-mobile" className="right">
            {renderList()}
          </ul>
        </div>
      </nav>
    );
}

export default Navbar;