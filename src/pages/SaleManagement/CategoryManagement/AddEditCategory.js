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
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import { toast } from "react-toastify";

const GENDER_OPTIONS = [
    { label: "Men",     value: "men" },
    { label: "Women",   value: "women" },
    { label: "Juniors", value: "juniors" },
    { label: "Unisex",  value: "unisex" },
];

const AddEditCategory = ({ getCategoryData, onHide, editable, categoryRowData }) => {
    const [loading, setLoading] = useState(false);
    const [iconFileData, setIconFileData] = useState("");
    const [thumbnailFileData, setThumbnailFileData] = useState("");

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
            thumbnail: "",
            gender: "",
            isFeatured: false,
        },
        onSubmit: async (data, { setErrors }) => {
            if (editable === true) {
                if (iconFileData === "" && data.icon === "") {
                    toast.error("Icon field is required.");
                    return;
                }
                if (thumbnailFileData === "" && data.thumbnail === "") {
                    toast.error("Thumbnail field is required.");
                    return;
                }
            } else {
                if (iconFileData === "") {
                    toast.error("Icon field is required.");
                    return;
                }
                if (thumbnailFileData === "") {
                    toast.error("Thumbnail field is required.");
                    return;
                }
            }

            if (Object.keys(formik.errors).length === 0) {
                // strip empty gender so backend validation doesn't reject it
                if (!data.gender) delete data.gender;

                if (editable === true) {
                    data["categoryId"] = categoryRowData;
                    data["icon"] = iconFileData || data.icon;
                    data["thumbnail"] = thumbnailFileData || data.thumbnail;

                    const res = await dispatch(handlePatchRequest(data, "api/v1/category/", true, true));
                    if (res?.status === 200) {
                        await getCategoryData();
                        formik.resetForm();
                        onHide();
                    }
                } else {
                    data["icon"] = iconFileData;
                    data["thumbnail"] = thumbnailFileData;
                    const res = await dispatch(handlePostRequest(data, "api/v1/category/", true, true));
                    if (res?.status === 200) {
                        await getCategoryData();
                        formik.resetForm();
                        onHide();
                    }
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
    const handleIconImages = (images) => {
        setIconFileData(images);
    };
    const handleThumbnailImages = (images) => {
        setThumbnailFileData(images);
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
                                <label className="mb-2">Category Name</label>
                                <InputText
                                    maxLength={35}
                                    placeholder="Enter Category Name"
                                    id="name"
                                    name="name"
                                    value={formik?.values?.name?.replace(/\s\s+/g, " ")}
                                    onChange={(e) => {
                                        const input = e.target.value;
                                        const regex = /^[a-zA-Z\s]*$/;
                                        if (regex.test(input)) {
                                            formik.handleChange(e);
                                        }
                                    }}
                                    className={classNames({ "p-invalid": isFormFieldValid("name") }, "w-full md:w-10 inputClass")}
                                />
                                {getFormErrorMessage("name")}
                            </div>
                        </div>
                        <div className="col-12 md:col-12 lg:col-12 xl:col-12">
                            <div className="flex flex-column">
                                <label className="mb-2">Main Image</label>
                                <AddEditImage handleImages={handleIconImages} editable={editable} EditIconImage={formik?.values.icon} />
                            </div>
                        </div>
                        <div className="col-12 md:col-12 lg:col-12 xl:col-12">
                            <div className="flex flex-column">
                                <label className="mb-2">Thumbnail</label>
                                <AddEditImage handleImages={handleThumbnailImages} editable={editable} EditIconImage={formik?.values.thumbnail} />
                            </div>
                        </div>
                        <div className="col-12 md:col-6 lg:col-6 xl:col-6">
                            <div className="flex flex-column">
                                <label className="mb-2">Gender</label>
                                <Dropdown
                                    id="gender"
                                    name="gender"
                                    value={formik.values.gender}
                                    options={GENDER_OPTIONS}
                                    onChange={(e) => formik.setFieldValue("gender", e.value)}
                                    placeholder="Select Gender"
                                    showClear
                                    className="w-full inputClass"
                                />
                            </div>
                        </div>

                        <div className="col-12 md:col-6 lg:col-6 xl:col-6">
                            <div className="flex flex-column justify-content-center" style={{ paddingTop: "1.8rem" }}>
                                <div className="flex align-items-center gap-2">
                                    <Checkbox
                                        inputId="isFeatured"
                                        name="isFeatured"
                                        checked={formik.values.isFeatured}
                                        onChange={(e) => formik.setFieldValue("isFeatured", e.checked)}
                                    />
                                    <label htmlFor="isFeatured" className="ml-2 cursor-pointer">Featured Category</label>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 md:col-12 lg:col-12 xl:col-12">
                            <div className="flex flex-column">
                                <label className="mb-2">Description</label>
                                <InputTextarea
                                    rows={5}
                                    cols={30}
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
                            <Button type="submit" disabled={loading} iconPos="right" label={editable ? "Update" : "Save"} autoFocus className="Savebtn p-mr-3" />
                        </div>
                    </div>
                </form>
            )}
        </>
    );
};

export default AddEditCategory;
