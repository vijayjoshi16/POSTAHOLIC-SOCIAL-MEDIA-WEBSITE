import React,{useEffect,createContext,useReducer,useContext} from 'react';
import Navbar from './components/Navbar';
import './App.css';
import {BrowserRouter,Route,Switch,useHistory} from 'react-router-dom';
import Home from "./components/screens/Home";
import SignIn from "./components/screens/SignIn";
import Profile from "./components/screens/Profile";
import SignUp from "./components/screens/SignUp";
import CreatePost from "./components/screens/CreatePost";
import UserProfile from "./components/screens/UserProfile";
import SubscribeUserPosts from './components/screens/SubscribeUserPosts'
import {initialState, reducer} from "./reducers/userReducer";

export const userContext = createContext()

const Routing = ()=>{
  const history = useHistory()
  const {state,dispatch} = useContext(userContext)
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
    //console.log(typeof(user),user)
    if(user){
      dispatch({type:"USER",payload:user})
    }else{
      history.push("/signin")
    }
  },[])
  return(
    <Switch >
        <Route exact path="/">
          <SubscribeUserPosts />
        </Route>
        <Route path="/signin">
          <SignIn />
        </Route>
        <Route path="/signup">
          <SignUp />
        </Route>
        <Route exact path="/profile">
          <Profile />
        </Route>
        <Route path="/createpost">
          <CreatePost />
        </Route>
        <Route path="/profile/:userid">
          <UserProfile />
        </Route>
        <Route path="/myfollowingpost">
          <Home />
        </Route>
    </Switch>
  )
}

function App() {
  const [state,dispatch] = useReducer(reducer,initialState)
  return (
    <userContext.Provider value={{state,dispatch}}>
      <BrowserRouter>
        <Navbar />
        <Routing/>
      </BrowserRouter>
    </userContext.Provider>
  );
}

export default App;
