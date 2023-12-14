import React, { useState, useEffect } from "react";
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useFormik } from 'formik';
import "./login.css";
import logo from "../../../src/assets/Logo.svg";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { LOGIN_SUCCESS } from "../../redux/slices/authenticationSlice";
import { handlePostRequest } from '../../service/PostTemplate';
import * as Yup from "yup";
import { handleGetRequest } from '../../service/GetTemplate';
import { Password } from "primereact/password";

const Login = (props) => {
    const [loading, setloading] = useState(false);
    const [loadingIcon, setloadingIcon] = useState("");
    const [loginFailed, setLoginFailed] = useState(false);

    const aplhaNumericSRegex = /^[a-zA-Z0-9]+@+[a-zA-Z0-9]+.+[A-z]/;

    const validationSchema = Yup.object().shape({
        email: Yup.string().email("Invalid email address format").required("This field is required."),
        password: Yup.string().required("This field is required."),
    });

    const dispatch = useDispatch();
    const history = useHistory();

    const formik = useFormik({
        validationSchema: validationSchema,
        initialValues: {
            email: '',
            password: ''
        },
        onSubmit: async (data) => {
            setloadingIcon("pi pi-spin pi-spinner");
            setloading(true);

            const response = await dispatch(handlePostRequest(data, "api/v1/user/login", true, true));

            if (response?.data?.data?.email === data["email"]) {
                localStorage.setItem("login", true);
                getPermissionById(response?.data?.data?.role);
                history.push("/");
            } else {
                setLoginFailed(true);
                setTimeout(() => {
                    setLoginFailed(false);
                    setloading(false);
                    setloadingIcon("");
                }, 6000);
            }
        }
    });

    const getPermissionById = async (data) => {
        const response = await handleGetRequest(`api/v1/rolePermission/getByRole?roleId=${data}`, true);

        localStorage.setItem("permissions", JSON.stringify(response));
        const obj = {
            permissions: response,
            login: true,
        }

        dispatch(LOGIN_SUCCESS(obj))
    }

    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };

    const forgetpassword1 = (e) => {
        history.push('/forgetpassword');
    }

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
                            <div className="Form-inputfield">
                                <div>
                                    <label className="form-control" htmlFor="email">Email</label>
                                    <InputText
                                        name="email"
                                        id="email"
                                        placeholder="Enter Email"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        autoFocus
                                    />
                                    {getFormErrorMessage('email')}
                                </div>
                                <div className="pt-2">
                                    <label className="form-control" htmlFor="password">Password</label>
                                    <Password
                                        type="password"
                                        name="password"
                                        id="password"
                                        placeholder="Enter Password"
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        toggleMask
                                        feedback={false}
                                    />
                                    {getFormErrorMessage('password')}
                                </div>
                            </div>
                            <div className="form-check pt-2 text-right">
                                <span
                                    className="forgot_password"
                                    onClick={forgetpassword1}
                                >
                                    Forgot password ?
                                </span>
                            </div>
                            <div className="btn_class">
                                <div className="p-mt-2">
                                    <Button
                                        type="submit"
                                        className="Login_button"
                                        label="LOGIN"
                                        icon={loadingIcon || ""}
                                        iconPos="right"
                                        disabled={loading || loginFailed}
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

export default Login;
