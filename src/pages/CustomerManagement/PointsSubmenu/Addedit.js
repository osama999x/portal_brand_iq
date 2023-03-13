import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import * as Yup from "yup";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { handleGetRequest } from "../../../service/GetTemplate";
import { handlePostRequest } from "../../../service/PostTemplate";
import { handlePatchRequest } from "../../../service/PatchTemplete";
import { classNames } from 'primereact/utils';
import { Button } from 'primereact/button';

const Addedit = ({ onHide, getPointdata, addeditable, pointRowData }) => {
    const [loading, setloading] = useState(false); 
    const dispatch = useDispatch();
    const getMembersByID = async () => {
        const data = {};
        data["pointManageId"] = pointRowData;
        const res = await handleGetRequest(`api/v1/pointManage/getOne?pointId=${pointRowData}`, true);
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
    useEffect(() => {
        if (pointRowData !== undefined && pointRowData !== null && addeditable === true) {
            getMembersByID();
        };

    }, []);

    const validationSchema = Yup.object().shape({
        initialPoint: Yup.mixed().required("This field is required."),
        pointOrderPrice: Yup.mixed().required("This field is required."),
        pointPerOrder: Yup.mixed().required("This field is required."),

    });
    const formik = useFormik({
        validationSchema: validationSchema,
        initialValues: {
            initialPoint: "",
            pointOrderPrice: "",
            pointPerOrder: "",
        },
        onSubmit: async (data) => {
            if (addeditable === true) {
                data["pointManageId"] = pointRowData;
                const res = await dispatch(handlePatchRequest(data, "api/v1/pointManage", true, true));
                if (res.status === 200) {
                    await getPointdata();
                }
                onHide();
            } else {
                data["pointManageId"] = pointRowData;
                const res = await dispatch(handlePostRequest(data, "api/v1/pointManage", true, true));
                if (res?.status === 200 || res?.status === 201) {
                    await getPointdata();
                }
                onHide();
            }
        },
    });

    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };

    return (
        <form  onSubmit={formik.handleSubmit}>
            <div className="grid p-p-3">

                <div className="col-12 md:col-12 lg:col-12 xl:col-12">
                    <div className="flex flex-column">
                        <label className="mb-2">SignUp Point</label>
                        <InputText
                            name='initialPoint'
                            id='initialPoint'
                            keyfilter="int"
                            className={classNames({ "p-invalid": isFormFieldValid("initialPoint") }, "w-full md:w-10 inputClass")}
                            value={formik.values.initialPoint}
                            onChange={formik.handleChange}
                            placeholder=""
                        />
                    </div>
                    {getFormErrorMessage("initialPoint")}
                </div>

                <div className="col-12 md:col-12 lg:col-12 xl:col-12">
                    <div className="flex flex-column">
                        <label className="mb-2">Order Price</label>
                        <InputText
                            name='pointOrderPrice'
                            id='pointOrderPrice'
                            keyfilter="int"
                            className={classNames({ "p-invalid": isFormFieldValid("pointOrderPrice") }, "w-full md:w-10 inputClass")}
                            value={formik.values.pointOrderPrice}
                            onChange={formik.handleChange}
                            placeholder=""
                        />
                    </div>
                    {getFormErrorMessage("pointOrderPrice")}
                </div>

                <div className="col-12 md:col-12 lg:col-12 xl:col-12">
                    <div className="flex flex-column">
                        <label className="mb-2">Points Per Order</label>
                        <InputText
                            name='pointPerOrder'
                            id='pointPerOrder'
                            keyfilter="int"
                            className={classNames({ "p-invalid": isFormFieldValid("pointPerOrder") }, "w-full md:w-10 inputClass")}
                            value={formik.values.pointPerOrder}
                            onChange={formik.handleChange}
                            placeholder=""
                        />
                    </div>
                    {getFormErrorMessage("pointPerOrder")}
                </div>
                <div className="col-12 md:col-12 xl:col-12 lg:col-12 text-center">
                    <Button
                        label="Cancel"
                        onClick={onHide}
                        type="button"
                        className="Cancelbtn p-mr-3"
                    />
                    <Button
                        // autoFocus
                        className="Savebtn"
                        label={addeditable ? "Update" : "Save"}
                        disabled={loading}
                        type="submit"
                    />
                </div>
            </div>
        </form>
    );
}

export default Addedit;
