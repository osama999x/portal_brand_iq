import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
// import { useHistory } from "react-router-dom";
import { useFormik } from "formik";
import classNames from "classnames";
// import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { MultiSelect } from "primereact/multiselect";
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
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from "primereact/dropdown";


    const AddEditRoles = ({ getRoleData, onHide, editable, UsersRowData }) => {
    const [loading, setLoading] = useState(false);
    // const [loadingIcon, setloadingIcon] = useState("pi pi-save");
    const [userPermissions, setUserPermissions] = useState([]);
    const [selectPermissionValue, setSelectPermissionValue] = useState([]);

    const [userId, setUserId] = useState();
    
    // const onlyalphabetSRegex = /^(?!\s)[A-Za-z0-9\s]+$/;



    // const history = useHistory();
    const dispatch = useDispatch();
    // const PermissionsTemplate = (rowData) => {
    //     const roles = rowData?.permissions;
    //     const rolesName = roles.map((name) => name?.name).toString();
    //     return <React.Fragment>{rolesName.replace(/,/g, ', ')}</React.Fragment>;

    // }

    const getUsersByID = async () => {
        const data= {};
        data ["roleId"]=UsersRowData;
        setLoading(true);
        const res = await dispatch(handlePostRequest(data,"api/v1/role/roleDetails"));
        const keyData = res?.data?.data;
        setUserId(res.userId);
        setLoading(false);
        const roles = keyData?.permissions;
        const rolesName = roles.map((name) => name?._id);
        Object.keys(keyData).forEach((key) => {
            if (formik.initialValues.hasOwnProperty(key)) {
                formik.setFieldValue(key, keyData[key]);
            }
        });
        formik.setFieldValue("permissionsId",rolesName)
        
    };
    const getUsersRole = async () => {
        const res = await handleGetRequest("api/v1/permission/all", false);
        if (res) {
        setUserPermissions(res);
        }
    }
   

    useEffect(() => {
        if (UsersRowData !== undefined && UsersRowData !== null && editable === true) {
             getUsersByID();
        }
    },[]);
    useEffect(() => {
         getUsersRole();
    }, []);

    const validationSchema = Yup.object().shape({
        name: Yup.string()?.required("This field is required."),
        // matches(onlyalphabetSRegex, "This field should contain alphabets only"),
        //permissionsId:Yup.mixed().required("This field is required."),
        description: Yup.string()
            .required("This field is required.")
            .nullable(),
    });

    const formik = useFormik({
        validationSchema: validationSchema,
        initialValues: {
            name: "",
            permissionsId: "",
            description: "",
             
        },

        onSubmit: async (data) => {
            
            // setLoading(true);
            // setloadingIcon("pi pi-spin pi-spinner");
            if(data['permissionsId'].length===0){
                data['permissionsId']="";
            }
            if (editable === true) {
                data["roleId"] = UsersRowData;
                const res = await dispatch(handlePatchRequest(data, "api/v1/role/", true, true));
                if (res?.status === 200) {
                    await getRoleData();
                    formik.resetForm();
                    onHide();
                }
            } else {
                const res = await dispatch(handlePostRequest(data, "api/v1/role/", true, true));
                if (res?.status === 200) {
                    await getRoleData();
                    formik.resetForm();
                    onHide();
                }
            }
            // setLoading(false);
            // setloadingIcon("pi pi-save");
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
            {loading ? (
                <ProgressSpinner style={{ display: "flex", justifyContent: "center", alignItem: "center", height: "50vh" }} strokeWidth="2" stroke-miterlimit="10" />
            ) : (
                <form onSubmit={formik.handleSubmit}>
                    <div className="grid p-p-3">
                        <div className="col-12 md:col-12 lg:col-12 xl:col-12">
                            <div className="flex flex-column">
                                <label className="mb-2">Role</label>
                                <InputText keyfilter="alpha" maxLength={25} placeholder="Enter Role" id="name" name="name" value={formik?.values?.name?.replace(/\s\s+/g, " ")} onChange={formik.handleChange} className={classNames({ "p-invalid": isFormFieldValid("name") }, "w-full md:w-10 inputClass")} />
                                {getFormErrorMessage("name")}
                            </div>
                        </div>
                        <div className="col-12 md:col-12 lg:col-12 xl:col-12">
                            <div className="flex flex-column">
                                <label className="mb-2">Permissions</label>
                                <MultiSelect
                                            
                                            id="permissionsId"  
                                            name="permissionsId"
                                            placeholder="Select Permissions"
                                            options={userPermissions}
                                            optionLabel="name"
                                            optionValue="_id"
                                            value={formik.values.permissionsId}
                                            onChange={(e) => {
                                                formik.handleChange(e);
                                                setSelectPermissionValue(e.value);
                                                
                                            }}
                                       
                                            className={classNames({ "p-invalid": isFormFieldValid("permissionsId") },"w-full md:w-10 inputClass" )}
                                            
                                        
                                        />
                                    {getFormErrorMessage("permissionsId")}
                            </div>
                        </div>
                        <div className="col-12 md:col-12 lg:col-12 xl:col-12">
                            <div className="flex flex-column">
                                <label className="mb-2">Description</label>
                                <InputTextarea placeholder="Enter Description" id="description" name="description" value={formik?.values?.description?.replace(/\s\s+/g, " ")} onChange={formik.handleChange} className={classNames({ "p-invalid": isFormFieldValid("description") }, "w-full md:w-10 inputClass")} />
                                {getFormErrorMessage("description")}
                            </div>
                        </div>
                        
                            <div className="col-12 text-center">
                                <Button label="Cancel" onClick={(e) => handleCancel(e)}  className="Cancelbtn p-mr-3" />
                                <Button disabled={loading} iconPos="right" label={editable ? "Update" : "Save"} autoFocus className="Savebtn p-mr-3" />
                            </div>
                       
                    </div>
                </form>
            )}
        </>
    );
};

export default AddEditRoles;
