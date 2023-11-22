import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import * as Yup from "yup";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { handleGetRequest } from '../../service/GetTemplate';
import { handlePatchRequest } from '../../service/PatchTemplete';
import { classNames } from 'primereact/utils';
import { Button } from 'primereact/button';
import MultiImage from '../../components/MultiImage';
import moment from 'moment';
import { handlePostRequest } from '../../service/PostTemplate';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar'
import AddEditImage from '../../components/AddEditImage';
import ImageUpload from '../../components/ImageUpload';
import { toast } from 'react-toastify';
//import { current } from '@reduxjs/toolkit';
//import AddEditImage from '../../components/AddEditImage';

const AddEditCampaign = ({ onHide, getCampigndata, addEditCampign, campignRowData }) => {

    const [loading, setloading] = useState(false);


    // const [statusoption, setstatusoption] = useState(false);
    const [fileUploadData, setfileUploadData] = useState("");
    const dispatch = useDispatch();




    const getCampignByID = async () => {
        //const data = {};
        // data["couponId"] = coupanRowData;
        const res = await handleGetRequest(`api/v1/promotion/getOneCampaign?campaignId=${campignRowData}`, true);


        setloading(false);
        if (res) {

            const keyData = res;

            formik.setFieldValue("campaignName", keyData.campaignName);
            formik.setFieldValue("description", keyData.description);
            formik.setFieldValue("banner", keyData.banner);

            formik.setFieldValue("activeFrom", moment(keyData.activeFrom).toDate());
            formik.setFieldValue("activeTo", moment(keyData.activeTo).toDate());

            // formik.setFieldValue("activeTo", new Date(keyData.activeTo));


            //     Object.keys(keyData).forEach((key) => {
            //         if (formik.initialValues.hasOwnProperty(key)) {

            //             formik.setFieldValue(key, keyData[key]);
            //         }
            //     });
        }
    }

    const validationSchema = Yup.object().shape({
        // campaignName: Yup.string().required("This field is required"),
        // description: Yup.string().required("This field is required."),
        // activeFrom: Yup.string().required("This field is required"),
        // activeTo: Yup.mixed().required("This field is required."),




    });
    const formik = useFormik({
        validationSchema: validationSchema,
        initialValues: {
            campaignName: "",
            description: "",
            banner: "",
            activeFrom: "",
            activeTo: ""


        },
        onSubmit: async (data) => {
            if (addEditCampign === true) {
                data["banner"] = fileUploadData;
                data["campaignId"] = campignRowData;


                const res = await dispatch(handlePatchRequest(data, "api/v1/promotion/", true, true));

                if (res.status === 200) {
                    await getCampigndata();
                    formik.resetForm();
                    onHide();
                }

            } else {
                data["banner"] = fileUploadData;



                const res = await dispatch(handlePostRequest(data, "api/v1/promotion/", true, true));

                if (res?.status === 200 || res?.status === 201) {
                    await getCampigndata();
                    formik.resetForm();
                    onHide();
                }

            }
        },
    });

    // const disabledPastDate = () => {
    //     const activeFrom = new Date();
    //     const dd = String(activeFrom.getDate() + 1).padStart(2, "0");
    //     const mm = String(activeFrom.getMonth() + 1).padStart(2, "0");
    //     const YYYY = activeFrom.getFullYear();
    //     return YYYY + "-" + mm + "-" + dd;

    // }



    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };
    useEffect(() => {
        if (campignRowData !== undefined && campignRowData !== null && addEditCampign === true) {
            getCampignByID();
        };

    }, []);

    const handleImages = (images) => {
        setfileUploadData(images);
    };

    //     useEffect(() => {
    //         if(formik.values.activeFrom !== addEditCampign){

    //             formik.values.activeFrom = moment(formik.values.activeFrom).format("YYYY-MM-DD h:mm A")
    //         }

    //     }, [formik.values.activeFrom ]);


    return (
        <div>

            <form onSubmit={formik.handleSubmit}>
                <div className="grid">
                    <div className="col-12 md:col-12 lg:col-12 xs:col-12">
                        <div className="flex flex-column">
                            <label className="mb-2">Campaign Name</label>
                            <InputText
                                name='campaignName'
                                id='campaignName'
                                className={classNames({ "p-invalid": isFormFieldValid("campaignName") }, "w-full md:w-10 inputClass")}
                                value={formik.values.campaignName}
                                onChange={formik.handleChange}
                                placeholder="Enter Campaign Name"
                                maxLength={25}
                            />
                        </div>
                        {getFormErrorMessage("campaignName")}
                    </div>
                    <div className="col-12 md:col-12 lg:col-12 xs:col-12">
                        <div className="flex flex-column">
                            <label className="mb-2">Description</label>
                            <InputTextarea
                                rows={5} cols={30}
                                name="description"
                                id="description"
                                className={classNames({ "p-invalid": isFormFieldValid("description") }, "w-full md:w-10 inputClass")}
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                placeholder="Enter Description"
                            />
                        </div>
                        {getFormErrorMessage("description")}
                    </div>
                    <div className="col-12 md:col-12 lg:col-12 xl:col-12">
                        <div className="flex flex-column">
                            <label className="mb-2">Banner</label>
                            <AddEditImage handleImages={handleImages} editable={addEditCampign} EditIconImage={formik?.values?.banner} />
                        </div>
                    </div>

                    <div className="col-12 md:col-12 lg:col-12 xs:col-12">
                        <div className="flex flex-column">
                            <label htmlFor="activeFrom">Active From</label>
                            <Calendar
                                id="activeFrom"
                                name="activeFrom"
                                value={formik.values.activeFrom}

                                onChange={formik.handleChange}
                                className={classNames({ "p-invalid": isFormFieldValid("activeFrom") }, "w-full md:w-10 inputClass")}
                                // optionlabel="name"
                                showTime hourFormat="12"
                            />
                        </div>
                        {getFormErrorMessage("activeFrom")}
                    </div>
                    <div className="col-12 md:col-12 lg:col-12 xs:col-12">
                        <div className="flex flex-column">
                            <label htmlFor="fromDate">Active To</label>
                            <Calendar
                                id="activeTo"
                                name="activeTo"
                                value={formik.values.activeTo}
                                onChange={(e) => {
                                    if (moment(e.target.value, "MM/DD/YYYY").isBefore(moment(formik.values.activeFrom, 'MM/DD/YYYY'))) {
                                        toast.warn("Unable to select past date")
                                        return
                                    } formik.setFieldValue('activeTo', e.value)
                                }}
                                // onChange={(e) => formik.setFieldValue('activeTo', e.value)}
                                className={classNames({ "p-invalid": isFormFieldValid("activeTo") }, "w-full md:w-10 inputClass")}
                                optionlabel="name"
                                type="date"
                                min={formik.values.activeFrom}
                                showTime hourFormat="12"
                            />
                        </div>
                        {getFormErrorMessage("activeTo")}
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
                            label={addEditCampign ? "Update" : "Save"}
                            disabled={loading}
                            type="submit"
                        />
                    </div>
                </div>

            </form>


        </div>
    );
}

export default AddEditCampaign;
