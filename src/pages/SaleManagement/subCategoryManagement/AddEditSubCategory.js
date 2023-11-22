import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
// import { useHistory } from "react-router-dom";
// import { Image } from 'primereact/image';
import { useFormik } from "formik";
import classNames from "classnames";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
// import { MultiSelect } from "primereact/multiselect";
// import { InputMask } from "primereact/inputmask";
import * as Yup from "yup";
//  import ImageUpload from "../../../components/ImageUpload/index"
import AddEditImage from "../../../components/AddEditImage";
import { handleGetRequest } from "../../../service/GetTemplate";
import { handlePostRequest } from "../../../service/PostTemplate";
import { handlePatchRequest } from "../../../service/PatchTemplete";
import { useDispatch } from "react-redux";
import { ProgressSpinner } from "primereact/progressspinner";
//import { config } from "react-transition-group";
import { toast } from "react-toastify";
import { InputTextarea } from 'primereact/inputtextarea';
import MultiImage from "../../../components/MultiImage";


const AddEditSubCategory = ({ updatedData, getSubcategorydata, onHide, subEditable, subCatRowData }) => {
    const [loading, setLoading] = useState(false);
    const [fileUploadData, setfileUploadData] = useState("");
    // const [loadingIcon, setloadingIcon] = useState("pi pi-save");
    const [category, setCategory] = useState([])
    // const [userId, setUserId] = useState();

    // const aplhaNumericSRegex = /^[0-9a-zA-Z]*$/;
    // /[a-z\d\-_\s]+/i;    

    // useEffect(() => { console.log('sId here', subCatRowData) }, [])
    // const history = useHistory();
    const dispatch = useDispatch();

    const getUsersByID = async () => {
        const data = {};

        data["roleId"] = subCatRowData;

        setLoading(true);
        const res = await handleGetRequest(`api/v1/subcategory/getOne?subcategoryId=${subCatRowData}`, true);


        setLoading(false);
        if (res) {
            const keyData = res;
            const category = keyData?.category;

            Object.keys(keyData).forEach((key) => {
                if (formik.initialValues.hasOwnProperty(key)) {
                    formik.setFieldValue(key, keyData[key]);
                }
            });
            formik.setFieldValue("categoryId", category)

        }
    };



    useEffect(() => {
        if (getSubcategorydata !== undefined && getSubcategorydata !== null && subEditable === true) {
            getUsersByID();
        }
    }, []);


    const getCategoryLOV = async () => {
        const res = await handleGetRequest("api/v1/category/all", false);
        if (res) {
            setCategory(res);
        }
    }
    useEffect(() => {
        getCategoryLOV();
    }, []);




    const validationSchema = Yup.object().shape({
        categoryId: Yup.string().required("This field is required."),
        name: Yup.string().required("This field is required."),
        // .matches(aplhaNumericSRegex, "Only alphabat and numeric"),
        description: Yup.string()
            .required("This field is required.")
            .nullable(),
    });

    const formik = useFormik({
        validationSchema: validationSchema,
        initialValues: {
            description: "",
            name: "",
            icon: "",
            categoryId: updatedData?.name,
            thumbnail: "",
            // permissionsId: "",
        },

        // validate: (data) => {
        //     let errors = {};

        //     if (data?.cnic?.length < 15) {
        //         errors.cnic = "Minimum length 13 allowed.";
        //     }
        //     if (data?.nextOfKinCnic?.length < 15) {
        //         errors.nextOfKinCnic = "Minimum length 13 allowed.";
        //     }
        //     if (data?.personalMobileNo?.length < 12) {
        //         errors.personalMobileNo = "Minimum length 11 allowed.";
        //     }
        //     if (data?.nextOfKincontactNo?.length < 12) {
        //         errors.nextOfKincontactNo = "Minimum length 11 allowed.";
        //     }
        //     if (data?.emergencyContactNo?.length < 12) {
        //              errors.emergencyContactNo = "Minimum length 11 allowed.";
        //     }
        //     return errors;
        // },
        onSubmit: async (data) => {


            // return
            if (subEditable === true) {
                data["icon"] = fileUploadData;
                data["subcategoryId"] = subCatRowData;
                // data["categoryId"] = updatedData?._id;

                const res = await dispatch(handlePatchRequest(data, "api/v1/subcategory/", true, true));
                if (res?.status === 200) {
                    await getSubcategorydata();
                    formik.resetForm();
                    onHide();

                }
            } else {
                data["icon"] = fileUploadData;
                data["thumbnail"] = fileUploadData;
                data["subcategoryId"] = subCatRowData;
                data["categoryId"] = updatedData?._id




                const res = await dispatch(handlePostRequest(data, "api/v1/subcategory/", true, true));
                // toast.configure();
                if (res?.status === 200) {
                    await getSubcategorydata();
                    formik.resetForm();
                    onHide();
                }
            }
            // setLoading(false);
            // setloadingIcon("pi pi-save");
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

    //Callback Function to Get Base64 of Uploaded Image
    const handleImages = (images) => {
        setfileUploadData(images);
    };

    const handleSubmit = (e) => {
        e.onSubmit();
        onHide();
    }



    return (
        <>
            {loading ? (
                <ProgressSpinner style={{ display: "flex", justifyContent: "center", alignItem: "center", height: "50vh" }} strokeWidth="2" stroke-miterlimit="10" />
            ) : (
                <form onSubmit={formik.handleSubmit}>
                    <div className="grid p-p-3">
                        <div className="col-12 md:col-12 lg:col-12 xl:col-12">
                            <div className="flex flex-column">
                                <label className="mb-2">Category</label>
                                <InputText
                                    disabled
                                    id="categoryId"
                                    name="categoryId"
                                    className={classNames({ "p-invalid": isFormFieldValid("categoryId") }, "w-full md:w-10 inputClass")}
                                    value={formik.values.categoryId}
                                    options={category} onChange={formik.handleChange} />
                                {getFormErrorMessage("categoryId")}
                            </div>
                        </div>
                        {/* <div className="col-12 md:col-12 lg:col-12 xl:col-12">
                            <div className="flex flex-column">
                                <label className="mb-2">Category</label>
                                <Dropdown id="categoryId"
                                    name="categoryId"
                                    placeholder="Select Category" className={classNames({ "p-invalid": isFormFieldValid("categoryId") }, "w-full md:w-10 inputClass")} value={formik.values.categoryId} options={category} onChange={formik.handleChange} optionValue="_id" optionLabel="name" />
                                {getFormErrorMessage("categoryId")}
                            </div>
                        </div> */}
                        <div className="col-12 md:col-12 lg:col-12 xl:col-12">
                            <div className="flex flex-column">
                                <label className="mb-2">Sub-Category</label>
                                <InputText maxLength={35} placeholder="Enter Sub-Category" id="name" name="name" value={formik?.values?.name?.replace(/\s\s+/g, " ")} onChange={formik.handleChange} className={classNames({ "p-invalid": isFormFieldValid("name") }, "w-full md:w-10 inputClass")} />
                                {getFormErrorMessage("name")}
                            </div>
                        </div>
                        <div className="col-12 md:col-12 lg:col-12 xl:col-12">
                            <div className="flex flex-column">
                                <label className="mb-2">Main Image</label>
                                <AddEditImage handleImages={handleImages} subEditable={subEditable} EditIconImage={formik?.values.icon}
                                />
                                {/* <ImageUpload handleImages={handleImages} className="w-full md:w-10 inputClass"/> */}
                            </div>
                        </div>
                        <div className="col-12 md:col-12 lg:col-12 xl:col-12">
                            <div className="flex flex-column">
                                <label className="mb-2">Thumbnail</label>
                                <AddEditImage handleImages={handleImages} subEditable={subEditable} EditIconImage={formik?.values.thumbnail} />
                            </div>
                        </div>
                        <div className="col-12 md:col-12 lg:col-12 xl:col-12">
                            <div className="flex flex-column">
                                <label className="mb-2">Description</label>
                                <InputTextarea rows={5} cols={30} placeholder="Enter Description" id="description" name="description" value={formik?.values?.description?.replace(/\s\s+/g, " ")} onChange={formik.handleChange} className={classNames({ "p-invalid": isFormFieldValid("description") }, "w-full md:w-10 inputClass")} />
                                {getFormErrorMessage("description")}
                            </div>
                        </div>

                        <div className="col-12 text-center">
                            <Button label="Cancel" onClick={(e) => handleCancel(e)} className="Cancelbtn p-mr-3" />
                            <Button type="submit" disabled={loading} iconPos="right" label={subEditable ? "Update" : "Save"} autoFocus className="Savebtn p-mr-3" />
                        </div>

                    </div>
                </form>
            )}
        </>
    );
};

export default AddEditSubCategory;
