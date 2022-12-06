import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { useFormik } from "formik";
import * as Yup from "yup";
import { classNames } from 'primereact/utils';
import { Button } from 'primereact/button';
import { handlePostRequest } from '../../service/PostTemplate';
import { useDispatch } from "react-redux";



const AddEdit = ({ addEditTaxType, getTaxTypeData, onHide, TaxRowData }) => {
    const [loading, setloading] = useState(false);
    const [taxType, setTaxType] = useState();
    const dispatch = useDispatch();
    const validationSchema = Yup.object().shape({
        taxType: Yup.mixed().required("This field is required."),

    });
    const formik = useFormik({
        validationSchema: validationSchema,
        initialValues: {
            taxType: "",

        },
        onSubmit: async (data) => {
            //setloading(true);
            // if (addEditTaxType === true) {
            //data["taxHeadId"] = TaxRowData;
            const res = await dispatch(handlePostRequest(data, "api/v1/tax/type", true, true));
            await getTaxTypeData(res);            
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
                            <InputText name="taxType"
                                id="taxType"
                                value={formik?.values?.taxType?.replace(/\s\s+/g, " ")}
                                onChange={formik.handleChange}
                                className={classNames({ "p-invalid": isFormFieldValid("taxType") }, "w-full md:w-10 inputClass")} />
                            {getFormErrorMessage("taxType")}
                        </div>
                    </div>


                    <div className="col-12 md:col-12 xl:col-12 lg:col-12 text-center">
                        <Button label="Cancel" onClick={onHide} type="button" className="Cancelbtn p-mr-3" />
                        <Button
                            onClick={onHide}
                            autoFocus
                            className="Savebtn"
                            label="Save"
                            //label={addEditTaxType ? "Update" : "Save"}
                            type="submit"
                        />
                    </div>
                </div>
            </form>
        </div>
    );
}

export default AddEdit;
