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
import { InputTextarea } from 'primereact/inputtextarea';

const AddEdit = ({ addEditTax, getTaxpData, TaxRowData, onHide }) => {
    // const [loading, setloading] = useState(false);
    const [taxTypeData, setTaxTypeData] = useState()
    //const [taxType, setTaxType] = useState("");
    const [selectedTaxType, setSelectedTaxType] = useState("")
    const [taxHead, setTaxHead] = useState("")
    const [description, setDescription] = useState("")

    useEffect(() => {
        getTaxList();
        if (addEditTax == true) {
            getHeadByID();

        }

    }, []);
    const getTaxList = async () => {
        const res = await handleGetRequest("api/v1/tax/type", false);
        if (res) {
            setTaxTypeData(res);
        }
    }
    const getHeadByID = async () => {
        //const data = {};
        //data["_id"] = TaxRowData;
        const res = await handleGetRequest(`api/v1/tax/head/getOne?taxHeadId=${TaxRowData}`, true);
    
        setTaxHead(res.taxHead)
        setSelectedTaxType(res.taxType._id)
        setDescription(res?.description)

    
    }




    const dispatch = useDispatch();
    const validationSchema = Yup.object().shape({
        taxTypeId: Yup.mixed().required("This field is required."),
        taxHead: Yup.mixed().required("This field is required."),
        description: Yup.mixed().required("This field is required."),
    });
    const formik = useFormik({
        validationSchema: validationSchema,
        initialValues: {
            taxTypeId: selectedTaxType,
            taxHead: taxHead,
            description: description,
        },
        enableReinitialize: true,
        onSubmit: async (data) => {
            //setloading(true);
            if (addEditTax === true) {

                
                data["taxHeadId"] = TaxRowData;
                //data["taxHeadId"] = TaxRowData;
                //data["taxHead"] = TaxRowData;
                const res = await dispatch(handlePatchRequest(data, "api/v1/tax/head", true, true));

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



    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };





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
                                options={taxTypeData}
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
                            keyfilter={/^[0-9!@#$%^&*]+$/}
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
                            <InputTextarea name='description'
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
