

import React, { useEffect, useState } from 'react';
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


const OTPView = () => {
    const params = useParams();
    const { email } = params;

    const [loading, setloading] = useState(false);
    const [loadingIcon, setloadingIcon] = useState("");
    const [otp, setOtp] = useState(['', '', '', '']);
    const [storedEmail, setStoredEmail] = useState();


    const handleOtpChange = (e, index) => {
        const pastedValue = e.target.value;
        const newOtp = [...otp];
        const otpLength = newOtp.length;
        for (let i = 0; i < otpLength; i++) {
            if (index + i < otpLength) {
                newOtp[index + i] = pastedValue[i] || '';
            }
        }
        //newOtp[index] = e.target.value;
        setOtp(newOtp);
        const nextIndex = index + pastedValue.length;
        if (nextIndex < otpLength) {
            const nextInput = document.querySelector(`#otp-${nextIndex}`);
            nextInput.focus();
        }
    };
    // const aplhaNumericSRegex = /^[a-zA-Z0-9]+@+[a-zA-Z0-9]+.+[A-z]/


    const validationSchema = Yup.object().shape({
        //email: Yup.string().email("Invalid email address format").required("This field is required."),
        //   OTP: Yup.string().required("This field is required."),
    })



    const dispatch = useDispatch();
    const history = useHistory();
    const formik = useFormik({
        validationSchema: validationSchema,
        initialValues: {
            //email: '',
            OTP: ''
        },
        onSubmit: async (body) => {

            const data = {
                "email": email,
                "otp": otp.join(""),

            }

            setloadingIcon("pi pi-spin pi-spinner");
            const response = await dispatch(handlePostRequest(data, "api/v1/user/resetpassword/verify", true, true));
            if (response?.status === 200) {
            }
            //setStoredEmail(data.email);
            //params(data.email)
            setloading(false);
            setloadingIcon("");
            formik.resetForm();

            history.push("/resetpass/" + data.email);


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
                <h3>M-Safa</h3>
            </div>
            <div className="login_container">
                <div className="row d-flex justify-content-center">
                    <div className="col-md-4">
                        <form className="form-group" onSubmit={formik.handleSubmit} >
                            <div className="form_logo">
                                <img src={logo} alt="Zindigi" />
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

                            <div className='mt-2'>

                                <label className="form-control" >OTP</label>
                                <div className="otp-input">
                                    {otp.map((char, index) => (<InputText key={index}
                                        id={`otp-${index}`} type="number" size="2" maxLength="4"
                                        value={char}
                                        //separator={<span>-</span>}
                                        //name="OTP"

                                        onChange={e => handleOtpChange(e, index)} />))}
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

                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>


    );
}

export default OTPView;
