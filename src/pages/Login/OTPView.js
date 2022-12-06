

import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
// import { Password } from 'primereact/password';
import { useFormik } from 'formik';
import "./login.css";
import logo from "../../assets/Logo.svg";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { handlePostRequest } from '../../service/PostTemplate';
import * as Yup from "yup";
// import Forgot from '../forgot/Forgot';


const OTPView = ({storedEmail}) => {
    const [loading, setloading] = useState(false);
    const [loadingIcon, setloadingIcon] = useState("");


    const aplhaNumericSRegex = /^[a-zA-Z0-9]+@+[a-zA-Z0-9]+.+[A-z]/


    const validationSchema = Yup.object().shape({
        email: Yup.string().email("Invalid email address format").required("This field is required.").matches(aplhaNumericSRegex, "Invalid email address format"),
        OTP: Yup.string().required("This field is required."),
    })



    const dispatch = useDispatch();
    const history = useHistory();
    const formik = useFormik({
        validationSchema: validationSchema,
        initialValues: {
            email: '',
            OTP: ''
        },
        onSubmit: async (data) => {

            setloadingIcon("pi pi-spin pi-spinner");
            const response = await dispatch(handlePostRequest(data, "api/v1/user/forgetPassword", true, true));
            if (response?.status=== 200) {
                history.push("/resetpass");
            }
            setloading(false);
            setloadingIcon("");
            // formik.resetForm();


        }
    });

    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };

    return (
        <div className="bg_body">
            <div className="header__login">
                <h2>Welcome to</h2>
                <h3>Z-Store</h3>
                {/* {storedEmail} */}
            </div>
            <div className="login_container">
                <div className="row d-flex justify-content-center">
                    <div className="col-md-4">
                        <form className="form-group" onSubmit={formik.handleSubmit} >
                            <div className="form_logo">
                                <img src={logo} alt="Zindigi" />
                            </div>
                            <div className="Form-inputfield">
                                {/* <div>
                                    <label className="form-control" htmlFor="email">User Name / Email</label>
                                    <InputText name="email"
                                        id="email"
                                        className="img_email"
                                        placeholder="Enter Your Email"
                                        value={formik.values.email}
                                        onChange={formik.handleChange} autoFocus />
                                    {getFormErrorMessage('email')}
                                </div> */}
                                <div className="pt-2">
                                    <label className="form-control" htmlFor="OTP">OTP</label>
                                    <InputText type="password"
                                        name="OTP"
                                        id="OTP"
                                        placeholder="Enter Your OTP"
                                        value={formik.values.OTP}
                                        onChange={formik.handleChange}
                                        className="password__class"
                                        maxLength={4}
                                        keyfilter="int"
                                    />
                                    {getFormErrorMessage('OTP')}
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

export default OTPView;
