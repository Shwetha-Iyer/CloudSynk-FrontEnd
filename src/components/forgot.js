import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Oval } from 'react-loading-icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
const axios = require("axios");

toast.configure();
const SignupSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
});
export default function Forgot(){
    let [click,setClick] = useState(0);
    return <>
    <div id="background">
        <h1 className="pt-5 text-center">Forgot Password</h1>
        <div className="container pt-2 mt-5 mb-5">
            <div className="row">
                <div className="col-md-4"> </div>
                <div className="col-md-4 font-black text-center mb-5 card-form">
                <img src="../images/forgot.jpg" alt="loginpic" height="60%" width="40%" className="pt-3"/>
                <Formik
                    initialValues={{
                        email: '',
                    }}
                    validationSchema={SignupSchema}
                    onSubmit={(values,{resetForm}) => {
                        // same shape as initial values
                        //console.log(values);
                        axios.put("https://cloudsynk-backend.herokuapp.com/auth/forgot",{email:values.email},{
                            headers:{
                                'Content-Type': 'application/json'
                            },
                            withCredentials: true,
                            crossDomain: true
                        }).then((res) => {
                            //console.log(res);
                            if(res.status===200){
                                toast.success("Password reset link has been sent to your email!");
                                setClick(0);
                                resetForm();
                            }
                        }).catch((error) => {
                            console.log(error);
                            if(error.response.status===404)
                                toast.warning("This email is not registered!");
                            else
                                toast.error("Internal server error");
                            setClick(0);
                            resetForm();
                        });
                    }}
                >
                {({ errors, touched }) => (
                    <Form>
                        <Field name="email" type="email" placeholder="Email" className="form-control mt-4"/>
                        {errors.email && touched.email ? <div>{errors.email}</div> : null}
                        <br/>
                        <button type="submit" className="btn btn-primary mt-4 mt-3 mb-5"onClick={()=> setClick(1)}>{click === 0 ? <span>Submit</span>: <span>Loading... <Oval stroke="#ffffff" fill="#000000" strokeOpacity={1} speed={1} fillOpacity={1} strokeWidth={3} height="1.5rem"/></span>}</button>
                    </Form>
                )}
                </Formik>    
                </div>
                <div className="col-md-4"> </div>
            </div>
        </div>
    </div>
    </>
}