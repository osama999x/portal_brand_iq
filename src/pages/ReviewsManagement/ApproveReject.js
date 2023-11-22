import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import * as Yup from "yup";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { handleGetRequest } from "../../service/GetTemplate";
import { handlePatchRequest } from "../../service/PatchTemplete";
import { classNames } from 'primereact/utils';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';

const ApproveReject = ({ onHide, getReviewsData, reviewsRowData, apprejdata }) => {
    const [loading, setLoading] = useState('');
    const dispatch = useDispatch();
    const getMembersByID = async () => {
        const data = {};
        data["reviewId"] = reviewsRowData;
        const res = await handleGetRequest(`api/v1/review/customerReviewDetails?reviewId=${reviewsRowData}`, true);

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
        if (reviewsRowData !== undefined && reviewsRowData !== null && apprejdata === true) {
            getMembersByID();
        };

    }, []);

    const validationSchema = Yup.object().shape({
        //customerName: Yup.mixed().required("This field is required."),
        //comment: Yup.mixed().required("This field is required."),
        isApproved: Yup.mixed().required("This field is required."),


    });
    const formik = useFormik({
        validationSchema: validationSchema,
        initialValues: {
            // customerName: "",
            // comment: "",
            isApproved: reviewsRowData,
        },
        onSubmit: async (data) => {
            if (apprejdata === true) {

                data["reviewId"] = reviewsRowData;

                setLoading(true);
                const res = await dispatch(handlePatchRequest(data, "api/v1/review/approvedReview", true, true));
                if (res?.status === 200) {
                    await getReviewsData();
                }
                setLoading(false);
                onHide();
            } else {

            }
        },
    });

    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };
    const statusOption = [
        { name: 'Approve', isApproved: true },
        { name: 'Reject', isApproved: false },
    ];

    return (
        <form onSubmit={formik.handleSubmit}>
            <div className="grid p-p-3">

                <div className="col-12 md:col-12 lg:col-12 xs:col-12">
                    <div className="flex flex-column">
                        <label className="mb-2">Status</label>
                        <Dropdown
                            id="isApproved"
                            name="isApproved"
                            value={formik.values.isApproved}
                            onChange={formik.handleChange}
                            className={classNames({ "p-invalid": isFormFieldValid("isApproved") }, "w-full md:w-10 inputClass")}
                            options={statusOption}
                            optionLabel="name"
                            optionValue="isApproved"
                        />
                    </div>
                    {getFormErrorMessage("isApproved")}
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
                        label={apprejdata ? "Save" : ""}
                        disabled={loading}
                        type="submit"
                    />
                </div>
            </div>
        </form>
    );
}

export default ApproveReject;
