import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { Link } from "react-router-dom";
import {  confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { handleGetRequest } from "../../service/GetTemplate";
import { handleDeleteRequest } from "../../service/DeleteTemplete";
import { useDispatch } from "react-redux";
import Moment from "moment";
import { Sidebar } from "primereact/sidebar";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import { FilterMatchMode } from "primereact/api";
import { Formik, useFormik } from "formik";
import { InputText } from "primereact/inputtext";

// import AddEditProduct from "./AddEditProduct"


const AssignRole = () => {

    const dispatch = useDispatch();
    const [loading, setloading] = useState(false);  
    
    
    const validationSchema = Yup.object().shape({
        name: Yup.string().required("This field is required."),
        description: Yup.string().required("This field is required.").nullable(),
    });

    const formik = useFormik({
        validationSchema: validationSchema,
        initialValues: {
            customerName: "",
            address: "",
            contact: "",

            // permissionsId: "",
        },


        onSubmit: async (data) => {
        
        },
    });


    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };
 
    return (
        <>
            <form onSubmit={formik.handleSubmit}>
                    <div className="card headr_bg">
                        <div className="card-header">
                            <label>DETAILS</label>
                        </div>
                        <div className="card-body">
                            <div className="grid">
                                <div className="col-12 md:col-12 xl:col-12 lg:col-12 pt-3 pb-3">
                                    <label>
                                        <b> Customer Details</b>
                                    </label>
                                </div>
                            
                                <div className="col-12 md:col-4 xl:col-4 lg:col-4">
                                    <div className="flex flex-column">
                                        <label className="mb-2">Delivery Address</label>
                                        <InputText  id="address" name="address" value={Formik?.values?.address} type="text" placeholder="Enter" className="w-full md:w-10 inputClass" />
                                    </div>
                                </div>
                                
                            </div>
                            <div className="grid">
                                <div className="col-12 text-center pt-4">
                                    <Button label="Cancel" onClick= "" className="Cancelbtn p-mr-3" />
                                    <Button autoFocus className="Savebtn" label="Process" onClick="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
        </>
    );
};

export default AssignRole;
