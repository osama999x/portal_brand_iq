import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";

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
import { Password } from 'primereact/password';
import { toast } from "react-toastify";
const AddEditUsers = ({ getUserData, onHide, editable, UsersRowData }) => {


    const [loading, setLoading] = useState(false);
    const [loadingIcon, setloadingIcon] = useState("pi pi-save");
    const [userRoles, setUserRoles] = useState([]);
    const [userId, setUserId] = useState();
    const [error, setError] = useState('');
    const [dataChange , setDataChange] =useState(null)

    // const onlyalphabetSRegex = /^(?!\s)[A-Za-z0-9\s]+$/;
    //  const aplhaNumericSRegex = /^[a-zA-Z0-9]+@+[a-zA-Z0-9]+.+[A-z]/
    // const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    const validEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    const dispatch = useDispatch();



  const [keydata ,setKeyData]= useState(null)
    const getUsersByID = async () => {
        const data = {};
        data["userID"] = UsersRowData;
        setLoading(true);
        const res = await dispatch(handlePostRequest(data, "api/v1/user/userDetails"));

        const keyData = res?.data?.data;
        setKeyData(keyData)
        setUserId(res.userId);
        setLoading(false);
        const roles = keyData?.role?._id;
        // const rolesName = roles.map((name) => name?._id);
        Object.keys(keyData).forEach((key) => {
            if (formik.initialValues.hasOwnProperty(key)) {
                formik.setFieldValue(key, keyData[key]);
            }
        });

        formik.setFieldValue("role", keyData.role)
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

        name: Yup.string()?.required("Please Enter Name."),
        // .matches(onlyalphabetSRegex,"This field should contain alphabets only"),
        role: Yup.string()?.required("Please Select Role"),
        email: Yup.string().required("Please Enter Email.").matches(validEmail, "Invalid email address format"),
        password: AddEditUsers ? Yup.string() : Yup.string().required("Please Enter Password."),

        contact: Yup.string()
            .required("Please Enter Contact Number.")
            .max(11, "Maximum length 11 allowed"),
    });

    const formik = useFormik({
        validationSchema: validationSchema,
        initialValues: {
            name: "",
            role: "",
            email: "",
            //password: "",
            contact: "03",
        },

        onSubmit: async (data) => {


            const keys = Object.keys(formik.initialValues);


            if (editable === true) {
                const updatedObject = {
                    ...data,
                    roleId: data.role,
                    // Omit the old key if you want
                    // ...other keys
                  };

                delete updatedObject.role;
                updatedObject["userId"] = UsersRowData;
                let key
                keys.map(async(key) => {
                     key =key
                  });

                  if (
                    keydata[key] !== data[key]) {
                    setDataChange(true)
                    setLoading(true);
                    setloadingIcon("pi pi-spin pi-spinner");
                     const res = await dispatch(handlePatchRequest(updatedObject, "api/v1/user/", true, true));
                     if (res?.status === 200) {
                         await getUserData();
                         formik.resetForm();
                         onHide();
                         setLoading(false);
                 setloadingIcon("");
                     }
                    }
                    else{
                        setDataChange(false)
                    toast.warning('No change')
                    }

            } else {

                const updateObject = {
                    ...data,
                    roleId: data.role,

                  };
                  delete updateObject.role;

                const res = await dispatch(handlePostRequest(updateObject, "api/v1/user/", true, true));

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
                                        <InputText maxLength={25} minLength={5} placeholder="Enter Name" id="name" name="name" value={formik?.values?.name?.replace(/\s\s+/g, " ")} onChange={formik.handleChange} className={classNames({ "p-invalid": isFormFieldValid("name") }, "w-full md:w-10 inputClass")} keyfilter={/^[a-zA-Z\s]*$/} />
                                        {getFormErrorMessage("name")}
                                    </div>
                                </div>
                                <div className="col-12 md:col-12 lg:col-12 xl:col-12">
                                    <div className="flex flex-column">
                                        <label className="mb-2">Role</label>
                                        <Dropdown
                                            id="role"
                                            placeholder="Select Role"
                                            options={userRoles}
                                            optionLabel="name"
                                            name="role"
                                            optionValue="_id"
                                            value={formik.values.role}
                                            onChange={formik.handleChange}
                                            className={classNames({ "p-invalid": isFormFieldValid("role") }, "w-full md:w-10 inputClass")}

                                        />
                                        {getFormErrorMessage("role")}
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
                                        <Password
                                            type="password"
                                            disabled={editable}
                                            id="password"
                                            name="password"
                                            placeholder="Enter Password"
                                            value={formik?.values?.password}
                                            onChange={formik.handleChange}
                                            className={classNames({ "p-invalid": isFormFieldValid("password") }, "w-full md:w-10 inputClass ")}
                                            maxLength={15}
                                            toggleMask
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
                                            minLength={11}
                                        />
                                        {getFormErrorMessage("contact")}
                                    </div>
                                </div>

                                <div className="col-12 text-center">
                                    <Button label="Cancel" onClick={(e) => handleCancel(e)} className="Cancelbtn p-mr-3" />
                                    <Button disabled={ loading}    icon={loadingIcon || ""} iconPos="right" label={editable ? "Update" : "Save"} autoFocus className="Savebtn p-mr-3" />
                                </div>

                            </div>
                        </form>
                    )
            }
        </>
    );
};

export default AddEditUsers;
