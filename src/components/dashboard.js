import {useHistory} from "react-router-dom";
import { useEffect, useState } from 'react';
import { Circles } from 'react-loading-icons';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Profile from "./profile";
import Upload from "./upload";
import Myfiles from "./myfiles";
const axios = require("axios");
export default function Dashboard(){
    let history = useHistory();
    let [page,setPage] = useState(0);
    let [info,setInfo] = useState({});
    let handlelogout = ()=>{
      axios.delete("https://cloudsynk-backend.herokuapp.com/auth/logout",{
          headers:{
            'Content-Type': 'application/json'
          },
          withCredentials: true,
          crossDomain: true
        }).then((res) => {
          console.log(res);
          if(res.status===200){
            console.log("Logged out");
            history.push(`/login`);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
    useEffect(()=>{
        axios.get("https://cloudsynk-backend.herokuapp.com/auth/authchecker",{
          headers:{
            'Content-Type': 'application/json'
          },
          withCredentials: true,
          crossDomain: true
        }).then((res) => {
          console.log(res);
          if(res.status===200){
            console.log("Logged in");
            setInfo({_id:res.data.sessUser.id,firstname:res.data.sessUser.firstname});
            setPage(1);
          }
        })
        .catch((error) => {
          console.log(error);
          history.push("/login");
        });
    },[history]);
    return <>
    {
      page === 0 ?
      <div id="background-dark">
      <p className="center"> <Circles stroke="#3ed5ff" fill="#3ed5ff" strokeOpacity={1} speed={1} fillOpacity={1} strokeWidth={3} height="50rem"/></p></div>:
      ( page === -1? <div id="background-dark"><h1>Oops! Cant load your dashboard</h1></div>:
        <div id="background-dark">
          <Router>
              <div className="row">
                <div className="col-12">
                  <span className="heading">Good Day {info.firstname}!</span> 
                  <span><button onClick={handlelogout} className="float-right btn btn-info mr-3 mt-4 mb-3">Logout </button></span>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <hr className="hr"/>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <nav className="nav-dash navbar justify-content-between">
                    <div className="col-4"><Link to="/dashboard" className="text">Profile</Link></div>
                    <div className="col-4 text-center"><Link to="/dashboard/upload" className="text">Upload</Link></div>
                    <div className="col-4 text-right"><Link to="/dashboard/files" className="text">Files</Link></div>  
                  </nav>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <hr className="hr-thin"/>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <Switch>
                      <Route path="/dashboard" component={()=> <Profile data={info}/>} exact={true}/>
                      <Route path="/dashboard/upload" component={()=> <Upload data={info}/>} exact={true}/>
                      <Route path="/dashboard/files" component={()=> <Myfiles data={info}/>} exact={true}/>
                  </Switch>
                </div>
              </div>
              </Router>
        </div>
        
      )
      
    }
    </>
}