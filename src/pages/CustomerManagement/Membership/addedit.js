/* eslint-disable react-hooks/rules-of-hooks */
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

const addedit = ({ addEditMember, getMembershipData, MemberRowData, onHide }) => {
    const [loading, setloading] = useState(false);
    const dispatch = useDispatch();
    const validationSchema = Yup.object().shape({
        membershipCategory: Yup.mixed().required("This field is required."),
        thresholdFrom: Yup.mixed().required("This field is required."),
        thresholdTo: Yup.mixed().required("This field is required."),
    });
    const formik = useFormik({
        validationSchema: validationSchema,
        initialValues: {
            membershipCategory: "",
            thresholdFrom: "",
            thresholdTo: "",
        },
        onSubmit: async (data) => {
            setloading(true);
            if (addEditMember === true) {
                data["membershipId"] = MemberRowData;
                const res = await dispatch(handlePatchRequest(data, "api/v1/membership/", true, true));
                if (res?.status === 200 || res?.status === 201) {
                    await getMembershipData();
                }
                onHide();
            } else {
                const res = await dispatch(handlePostRequest(data, "api/v1/membership/", true, true));
                if (res?.status === 200 || res?.status === 201) {
                    await getMembershipData();
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
        if (MemberRowData !== undefined && MemberRowData !== null && addEditMember === true) {
            getMembersByID();
        }

    }, []);

    const getMembersByID = async () => {
        const res = await handleGetRequest(`api/v1/membership/getOne?membershipId=${MemberRowData}`, true);
        const keyData = res;
        setloading(false);
        Object.keys(keyData).forEach((key) => {
            if (formik.initialValues.hasOwnProperty(key)) {
                formik.setFieldValue(key, keyData[key]);
            }
        });
    }

    return (
        <div>
            <form onSubmit={formik.handleSubmit}>
                <div className="grid p-p-3">
                    <div className="col-12 md:col-12 xl:col-12 lg:col-12">
                        <div className="flex flex-column">
                            <label className="mb-2">Membership Category</label>
                            <InputText
                                name='membershipCategory'
                                id='membershipCategory'
                                type="text"
                                className={classNames({ "p-invalid": isFormFieldValid("membershipCategory") }, "w-full md:w-10 inputClass")}
                                placeholder=""
                                value={formik.values.membershipCategory}
                                onChange={formik.handleChange}
                            />
                        </div>
                        {getFormErrorMessage("membershipCategory")}
                    </div>
                    <div className="col-12 md:col-12 xl:col-12 lg:col-12">
                        <div className="flex flex-column">
                            <label className="mb-2">Threshold</label>
                        </div>
                    </div>
                    <div className="innr_padding mb-3 col-12 md:col-12 xl:col-12 lg:col-12">
                        <div className="col-12 md:col-12 xl:col-12 lg:col-12">
                            <div className="flex flex-column">
                                <label className="mb-2">From Points</label>
                                <InputText
                                    name='thresholdFrom'
                                    id='thresholdFrom'
                                    type="text"
                                    className={classNames({ "p-invalid": isFormFieldValid("thresholdFrom") }, "w-full md:w-10 inputClass")}
                                    value={formik.values.thresholdFrom}
                                    onChange={formik.handleChange}
                                />
                            </div>
                            {getFormErrorMessage("thresholdFrom")}
                        </div>
                        <div className="col-12 md:col-12 xl:col-12 lg:col-12">
                            <div className="flex flex-column">
                                <label className="mb-2">To Points</label>
                                <InputText name='thresholdTo' id='thresholdTo' type="text" className={classNames({ "p-invalid": isFormFieldValid("thresholdTo") }, "w-full md:w-10 inputClass")} value={formik.values.thresholdTo} onChange={formik.handleChange} />
                            </div>
                            {getFormErrorMessage("thresholdTo")}
                        </div>

                    </div>
                    <div className="col-12 md:col-12 xl:col-12 lg:col-12 text-center">
                        <Button label="Cancel" onClick={onHide} type="button" className="Cancelbtn p-mr-3" />
                        <Button
                            autoFocus
                            className="Savebtn"
                            label={addEditMember ? "Update" : "Save"}
                            disabled={loading}
                        />
                    </div>
                </div>
            </form>
        </div>
    );
}
export default addedit;
