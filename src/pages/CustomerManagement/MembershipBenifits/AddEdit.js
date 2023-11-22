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
import { InputTextarea } from 'primereact/inputtextarea';
// import { Dropdown } from 'primereact/dropdown';

const AddEdit = ({ onHide, getMemberBenifitdata, addeditable, benifitRowData }) => {

    const [loading, setloading] = useState(false);
    const [fileUploadData, setfileUploadData] = useState("");
    const [categoryOption, setCategoryOption] = useState([]);
    const dispatch = useDispatch();
    const getMembersByID = async () => {
        const data = {};
        data["membershipBenifitId"] = benifitRowData;
        const res = await handleGetRequest(`api/v1/membershipBenifit/getOne?membershipBenifitId=${benifitRowData}`, true);
        setloading(false);
        if (res) {
            const keyData = res;

            Object.keys(keyData).forEach((key) => {
                if (formik.initialValues.hasOwnProperty(key)) {
                    formik.setFieldValue(key, keyData[key]);
                }

                formik.setFieldValue("membershipCategory", res?.membershipCategory?._id)
            });
        }
    }

    const validationSchema = Yup.object().shape({
        membershipCategory: Yup.mixed().required("This field is required."),
        expireDate: Yup.mixed().required("This field is required."),
        description: Yup.mixed().required("This field is required."),
        label: Yup.mixed().required("This field is required."),
        // image: Yup.mixed().required("This field is required."),

    });
    const formik = useFormik({
        validationSchema: validationSchema,
        initialValues: {
            membershipCategory: "",
            expireDate: "",
            description: "",
            label: "",
            image: ""
        },
        onSubmit: async (data) => {
            if (addeditable === true) {
                data["image"] = fileUploadData[0];
                data["membershipBenifitId"] = benifitRowData;
                const res = await dispatch(handlePatchRequest(data, "api/v1/membershipBenifit", true, true));
                if (res.status === 200) {
                    await getMemberBenifitdata();
                }
                onHide();
            } else {
                data["image"] = fileUploadData;
                data["membershipBenifitId"] = benifitRowData;
                const res = await dispatch(handlePostRequest(data, "api/v1/membershipBenifit", true, true));

                if (res?.status === 200 || res?.status === 201) {
                    await getMemberBenifitdata();
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
        if (benifitRowData !== undefined && benifitRowData !== null && addeditable === true) {
            getMembersByID();
        };

    }, []);

    const handleImages = (images) => {
        setfileUploadData(images);
    };

    const getCategorydata = async () => {
        const res = await handleGetRequest("api/v1/membership/all", false);

        if (res) {
            setCategoryOption(res);
        }
    };
    useEffect(() => {
        getCategorydata();
    }, []);


    return (
        <div>

            <form onSubmit={formik.handleSubmit}>
                <div className="grid">
                    <div className="col-12 md:col-12 lg:col-12 xl:col-12">
                        <div className="flex flex-column">
                            <label className="mb-2">Upload Image</label>
                            <AddEditImage handleImages={handleImages} editable={addeditable} EditIconImage={formik?.values?.image} />
                        </div>
                    </div>
                    <div className="col-12 md:col-12 lg:col-12 xs:col-12">
                        <div className="flex flex-column">
                            <label className="mb-2">Membership Category</label>
                            <Dropdown
                                name='membershipCategory'
                                id='membershipCategory'
                                className={classNames({ "p-invalid": isFormFieldValid("membershipCategory") }, "w-full md:w-10 inputClass")}
                                value={formik.values.membershipCategory}
                                onChange={formik.handleChange}
                                optionLabel="membershipCategory"
                                optionValue="_id"
                                options={categoryOption}
                            />
                        </div>
                        {getFormErrorMessage("membershipCategory")}
                    </div>
                    <div className="col-12 md:col-12 lg:col-12 xs:col-12">
                        <div className="flex flex-column">
                            <label htmlFor="fromDate"> Expire Date</label>
                            <InputText
                                id="expireDate"
                                name="expireDate"
                                value={formik.values.expireDate.split('T')[0]}
                                onChange={formik.handleChange}
                                className={classNames({ "p-invalid": isFormFieldValid("expireDate") }, "w-full md:w-10 inputClass")}
                                optionlabel="name"
                                type="date"
                            />
                        </div>
                        {getFormErrorMessage("expireDate")}
                    </div>
                    <div className="col-12 md:col-12 lg:col-12 xs:col-12">
                        <div className="flex flex-column">
                            <label htmlFor="fromDate">Description</label>
                            <InputTextarea
                                rows={5} cols={30}
                                id="description"
                                name="description"
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                className={classNames({ "p-invalid": isFormFieldValid("description") }, "w-full md:w-10 inputClass")}
                                optionlabel="name"
                                type="text"

                            />

                        </div>
                        {getFormErrorMessage("description")}
                    </div>
                    <div className="col-12 md:col-12 lg:col-12 xs:col-12">
                        <div className="flex flex-column">
                            <label htmlFor="fromDate">Discount On Category</label>
                            <InputText
                                id="label"
                                name="label"
                                value={formik.values.label}
                                onChange={formik.handleChange}
                                className={classNames({ "p-invalid": isFormFieldValid("label") }, "w-full md:w-10 inputClass")}
                                optionlabel="name"
                                type="text"

                            />

                        </div>
                        {getFormErrorMessage("label")}
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


        </div>
    );
}

export default AddEdit;
