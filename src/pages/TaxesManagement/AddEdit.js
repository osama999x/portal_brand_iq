import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { useFormik } from "formik";
import * as Yup from "yup";
import { classNames } from 'primereact/utils';
import { Button } from 'primereact/button';
import { handlePatchRequest } from '../../service/PatchTemplete';
import { handlePostRequest } from '../../service/PostTemplate';
import { useDispatch } from "react-redux";
import { handleGetRequest } from '../../service/GetTemplate';


const AddEdit = ({ addEditTax, getTaxpData, TaxRowData, onHide }) => {
    const [loading, setloading] = useState(false);
    const [taxTypee, setTaxType] = useState();
    const dispatch = useDispatch();
    const validationSchema = Yup.object().shape({
        taxTypeId: Yup.mixed().required("This field is required."),
        taxHead: Yup.mixed().required("This field is required."),
        description: Yup.mixed().required("This field is required."),
    });
    const formik = useFormik({
        validationSchema: validationSchema,
        initialValues: {
            taxTypeId: "",
            taxHead: "",
            description: "",
        },
        onSubmit: async (data) => {
            //setloading(true);
            if (addEditTax === true) {
                data["taxTypeId"] = TaxRowData;
                data["taxHeadId"] = TaxRowData;
                data["taxHead"] = TaxRowData;
                const res = await dispatch(handlePatchRequest(data, "api/v1/tax/type", true, true));
                
                if (res.status === 200) {
                    await getTaxpData();
                }
                onHide();
            } else {
            
                
               
                const res = await dispatch(handlePostRequest(data, "api/v1/tax/head", true, true));
            
                if (res?.status === 200 || res?.status === 201) {
                    await getTaxpData();
                }
            }
            onHide();
        }

    });

    const getTaxList = async () => {
        const res = await handleGetRequest("api/v1/tax/type", false);
        if (res) {
            setTaxType(res);
        }
    }
    useEffect(() => {
        getTaxList();
    }, []);

    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };

    useEffect(() => {
        if (TaxRowData !== undefined && TaxRowData !== null && addEditTax === true) {
            //getTaxByID();
            getHeadByID();
        }

    }, []);

    // const getTaxByID = async () => {
    //     //const data = {};
    //     //data["taxType"] = TaxRowData;
    //     const res = await handleGetRequest(`api/v1/tax/type/getOne?taxTypeId=${TaxRowData}`, true);
    //     setloading(false);
    //     if(res){
    //     const keyData = res;
    //     Object.keys(keyData).forEach((key) => {
    //         if (formik.initialValues.hasOwnProperty(key)) {
    //             formik.setFieldValue(key, keyData[key]);
    //         }
    //     });
    // }
    // }
    const getHeadByID = async () => {
        //const data = {};
        //data["_Id"] = TaxRowData;
        const res = await handleGetRequest(`api/v1/tax/head/getOne?taxHeadId=${TaxRowData}`, true);
        setloading(false);
        if (res) {
            const keyData = res;
            Object.keys(keyData).forEach((key) => {
                if (formik.initialValues.hasOwnProperty(key)) {
                    formik.setFieldValue(key, keyData[key]);
                }
            });
        }
    }

    return (
        <div>
            <form onSubmit={formik.handleSubmit}>
                <div className="grid p-p-3">
                    <div className="col-12 md:col-12 lg:col-12 xs:col-12">
                        <div className="flex flex-column">
                            <label className="mb-2">Tax Type</label>
                            <Dropdown name="taxTypeId"
                                id="taxTypeId"
                                className={classNames({ "p-invalid": isFormFieldValid("taxTypeId") }, "w-full md:w-10 inputClass")}
                                value={formik.values.taxTypeId}
                                options={taxTypee}
                                optionLabel="taxType"
                                optionValue="_id"
                                onChange={formik.handleChange} />
                            {getFormErrorMessage("taxTypeId")}
                        </div>
                    </div>
                    <div className="col-12 md:col-12 lg:col-12 xs:col-12">
                        <div className="flex flex-column">
                            <label className="mb-2">Tax Head</label>
                            <InputText name='taxHead'
                                id='taxHead'
                                type="text"
                                className={classNames({ "p-invalid": isFormFieldValid("taxHead") }, "w-full md:w-10 inputClass")}
                                value={formik.values.taxHead}
                                onChange={formik.handleChange} />
                            {getFormErrorMessage("taxHead")}
                        </div>
                    </div>
                    <div className="col-12 md:col-12 lg:col-12 xs:col-12">
                        <div className="flex flex-column">
                            <label className="mb-2">Description</label>
                            <InputText name='description'
                                id='description'
                                type="text"
                                className={classNames({ "p-invalid": isFormFieldValid("description") }, "w-full md:w-10 inputClass")}
                                value={formik.values.description}
                                onChange={formik.handleChange} />
                            {getFormErrorMessage("description")}
                        </div>
                    </div>
                    <div className="col-12 md:col-12 xl:col-12 lg:col-12 text-center">
                        <Button label="Cancel" onClick={onHide} type="button" className="Cancelbtn p-mr-3" />
                        <Button
                            autoFocus
                            className="Savebtn"
                            label={addEditTax ? "Update" : "Save"}
                            type="submit"
                        />
                    </div>
                </div>
            </form>
        </div>
    );
}

export default AddEdit;
