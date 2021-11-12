import '../App.css';
import {Link} from "react-router-dom";
import { useEffect } from 'react';
import {useHistory} from "react-router-dom";
const axios = require("axios");
export default function Mainpage(){
    let history = useHistory();
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
            history.push(`/dashboard`);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },[history]);
    
    return <>
    <div id="background">
        <nav className="navbar navbar-expand-lg" id="nav">
        <span className="material-icons md-48 pl-5">
        cloud
        </span> &nbsp;<span>Cloud Synk</span>
        <button className="navbar-toggler ml-auto custom-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent">
        <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse align-right" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
            <li className="nav-item">
                <span className="nav-link"> <i className="fa fa-user-o"></i><Link to="/login" id="nav">Login</Link> &nbsp;&nbsp;&nbsp;&nbsp;</span> 
            </li>
            <li className="nav-item">
                <span className="nav-link"> <i className="fa fa-sign-in"></i><Link to="/signup" id="nav">Sign Up</Link> &nbsp;</span>
            </li>
            </ul>
        </div>
        </nav>
        <div>
            <div className="container pt-3 pb-3">
                <div className="row pt-3">
                    <div className="col-md-6 pt-5">
                        <h1 className="pl-5 pt-2">Cloud Storage.</h1>
                        <p className="pl-5 pt-5 font">Simple and easy to use. Access your files anytime and anywhere.
                        Reliable and durable data storage.</p>
                        <p className="pl-5 pt-3 font">Store your files in Cloud Synk and never Synk out!</p>
                    </div>
                    <div className="col-md-6 pt-3 pl-5 text-center">
                        <img src="./images/cloud-main.png" className="responsive pt-5" alt="cloudsynklogo"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </>
}