import React, { useState, useEffect } from "react";
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useFormik } from 'formik';
import "./login.css";
import { BRAND_LOGO_URL } from "../../constants/brandLogo";
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
            email: 'admin@gmail.com',
            password: 'Login@7860'
        },
        onSubmit: async (data) => {
            setloadingIcon("pi pi-spin pi-spinner");
            setloading(true);

            const response = await dispatch(handlePostRequest(data, "api/v1/user/login", true, true));

            if (response?.data?.data?.email === data["email"]) {
                localStorage.setItem("login", true);
                const role = response?.data?.data?.role;
                const roleId = typeof role === "object" && role?._id ? role._id : role;
                getPermissionById(roleId);
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

    const getPermissionById = async (roleId) => {
        if (!roleId) return;
        const response = await handleGetRequest(`api/v1/rolePermission/getByRole?roleId=${roleId}`, true);

        if (!response?.modules) return;
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
            {/* Left brand panel */}
            <div className="login__brand-panel">
                <img src={BRAND_LOGO_URL} alt="BrandIQ" className="login__brand-logo" />
                <h1 className="login__brand-title">BrandIQ</h1>
                <p className="login__brand-subtitle">
                    Your intelligent brand management platform. Manage products, orders, and customers all in one place.
                </p>
                <div className="login__brand-dots">
                    <span></span><span></span><span></span>
                </div>
            </div>

            {/* Right form panel */}
            <div className="login__form-panel">
                <div className="login_container">
                    <h2 className="login__form-heading">Welcome back</h2>
                    <p className="login__form-sub">Sign in to your BrandIQ account</p>

                    <form onSubmit={formik.handleSubmit}>
                        <div className="Form-inputfield">
                            <div>
                                <label className="form-control" htmlFor="email">Email</label>
                                <InputText
                                    name="email"
                                    id="email"
                                    placeholder="Enter your email"
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
                                    placeholder="Enter your password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    toggleMask
                                    feedback={false}
                                />
                                {getFormErrorMessage('password')}
                            </div>
                        </div>

                        <span className="forgot_password" onClick={forgetpassword1}>
                            Forgot password?
                        </span>

                        <Button
                            type="submit"
                            className="Login_button"
                            label="Sign In"
                            icon={loadingIcon || ""}
                            iconPos="right"
                            disabled={loading || loginFailed}
                        />
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
