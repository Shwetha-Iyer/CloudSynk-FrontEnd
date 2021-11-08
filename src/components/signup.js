import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {Link} from "react-router-dom";
import { Oval } from 'react-loading-icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { useEffect } from 'react';
import {useHistory} from "react-router-dom";
const axios = require("axios");

toast.configure();
const SignupSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  lastName: Yup.string()
    .min(1, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string()
  .required('Required') 
  .min(8, 'Password is too short - should be 8 chars minimum.')
  .max(15, 'Max 15 characters')
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/, 'Password must contain atleast 1 uppercase, lowercase and number.'),
});
export default function Signup(){
    let [click,setClick] = useState(0);
    let history = useHistory();
    useEffect(()=>{
        axios.get("http://localhost:3100/auth/authchecker",{
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
        <h1 className="pt-4 text-center">Sign Up</h1>
        <div className="container card-form pt-2 mt-4 mb-3">
            <div className="row">
                <div className="col-md-6 text-center">
                    <img src="../images/signin-image.jpg" alt="signinpic" className="responsive"/>
                </div>
                <div className="col-md-6 font-black text-center mb-3">
                <Formik
                    initialValues={{
                        firstName: '',
                        lastName: '',
                        email: '',
                        password:'',
                    }}
                    validationSchema={SignupSchema}
                    onSubmit={(values,{resetForm}) => {
                        // same shape as initial values
                        axios.post("http://localhost:3100/auth/register",{
                            firstname:values.firstName,
                            lastname:values.lastName,
                            email:values.email,
                            password:values.password
                        },{
                            headers:{
                                'Content-Type': 'application/json'
                            },
                            withCredentials: true,
                            crossDomain: true
                        })
                        .then((res) => {
                            if(res.status===200){
                                console.log("registration success");
                                setClick(0);
                                toast.success('SignUp successful. Account activation link sent!');
                                resetForm();
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                            if(error.response.status===400)
                                toast.warning("User already exists");
                            else
                                toast.error("Internal Server Error!")
                            resetForm();
                            setClick(0);
                        });
                    }}
                >
                {({ errors, touched }) => (
                    <Form>
                        <Field name="firstName" placeholder="First Name" className="form-control mt-5"/>
                        {errors.firstName && touched.firstName ? (<div>{errors.firstName}</div>) : null}
                        <Field name="lastName" placeholder="Last Name" className="form-control mt-5"/>
                        {errors.lastName && touched.lastName ? (<div>{errors.lastName}</div>) : null}
                        <Field name="email" type="email" placeholder="Email" className="form-control mt-5"/>
                        {errors.email && touched.email ? <div>{errors.email}</div> : null}
                        <Field name="password" type="password" placeholder="Password" className="form-control mt-5"/>
                        {errors.password && touched.password ? <div>{errors.password}</div> : null} <br/>
                        <Link to="/login" className="text-muted mt-3">Already a member?</Link> <br/>
                    <button type="submit" className="btn btn-primary mt-4 mt-3" onClick={()=> setClick(1)}>{click === 0 ? <span>Submit</span>: <span>Loading... <Oval stroke="#ffffff" fill="#000000" strokeOpacity={1} speed={1} fillOpacity={1} strokeWidth={3} height="1.5rem"/></span>}</button>
                    </Form>
                )}
                </Formik>    
                </div>   
            </div>
        </div>
    </div>
    </>
}