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
 import moment from "moment";
import { ProgressSpinner } from "primereact/progressspinner";
import { Checkbox } from "primereact/checkbox";

const AddEditDeal = ({ getUserData, onHide, editable, UsersRowData }) => {
    const [loading, setLoading] = useState(false);
    // const [loadingIcon, setloadingIcon] = useState("pi pi-save");
    const [sku, setSku] = useState("");
    const [product, setProductName] = useState("");
    const [quantity, setQuantityName] = useState("");
    const [userRoles, setUserRoles] = useState([]);
    const [userId, setUserId] = useState();


   
    const history = useHistory();
    const dispatch = useDispatch();


    const getUsersByID = async () => {
        const data = [{}];
        //data["userID"] = UsersRowData;
        setLoading(true);
        const res = await dispatch(handlePostRequest(data, "api/v1/dealsProduct/"));
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
        const res = await handleGetRequest("api/v1/dealsProduct/all", false);
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

        dealTitle: Yup.mixed()?.required("This field is required."),
        dealType: Yup.mixed()?.required("This field is required."),
        dealDescription: Yup.mixed()?.required("This field is required."),
        // activeFrom: Yup.mixed().required("This field is required."),
        // activeTo: Yup.mixed().required("This field is required."),
    });

    const formik = useFormik({
        validationSchema: validationSchema,
        initialValues: {
            dealTitle: "",
            dealType:"",
            dealDescription:"",
            // activeFrom:"",
            // activeTo
        },
        onSubmit: async (data) => {

            // setLoading(true);
            // setloadingIcon("pi pi-spin pi-spinner");
            if (editable === true) {

                data["dealId"] = UsersRowData;
                const res = await dispatch(handlePatchRequest(data, "api/v1/dealsProduct/", true, true));

                if (res?.status === 200) {
                    await getUserData();
                    formik.resetForm();
                    onHide();
                }
            } else {
                data["dealFrom"] = moment().format("YYYY/MM/DD")
                data["dealTo"] = moment().format("YYYY/MM/DD")
                data["buyDeal"] = [{ product, sku, quantity }]
                data["getDeal"] = [{ product, sku, quantity }]
                const res = await dispatch(handlePostRequest(data, "api/v1/dealsProduct/", true, true));

                if (res?.status === 200) {
                    setSku(res[0]?.variant[0]?.sku);
                    setProductName(res[0]?._id);
                    setQuantityName(res[0]?.variant[0]?.quantity);
                    await getUserData();
                    formik.resetForm();
                    onHide();
                }
            }
            // setLoading(false);
            // setloadingIcon("pi pi-save");
        },
    });

    const getProductdata = async () => {
        const res = await handleGetRequest("api/v1/products/all", false);
        
        if (res) {
            setSku(res[0]?.variant[0]?.sku);
            setProductName(res[0]?._id);
            setSku(res[0]?.variant[0]?.quantity);
          
        }
    };
    useEffect(() => {
        getProductdata();
    }, []);
    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };

    const handleCancel = (e) => {
        e.preventDefault();
        onHide();
    };
    const dealOption = [
        { name: 'Today', deal: 'today' },
        { name: 'Other', deal: 'other' },
    ];


    return (
        <>
            {
                loading ?
                    (
                        <ProgressSpinner style={{ display: "flex", justifyContent: "center", alignItem: "center", height: "50vh" }} strokeWidth="2" stroke-miterlimit="10" />
                    ) : (
                        <form onSubmit={formik.handleSubmit}>
                            <div className="grid p-p-3">
                                <div className="col-12 md:col-12 lg:col-12 xl:col-12">
                                    <div className="flex flex-column">
                                        <label className="mb-2">Deal Title</label>
                                        <InputText placeholder="Enter Title" id="dealTitle" name="dealTitle" value={formik?.values?.name?.replace(/\s\s+/g, " ")} onChange={formik.handleChange} className={classNames({ "p-invalid": isFormFieldValid("dealTitle") }, "w-full md:w-10 inputClass")} />
                                        {getFormErrorMessage("dealTitle")}
                                    </div>
                                </div>
                                <div className="col-12 md:col-12 lg:col-12 xl:col-12">
                                    <div className="flex flex-column">
                                        <label className="mb-2">Deal Type</label>
                                        <Dropdown
                                            id="dealType"
                                            name="dealType"
                                            value={formik.values.dealType}
                                            onChange={formik.handleChange}
                                            className={classNames({ "p-invalid": isFormFieldValid("dealType") }, "w-full md:w-10 inputClass")}
                                            options={dealOption}
                                            optionLabel="name"
                                            optionValue="deal"
                                        />
                                        {getFormErrorMessage("roleId")}
                                    </div>
                                </div>
                                <div className="col-12 md:col-12 lg:col-12 xl:col-12">
                                    <div className="flex flex-column">
                                        <label className="mb-2">Description</label>
                                        <InputText
                                            placeholder="Enter Description"
                                            id="dealDescription"
                                            name="dealDescription"
                                            value={formik?.values?.dealDescription?.replace(/\s\s+/g, " ")}
                                            onChange={formik.handleChange}
                                            className={classNames({ "p-invalid": isFormFieldValid("dealDescription") }, "w-full md:w-10 inputClass")}
                                        />
                                        {getFormErrorMessage("dealDescription")}
                                    </div>
                                </div>
                                <div className="col-12 md:col-6 lg:col-6 xl:col-6">
                                    <div className="flex flex-column">
                                        <label className="mb-2">Is Deal</label>
                                        <Checkbox id="isDeal" name="isDeal" inputId="binary" checked={formik?.values?.isDeal} onChange={formik.handleChange} />
                                        {getFormErrorMessage("isDeal")}
                                    </div>
                                </div> 
                                <div className="col-12 md:col-12 lg:col-12 xl:col-12">
                                    <div className="flex flex-column">
                                        <label className="mb-2">Buy Deal</label>
                                        <InputText
                                            
                                            
                                            disabled={editable}
                                            id="buyDeal"
                                            name="buyDeal"
                                            onChange={formik.handleChange}
                                            className={classNames({ "p-invalid": isFormFieldValid("buyDeal") }, "w-full md:w-10 inputClass")}
                                            value={formik?.values?.buyDeal}

                                        />
                                        {getFormErrorMessage("buyDeal")}
                                    </div> 
                                </div> 
                                 <div className="col-12 md:col-12 lg:col-12 xl:col-12">
                                    <div className="flex flex-column">  
                                        <label className="mb-2">Get Deal</label>
                                        <InputText


                                            disabled={editable}
                                            id="getDeal"
                                            name="getDeal"
                                            onChange={formik.handleChange}
                                            className={classNames({ "p-invalid": isFormFieldValid("getDeal") }, "w-full md:w-10 inputClass")}
                                            value={formik?.values?.getDeal}

                                        />
                                        {getFormErrorMessage("buyDeal")}
                                    </div>
                                </div>
                                <div className="col-12 md:col-12 lg:col-12 xs:col-12">
                                    <div className="flex flex-column">
                                        <label htmlFor="fromDate"> Deal From</label>
                                        <InputText
                                            id="dealFrom"
                                            name="dealFrom"
                                            //value={formik.values.dealFrom.split('T')[0]}
                                            onChange={formik.handleChange}
                                            className={classNames({ "p-invalid": isFormFieldValid("dealFrom") }, "w-full md:w-10 inputClass")}
                                            optionlabel="name"
                                            type="date"
                                        />
                                    </div>
                                    {getFormErrorMessage("dealFrom")}
                                </div>
                                <div className="col-12 md:col-12 lg:col-12 xs:col-12">
                                    <div className="flex flex-column">
                                        <label htmlFor="fromDate">Deal To</label>
                                        <InputText
                                            id="dealTo"
                                            name="dealTo"
                                            //value={formik.values.dealTo.split('T')[0]}
                                            onChange={formik.handleChange}
                                            className={classNames({ "p-invalid": isFormFieldValid("dealTo") }, "w-full md:w-10 inputClass")}
                                            optionlabel="name"
                                            type="date"
                                        />

                                    </div>
                                    {getFormErrorMessage("dealTo")}
                                </div>
                                 <div className="col-12 md:col-12 lg:col-12 xl:col-12">
                                    <div className="flex flex-column">
                                        <label className="mb-2">Discount</label>
                                        <InputText
                                            type="text"
                                            placeholder="Enter Contact Number"
                                            id="discount"
                                            name="discount"
                                            value={formik?.values?.discount}
                                            onChange={formik.handleChange}
                                            className={classNames({ "p-invalid": isFormFieldValid("discount") }, "w-full md:w-10 inputClass")}
                                            
                                        />
                                        {getFormErrorMessage("discount")}
                                    </div>
                                </div>

                                <div className="col-12 text-center">
                                    <Button label="Cancel" onClick={(e) => handleCancel(e)} className="Cancelbtn p-mr-3" />
                                    <Button disabled={loading} iconPos="right" label={editable ? "UPDATE" : "SAVE"} autoFocus className="Savebtn p-mr-3" />
                                </div>

                            </div>
                        </form>
                    )
            }
        </>
    );
};

export default AddEditDeal;
