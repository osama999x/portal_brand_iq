import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { useHistory } from "react-router-dom";
import { useFormik } from "formik";
import classNames from "classnames";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
// import { InputMask } from "primereact/inputmask";
import * as Yup from "yup";

import { handleGetRequest } from "../../service/GetTemplate";
import { handlePostRequest } from "../../service/PostTemplate";
// import { handlePutRequest } from "../../service/PutTemplate";
import { handlePatchRequest } from "../../service/PatchTemplete";
import { useDispatch } from "react-redux";
// import { Dialog } from "primereact/dialog";
// import moment from "moment";
import { ProgressSpinner } from "primereact/progressspinner";
//import { Password } from 'primereact/password';

const AddEditUsers = ({ getUserData, onHide, editable, UsersRowData }) => {
    const [loading, setLoading] = useState(false);
    // const [loadingIcon, setloadingIcon] = useState("pi pi-save");
    const [userRoles, setUserRoles] = useState([]);
    const [userId, setUserId] = useState();
    const [error, setError] = useState('');
    

    // const onlyalphabetSRegex = /^(?!\s)[A-Za-z0-9\s]+$/;
    //  const aplhaNumericSRegex = /^[a-zA-Z0-9]+@+[a-zA-Z0-9]+.+[A-z]/
    // const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    const validEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const history = useHistory();
    const dispatch = useDispatch();


    const getUsersByID = async () => {
        const data = {};
        data["userID"] = UsersRowData;
        setLoading(true);
        const res = await dispatch(handlePostRequest(data, "api/v1/user/userDetails"));
        const keyData = res?.data?.data;
        setUserId(res.userId);
        setLoading(false);
        const roles = keyData?.role?._id;
        // const rolesName = roles.map((name) => name?._id);
        Object.keys(keyData).forEach((key) => {
            if (formik.initialValues.hasOwnProperty(key)) {
                formik.setFieldValue(key, keyData[key]);
            }
        });
        formik.setFieldValue("roleId", roles)
    };
    const getUsersRole = async () => {
        const res = await handleGetRequest("api/v1/role/all", false);
        if (res) {
            setUserRoles(res);
        }
    }


    useEffect(() => {
        if (UsersRowData !== undefined && UsersRowData !== null && editable === true) {
            getUsersByID();
        }
    }, []);
    useEffect(() => {
        getUsersRole();
    }, []);




    const validationSchema = Yup.object().shape({
        
        name: Yup.string()?.required("This field is required."),
        // .matches(onlyalphabetSRegex,"This field should contain alphabets only"),
        roleId: Yup.string()?.required("This field is required"),
        email: Yup.string().required("This field is required.").matches(validEmail, "Invalid email address format"),
        password: AddEditUsers ? Yup.string() : Yup.string().required("This field is required."),

        contact: Yup.string()
            .required("This field is required.")
            .max(11, "Maximum length 11 allowed"),
    });

    const formik = useFormik({
        validationSchema: validationSchema,
        initialValues: {
            name: "",
            roleId: "",
            email: "",
            //password: "",
            contact: "",
        },
        onSubmit: async (data) => {

            // setLoading(true);
            // setloadingIcon("pi pi-spin pi-spinner");
            if (editable === true) {

                data["userId"] = UsersRowData;
                const res = await dispatch(handlePatchRequest(data, "api/v1/user/", true, true));

                if (res?.status === 200) {
                    await getUserData();
                    formik.resetForm();
                    onHide();
                }
            } else {
                const res = await dispatch(handlePostRequest(data, "api/v1/user/", true, true));

                if (res?.status === 200) {
                    await getUserData();
                    formik.resetForm();
                    onHide();
                    
                }
            }
            // data.preventDefault
            // if(!currentuser.permissions.includes('create_user')){
            //     setError('You do not have the necessary permission to create a new user.');
            //     return;
            // }
            // setError('');
            //  setLoading(false);
            //  setloadingIcon("pi pi-save");
        },
    });
    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };

    const handleCancel = (e) => {
        e.preventDefault();
        onHide();
    };
   //const handleSubmit = (event) => {
    //event.preventDefault();
    // if(!currentuser.permissions.includes('create_user')){
    //     setError('You do not have the necessary permission to create a new user.');
    //     return;
    // }
    // setError('');
   //}

    return (
        <>
            {
                 loading ? 
              (
                <ProgressSpinner style={{ display: "flex", justifyContent: "center", alignItem: "center", height: "50vh" }} strokeWidth="2" stroke-miterlimit="10" />
            ) : ( 
                <form onSubmit={formik.handleSubmit}>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <div className="grid p-p-3">
                        <div className="col-12 md:col-12 lg:col-12 xl:col-12">
                            <div className="flex flex-column">
                                <label className="mb-2">Name</label>
                                <InputText keyfilter="alpha" maxLength={25} minLength={5} placeholder="Enter Name" id="name" name="name" value={formik?.values?.name?.replace(/\s\s+/g, " ")} onChange={formik.handleChange} className={classNames({ "p-invalid": isFormFieldValid("name") }, "w-full md:w-10 inputClass")} />
                                {getFormErrorMessage("name")}
                            </div>
                        </div>
                        <div className="col-12 md:col-12 lg:col-12 xl:col-12">
                            <div className="flex flex-column">
                                <label className="mb-2">Role</label>
                                <Dropdown
                                    id="roleId"
                                    placeholder="Select Role"
                                    options={userRoles}
                                    optionLabel="name"
                                    name="roleId"
                                    optionValue="_id"
                                    value={formik.values.roleId}
                                    onChange={formik.handleChange}
                                    className={classNames({ "p-invalid": isFormFieldValid("roleId") }, "w-full md:w-10 inputClass")}
                                    
                                />
                                {getFormErrorMessage("roleId")}
                            </div>
                        </div>
                        <div className="col-12 md:col-12 lg:col-12 xl:col-12">
                            <div className="flex flex-column">
                                <label className="mb-2">Email</label>
                                <InputText
                                    placeholder="Enter Email"
                                    id="email"
                                    name="email"
                                    value={formik?.values?.email?.replace(/\s\s+/g, " ")}
                                    onChange={formik.handleChange}
                                    className={classNames({ "p-invalid": isFormFieldValid("email") }, "w-full md:w-10 inputClass")}
                                    maxLength={50}
                               />
                                {getFormErrorMessage("email")}
                            </div>
                        </div>
                        <div className={editable ? "dNone" : "col-12 md:col-12 lg:col-12 xl:col-12"}>
                            <div className="flex flex-column">
                                <label className="mb-2">Password</label>
                                <InputText
                                    type="password" 
                                    disabled={editable}
                                    id="password"
                                    name="password"
                                    placeholder="Enter Password"
                                     value={formik?.values?.password} 
                                     onChange={formik.handleChange} 
                                     className={classNames({ "p-invalid": isFormFieldValid("password") }, "w-full md:w-10 inputClass ")}
                                     maxLength={15}
                                     //   toggleMask 
                                      />
                                {getFormErrorMessage("password")}
                            </div>
                        </div>
                        
                        <div className="col-12 md:col-12 lg:col-12 xl:col-12">
                            <div className="flex flex-column">
                                <label className="mb-2">Contact Number</label>
                                <InputText
                                    type="text"
                                    placeholder="Enter Contact Number"
                                    id="contact"
                                    name="contact"
                                    value={formik?.values?.contact}
                                    onChange={formik.handleChange}
                                    className={classNames({ "p-invalid": isFormFieldValid("contact") }, "w-full md:w-10 inputClass")}
                                     keyfilter="int"
                                     maxLength={11}
                                />
                                {getFormErrorMessage("contact")}
                            </div>
                        </div>

                        <div className="col-12 text-center">
                            <Button label="Cancel" onClick={(e) => handleCancel(e)} className="Cancelbtn p-mr-3" />
                            <Button disabled={loading}  iconPos="right" label={editable ? "Update" : "Save"} autoFocus className="Savebtn p-mr-3" />
                        </div>

                    </div>
                </form>
            )
             } 
        </>
    );
};

export default AddEditUsers;
