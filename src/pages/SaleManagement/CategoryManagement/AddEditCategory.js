import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { useFormik } from "formik";
import classNames from "classnames";
import { Button } from "primereact/button";
import * as Yup from "yup";
import AddEditImage from "../../../components/AddEditImage";
import { handleGetRequest } from "../../../service/GetTemplate";
import { handlePostRequest } from "../../../service/PostTemplate";
import { handlePatchRequest } from "../../../service/PatchTemplete";
import { useDispatch } from "react-redux";
import { ProgressSpinner } from "primereact/progressspinner";


const AddEditCategory = ({ getCategoryData, onHide, editable, categoryRowData }) => {
    const [loading, setLoading] = useState(false);
    const [fileUploadData, setfileUploadData] = useState("");

    const onlyalphabetSRegex = /[a-z\d\-_\s]+/i;
    // /^(?!\s)[A-Za-z0-9\s]+$/;

    // const history = useHistory();
    const dispatch = useDispatch();

    const getUsersByID = async () => {
        const data = {};
        data["roleId"] = categoryRowData;
        setLoading(true);
        const res = await handleGetRequest(`api/v1/category/getOne?categoryId=${categoryRowData}`, true);
        setLoading(false);
        if (res) {
            const keyData = res;
            Object.keys(keyData).forEach((key) => {
                if (formik.initialValues.hasOwnProperty(key)) {
                    formik.setFieldValue(key, keyData[key]);
                }
            });
        }
    };

    useEffect(() => {
        if (categoryRowData !== undefined && categoryRowData !== null && editable === true) {
            getUsersByID();
        }
    }, []);

    const validationSchema = Yup.object().shape({
        name: Yup.string()?.required("This field is required.")?.matches(onlyalphabetSRegex, "This field should contain alphabets only"),
        description: Yup.string().required("This field is required.").nullable(),
    });

    const formik = useFormik({
        validationSchema: validationSchema,
        initialValues: {
            description: "",
            name: "",
            icon: "",
            // permissionsId: "",
        },
        onSubmit: async (data) => {
            if (editable === true) {
                data["categoryId"] = categoryRowData;
                // data["icon"] = fileUploadData;
                const res = await dispatch(handlePatchRequest(data, "api/v1/category/", true, true));
                if (res?.status === 200) {
                    await getCategoryData();
                    formik.resetForm();
                    onHide();
                }
            } else {
                data["icon"] = fileUploadData;
                const res = await dispatch(handlePostRequest(data, "api/v1/category/", true, true));
                if (res?.status === 200) {
                    await getCategoryData();
                    formik.resetForm();
                    onHide();
                }
            }
        },
    });
    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };

    const handleCancel = (e) => {
        e.preventDefault();
        onHide();
    };
    const handleImages = (images) => {
        setfileUploadData(images);
    };

    return (
        <>
            {loading ? (
                <ProgressSpinner style={{ display: "flex", justifyContent: "center", alignItem: "center", height: "50vh" }} strokeWidth="2" stroke-miterlimit="10" />
            ) : (
                <form onSubmit={formik.handleSubmit}>
                    <div className="grid p-p-3">
                        <div className="col-12 md:col-12 lg:col-12 xl:col-12">
                            <div className="flex flex-column">
                                <label className="mb-2">Name</label>
                                <InputText keyfilter="alpha" placeholder="Enter Name" id="name" name="name" value={formik?.values?.name?.replace(/\s\s+/g, " ")} onChange={formik.handleChange} className={classNames({ "p-invalid": isFormFieldValid("name") }, "w-full md:w-10 inputClass")} />
                                {getFormErrorMessage("name")}
                            </div>
                        </div>
                        <div className="col-12 md:col-12 lg:col-12 xl:col-12">
                            <div className="flex flex-column">
                                <label className="mb-2">Picture</label>
                                <AddEditImage handleImages={handleImages} editable={editable} EditIconImage={formik?.values?.icon} />
                            </div>
                        </div>
                        <div className="col-12 md:col-12 lg:col-12 xl:col-12">
                            <div className="flex flex-column">
                                <label className="mb-2">Description</label>
                                <InputText
                                    placeholder="Enter Description"
                                    id="description"
                                    name="description"
                                    value={formik?.values?.description?.replace(/\s\s+/g, " ")}
                                    onChange={formik.handleChange}
                                    className={classNames({ "p-invalid": isFormFieldValid("description") }, "w-full md:w-10 inputClass")}
                                />
                                {getFormErrorMessage("description")}
                            </div>
                        </div>

                        <div className="col-12 text-center">
                            <Button label="Cancel" onClick={(e) => handleCancel(e)} className="Cancelbtn p-mr-3" />
                            <Button disabled={loading} iconPos="right" label={editable ? "UPDATE" : "SAVE"} autoFocus className="Savebtn p-mr-3" />
                        </div>
                    </div>
                </form>
            )}
        </>
    );
};

export default AddEditCategory;
