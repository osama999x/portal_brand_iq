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
import AddEditImage from "../../../components/AddEditImage";
import { Dropdown } from 'primereact/dropdown';

const Addedit = ({ onHide, getCoupandata, addEditCoupan, coupanRowData }) => {

    const [loading, setloading] = useState(false);
    // const [statusoption, setstatusoption] = useState(false);
    const [fileUploadData, setfileUploadData] = useState("");
    const dispatch = useDispatch();
    const getMembersByID = async () => {
        const data = {};
        data["coupanId"] = coupanRowData;
        const res = await handleGetRequest(`api/v1/coupan/getOne?coupanId=${coupanRowData}`, true);
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

    const validationSchema = Yup.object().shape({
        coupanCode: Yup.mixed().required("This field is required."),
        coupanValue: Yup.mixed().required("This field is required."),
        activeFrom: Yup.mixed().required("This field is required."),
        activeTo: Yup.mixed().required("This field is required."),
        isActive: Yup.mixed().required("This field is required."),
        // image: Yup.mixed().required("This field is required."),

    });
    const formik = useFormik({
        validationSchema: validationSchema,
        initialValues: {
            coupanCode: "",
            coupanValue: "",
            activeFrom: "",
            activeTo: "",
            isActive: "",
            image: ""
        },
        onSubmit: async (data) => {
            if (addEditCoupan === true) {
                data["image"] = fileUploadData;
                data["coupanId"] = coupanRowData;
                const res = await dispatch(handlePatchRequest(data, "api/v1/coupan", true, true));
                if (res.status === 200) {
                    await getCoupandata();
                }
                onHide();
            } else {
                data["image"] = fileUploadData;
                data["coupanId"] = coupanRowData;
                const res = await dispatch(handlePostRequest(data, "api/v1/coupan", true, true));
                // console.log("Coupan Add Response", res);
                if (res?.status === 200 || res?.status === 201) {
                    await getCoupandata();
                }
                onHide();
            }
        },
    });

    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };
    useEffect(() => {
        if (coupanRowData !== undefined && coupanRowData !== null && addEditCoupan === true) {
            getMembersByID();
        };

    }, []);

    const handleImages = (images) => {
        setfileUploadData(images);
    };
    const statusOption = [
        { name: 'Active', status: true },
        { name: 'InActive', status: false },
    ];

    return (
        <div>

            <form onSubmit={formik.handleSubmit}>
                <div className="grid">
                    <div className="col-12 md:col-12 lg:col-12 xl:col-12">
                        <div className="flex flex-column">
                            <label className="mb-2">Upload Voucher</label>
                            <AddEditImage handleImages={handleImages} editable={addEditCoupan} EditIconImage={formik?.values?.image} />
                        </div>
                    </div>
                    <div className="col-12 md:col-12 lg:col-12 xs:col-12">
                        <div className="flex flex-column">
                            <label className="mb-2">Coupan Code</label>
                            <InputText
                                name='coupanCode'
                                id='coupanCode'
                                keyfilter="int"
                                className={classNames({ "p-invalid": isFormFieldValid("coupanCode") }, "w-full md:w-10 inputClass")}
                                value={formik.values.coupanCode}
                                onChange={formik.handleChange}
                                placeholder=""
                            />
                        </div>
                        {getFormErrorMessage("coupanCode")}
                    </div>
                    <div className="col-12 md:col-12 lg:col-12 xs:col-12">
                        <div className="flex flex-column">
                            <label htmlFor="fromDate"> From Date</label>
                            <InputText
                                id="activeFrom"
                                name="activeFrom"
                                value={formik.values.activeFrom.split('T')[0]}
                                onChange={formik.handleChange}
                                className={classNames({ "p-invalid": isFormFieldValid("activeFrom") }, "w-full md:w-10 inputClass")}
                                optionlabel="name"
                                type="date"
                            />
                        </div>
                        {getFormErrorMessage("activeFrom")}
                    </div>
                    <div className="col-12 md:col-12 lg:col-12 xs:col-12">
                        <div className="flex flex-column">
                            <label htmlFor="fromDate"> To Date</label>
                            <InputText
                                id="activeTo"
                                name="activeTo"
                                value={formik.values.activeTo.split('T')[0]}
                                onChange={formik.handleChange}
                                className={classNames({ "p-invalid": isFormFieldValid("activeTo") }, "w-full md:w-10 inputClass")}
                                optionlabel="name"
                                type="date"
                            />

                        </div>
                        {getFormErrorMessage("activeTo")}
                    </div>
                    <div className="col-12 md:col-12 lg:col-12 xs:col-12">
                        <div className="flex flex-column">
                            <label className="mb-2">Status</label>
                            <Dropdown
                                id="isActive"
                                name="isActive"
                                value={formik.values.isActive}
                                onChange={formik.handleChange}
                                className={classNames({ "p-invalid": isFormFieldValid("isActive") }, "w-full md:w-10 inputClass")}
                                options={statusOption}
                                optionLabel="name"
                                optionValue="status"
                            />
                        </div>
                        {getFormErrorMessage("isActive")}
                    </div>
                    <div className="col-12 flex innr_padding">
                        <div className="col-12 md:col-12 lg:col-12 xs:col-12">
                            <div className="flex flex-column">
                                <label className="mb-2">Coupan Value </label>
                                <InputText
                                    name='coupanValue'
                                    id='coupanValue'
                                    type="number"
                                    className={classNames({ "p-invalid": isFormFieldValid("coupanValue") }, "w-full md:w-10 inputClass")}
                                    value={formik.values.coupanValue}
                                    onChange={formik.handleChange}
                                />
                            </div>
                            {getFormErrorMessage("coupanValue")}
                        </div>
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
                            label={addEditCoupan ? "Update" : "Save"}
                            disabled={loading}
                            type="submit"
                        />
                    </div>
                </div>

            </form>


        </div>
    );
}

export default Addedit;
