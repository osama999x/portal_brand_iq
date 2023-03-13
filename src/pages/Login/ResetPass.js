import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
// import { Password } from 'primereact/password';
import { useFormik } from 'formik';
import "./login.css";
import logo from "../../assets/Logo.svg";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { handlePostRequest } from '../../service/PostTemplate';
import * as Yup from "yup";
// import Forgot from '../forgot/Forgot';


const ResetPass = () => {
    const params = useParams();
    const {email} = params;  
    const [loading, setloading] = useState(false);
    const [loadingIcon, setloadingIcon] = useState("");

    const validationSchema = Yup.object().shape({
        //email: Yup.string().email("Invalid email address format").required("This field is required."),
        password: Yup.string().required("This field is required."),
        reEnterPassword: Yup.string().required("This field is required."),
    });
    const dispatch = useDispatch();
    const history = useHistory();
    const formik = useFormik({
        validationSchema: validationSchema,
        initialValues: {
            //email:'',
            password: "",
            reEnterPassword:""
        },
        onSubmit: async () => {
             const data = {
                "email":email,
                "password":formik.values.password,
                "reEnterPassword":formik.values.reEnterPassword
                // password:data.password,
                // reEnterPassword:data.reEnterPassword
             }  
             
             
             
             
            setloadingIcon("pi pi-spin pi-spinner");
            const response = await dispatch(handlePostRequest(data, "api/v1/customer/resetpassword/forgot", true, true));
            if (response?.data?.data?.email === data["email"]) {

            }
            setloading(false);
            setloadingIcon("true");
            history.push("/");

        }
    });

    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };

    return (


        <div className="resetbg_body">

            {/* <div className="header__login">
                <h2>Welcome to</h2>
                <h3>Z-Store</h3>
            </div> */}

            <div className="login_container">
                <div className="row d-flex justify-content-center">

                    <div className="col-md-4">
                        <form className="form-group" onSubmit={formik.handleSubmit} >
                            <div className="heading">
                                {/* <img src={logo} alt="Zindigi" /> */}
                                <h1>Reset Password</h1>
                            </div>
                            {/* <div className="Form-inputfield">
                                <div>
                                    <label className="form-control" htmlFor="email">Email</label>
                                    <InputText name="email"
                                        id="email"
                                        className="img_email"
                                        placeholder="Enter Email"
                                        value={formik.values.email}
                                        onChange={formik.handleChange} autoFocus />
                                    {getFormErrorMessage('email')}
                                </div>
                            </div> */}
                            <div className="Form-inputfield">

                                <div className="pt-2">
                                    <label className="form-control" htmlFor="password">New Password</label>
                                    <InputText type="password"
                                        name="password"
                                        id="password"
                                        placeholder="Enter Password"
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        className="password__class"
                                        toggleMask
                                    />
                                    {getFormErrorMessage('password')}

                                </div>
                                <div className="pt-2">
                                    <label className="form-control" htmlFor="password">Confirm Password</label>
                                    <InputText type="password"
                                        name="reEnterPassword"
                                        id="reEnterPassword"
                                        placeholder="Confirm  Password"
                                        value={formik.values.reEnterPassword}
                                        onChange={formik.handleChange}
                                        className="password__class"
                                        toggleMask
                                    />
                                    {getFormErrorMessage('reEnterPassword')}

                                </div>
                            </div>
                            <div className="btn_class">
                                <div className="p-mt-2">
                                    <Button type="submit"
                                        className="Login_button"
                                        label="Submit"
                                        icon={loadingIcon || ""}
                                        iconPos="right"
                                        disabled={loading}
                                    />
                                </div>
                            </div>


                        </form>
                    </div>
                </div>
            </div>
        </div>


    );
}

export default ResetPass;
