import React, { useState, useRef, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';
import { ProgressSpinner } from "primereact/progressspinner"
import { useFormik } from "formik";
import classNames from "classnames";
import * as Yup from "yup";
import { FileUpload } from 'primereact/fileupload';
import AddEditImage from "../../../components/AddEditImage";
import { handlePatchRequest } from '../../../service/PatchTemplete';
import { handlePostRequest } from '../../../service/PostTemplate';
import { useDispatch } from "react-redux";
import { handleGetRequest } from '../../../service/GetTemplate';
const AddEditDelivery = ({ getdeliverydata, onHide, editable, deliveryRowData, }) => {
    const [loading, setloading] = useState(false);
    const [fileUploadData, setfileUploadData] = useState("");
    const [totalSize, setTotalSize] = useState(0);
    const [citylist, setCityList] = useState();
    const toast = useRef(null);
    const dispatch = useDispatch();
    const [Id, setId] = useState();
    const [city, setcity] = useState();
    const [fatherName, setFatherName] = useState();

    const validationSchema = Yup.object().shape({
        organizationName: Yup.string()?.required("This field is required."),
        city: Yup.string()?.required("This field is required."),
        mailingAdress: Yup.string()?.required("This field is required."),
        contactNumber: Yup.string()?.required("This field is required."),
        website: Yup.string()?.required("This field is required."),
        orderTrackingLink: Yup.string()?.required("This field is required."),
        name: Yup.string()?.required("This field is required."),
        fatherName: Yup.string()?.required("This field is required."),
        cnic: Yup.string()?.required("This field is required."),
        contactNumber: Yup.string()?.required("This field is required."),
        image: Yup.string()?.required("This field is required."),
    });

    const formik = useFormik({
        validationSchema: validationSchema,
        initialValues: {
            organizationName: "",
            city: "",
            mailingAdress: "",
            contactNumber: "",
            website: "",
            orderTrackingLink: "",
            name: "",
            fatherName: "",
            cnic: "",
            contactNumber: "",
            image: "",
        },

        onSubmit: async (data) => {

            setloading(true);
            if (editable === true) {
                //const data = {}
                data["image"] = fileUploadData; 
                data["deliveryPartnerId"] = deliveryRowData;

                const res = await dispatch(handlePatchRequest(data, "api/v1/deliverypartner", true, true));
                 
                
                if (res?.status === 200) {
                    await getdeliverydata();
                    formik.resetForm();
                    // onHide();
                }
                onHide();
            } else {
                const res = await dispatch(handlePostRequest(data, "api/v1/deliverypartner", true, true));
                data["image"] = fileUploadData;
                data["deliveryPartnerId"] = deliveryRowData;
                if (res?.status === 200) {
                    await getdeliverydata();
                    formik.resetForm();
                   
                }
                onHide();
            }
        }
    });




    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };


    useEffect(() => {
        if (deliveryRowData !== undefined && deliveryRowData !== null && editable === true) {
            getDilveryByID();
        }

    }, []);


    const getDilveryByID = async () => {
        // const data = {};
        // data["_id"] = deliveryRowData;
        setloading(true);
        const res = await handleGetRequest('api/v1/deliverypartner/all', true);
        // const keyData = res?.data?.organization.city;
        if (res) {
            const keyData = res;

            //setId(res.Id);
            setloading(false);
            //const cities = keyData?._id;
            // const rolesName = roles.map((name) => name?._id);
            Object.keys(keyData).forEach((key) => {
                if (formik.initialValues.hasOwnProperty(key)) {
                    formik.setFieldValue(key, keyData[key]);
                }
            });
            //let city = keyData?.city;
            //formik.setFieldValue("city", city)
        }
    };
    const getCityList = async () => {
        const res = await handleGetRequest("api/v1/deliverypartner/all", false);
        if (res) {
            setcity(res);
        }
    }
    useEffect(() => {
        getCityList();
    }, []);
    const getFathetNameList = async () => {
        const res = await handleGetRequest("api/v1/deliverypartner/all", false);
        if (res) {
            setFatherName(res);
        }
    }
    useEffect(() => {
        getFathetNameList();
    }, []);



    // const getDilveryByID = async () => {

    //     const res = await handleGetRequest(`/api/v1/deliverypartner/deliverPartnerList`, true);
    //     const keyData = res;
    //     setloading(false);
    //     Object.keys(keyData).forEach((key) => {
    //         if (formik.initialValues.hasOwnProperty(key)) {
    //             formik.setFieldValue(key, keyData[key]);
    //         }
    //     });

    //     // };
    // }

    const handleCancel = (e) => {
        e.preventDefault();
        onHide();
    };
    const handleImages = (images) => {
        setfileUploadData(images);
    };
    const onUpload = () => {
        toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    };
    // const itemTemplate = (file, props) => {
    //     return (
    //         <div className="flex align-items-center flex-wrap">
    //             <div className="flex align-items-center" style={{ width: '40%' }}>
    //                 <img alt={file.name} role="presentation" src={file.objectURL} width={100} />
    //                 <span className="flex flex-column text-left ml-3">
    //                     {file.name}
    //                     <small>{new Date().toLocaleDateString()}</small>
    //                 </span>
    //             </div>
    //             <Button type="button" icon="pi pi-times" className="p-button-outlined p-button-rounded p-button-danger ml-auto" onClick={() => onTemplateRemove(file, props.onRemove)} />
    //         </div>
    //     );
    // };
    const onTemplateSelect = (e) => {
        let _totalSize = totalSize;
        let files = e.files;

        Object.keys(files).forEach((key) => {
            _totalSize += files[key].size || 0;
        });
        setTotalSize(_totalSize);
    };

    const onTemplateUpload = (e) => {
        let _totalSize = 0;

        e.files.forEach((file) => {
            _totalSize += file.size || 0;
        });

        setTotalSize(_totalSize);
        toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    };
    const onTemplateRemove = (file, callback) => {
        setTotalSize(totalSize - file.size);
        callback();
    };
    const onTemplateClear = () => {
        setTotalSize(0);
    };
    const emptyTemplate = () => {
        return (
            <div className="flex align-items-center flex-column">
                <i className="pi pi-image mt-3 p-5" style={{ fontSize: '5em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)' }}></i>
                <span style={{ fontSize: '1.2em', color: 'var(--text-color-secondary)' }} className="my-5">
                    Drag and Drop Image Here
                </span>
            </div>
        );
    };
    // const headerTemplate = (options) => {
    //     const { className, chooseButton, uploadButton, cancelButton } = options;
    //     const value = totalSize / 10000;
    //     const formatedValue = fileUploadRef && fileUploadRef.current ? fileUploadRef.current.formatSize(totalSize) : '0 B';

    //     return (
    //         <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
    //             {chooseButton}
    //             {cancelButton}
    //         </div>
    //     );
    // };

    // const chooseOptions = { icon: 'pi pi-fw pi-images', iconOnly: true, className: 'custom-choose-btn p-button-rounded p-button-outlined' };
    // const cancelOptions = { icon: 'pi pi-fw pi-times', iconOnly: true, className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined' };

    return (
        <>
            {loading ? (
                <ProgressSpinner style={{ display: "flex", justifyContent: "center", alignItem: "center", height: "50vh" }} strokeWidth="2" stroke-miterlimit="10" />
            ) : (
                <form onSubmit={formik.handleSubmit}>

                    <div className="grid">
                        <div className="col-4">
                            <div className="flex flex-column">
                                <label className="mb-2">Organization's Name</label>
                                <InputText name="organizationName" id="organizationName" value={formik?.values?.organizationName?.replace(/\s\s+/g, " ")} onChange={formik.handleChange} className={classNames({ "p-invalid": isFormFieldValid("organizationName") }, "w-full md:w-10 inputClass")} optionValue="_id" />
                                {getFormErrorMessage("organizationName")}
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="flex flex-column">
                                <label className="mb-2">City</label>
                                <Dropdown
                                    name="city"
                                    id="city"
                                    className={classNames({ "p-invalid": isFormFieldValid("city") }, "w-full md:w-10 inputClass")}
                                    value={formik.values.city}
                                    optionValue="_id"
                                    options={city}
                                    optionLabel="organization.city"
                                    onChange={formik.handleChange} />
                                {getFormErrorMessage("city")}
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="flex flex-column">
                                <label className="mb-2">Mailing Address</label>
                                <InputText type="text" name="mailingAdress" id="mailingAdress" value={formik?.values?.mailingAdress?.replace(/\s\s+/g, " ")} onChange={formik.handleChange} className={classNames({ "p-invalid": isFormFieldValid("mailingAdress") }, "w-full md:w-10 inputClass")} />
                                {getFormErrorMessage("mailingAdress")}
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="flex flex-column">
                                <label className="mb-2">Contact Number</label>
                                <InputText type="text" name="contactNumber" id="contactNumber" value={formik?.values?.contactNumber?.replace(/\s\s+/g, " ")} onChange={formik.handleChange} className={classNames({ "p-invalid": isFormFieldValid("contactNumber") }, "w-full md:w-10 inputClass")} />
                                {getFormErrorMessage("contactNumber")}
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="flex flex-column">
                                <label className="mb-2">Website</label>
                                <InputText type="text" name="website" id="website" value={formik?.values?.website?.replace(/\s\s+/g, " ")} onChange={formik.handleChange} className={classNames({ "p-invalid": isFormFieldValid("website") }, "w-full md:w-10 inputClass")} />
                                {getFormErrorMessage("text")}
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="flex flex-column">
                                <label className="mb-2">Order Tracking Link</label>
                                <InputText type="text" name="orderTrackingLink" id="orderTrackingLink" value={formik?.values?.orderTrackingLink?.replace(/\s\s+/g, " ")} onChange={formik.handleChange} className={classNames({ "p-invalid": isFormFieldValid("orderTrackingLink") }, "w-full md:w-10 inputClass")} />
                                {getFormErrorMessage("orderTrackingLink")}
                            </div>
                        </div>
                        <div className="col-12 pt-3 pb-3">
                            <label><span className="pr-5"><b>o</b></span>Particulars of Cheif Executive/Office Head</label>
                        </div>
                        <div className="col-12 flex innr_padding mt-3 mb-3">
                            <div className="grid">
                                <div className="col-4">
                                    <div className="flex flex-column">
                                        <label className="mb-2">Name</label>
                                        <InputText type="text" name="name" id="name" value={formik?.values?.name?.replace(/\s\s+/g, " ")} onChange={formik.handleChange} className={classNames({ "p-invalid": isFormFieldValid("name") }, "w-full md:w-10 inputClass")} />
                                        {getFormErrorMessage("name")}
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="flex flex-column">
                                        <label className="mb-2">SO/WO/DO </label>
                                        <Dropdown
                                            name="fatherName"
                                            id="fatherName"
                                            className={classNames({ "p-invalid": isFormFieldValid("fatherName") }, "w-full md:w-10 inputClass")}
                                            value={formik.values.fatherName}
                                            optionLabel="organizationHead.fatherName"
                                            optionValue="_id"
                                            options={fatherName}
                                            onChange={formik.handleChange} />
                                        {getFormErrorMessage("fatherName")}
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="flex flex-column">
                                        <label className="mb-2">CNIC</label>
                                        <InputText name="cnic" id="cnic" type="text" value={formik?.values?.cnic?.replace(/\s\s+/g, " ")} onChange={formik.handleChange} className={classNames({ "p-invalid": isFormFieldValid("cnic") }, "w-full md:w-10 inputClass")} />
                                        {getFormErrorMessage("cnic")}
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="flex flex-column">
                                        <label className="mb-2">Mobile Number</label>
                                        <InputText name="contactNumber" id="contactNumber" value={formik?.values?.contactNumber?.replace(/\s\s+/g, " ")} onChange={formik.handleChange} className={classNames({ "p-invalid": isFormFieldValid("contactNumber") }, "w-full md:w-10 inputClass")} />
                                        {getFormErrorMessage("contactNumber")}
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="flex flex-column">
                                        <label className="mb-2">Picture</label>
                                        <AddEditImage handleImages={handleImages} editable={editable} EditIconImage={formik?.values?.image} />
                                        {/* <InputText name="image" id="image" type="file" value={formik?.values?.image?.replace(/\s\s+/g, " ")} onChange={formik.handleChange} className={classNames({ "p-invalid": isFormFieldValid("image") }, "w-full md:w-10 inputClass")} /> */}
                                        {/* {getFormErrorMessage("image")} */}
                                    </div>
                                </div>

                            </div>

                        </div>

                        {/* representatives */}


                        <div className="col-12 md:col-12 xl:col-12 lg:col-12 pt-3 pb-3">
                            <label><span className="pr-5"><b>o</b></span>Particulars of Cheif Representatives</label>
                        </div>
                        <div className="col-12 flex innr_padding mt-3 mb-3">
                            <div className="grid">
                                <div className="col-12 xl:col-4 md:col-4 lg:col-4">
                                    <div className="flex flex-column">
                                        <label className="mb-2">Name</label>
                                        <InputText type="text" name="name" id="name" value={formik?.values?.name?.replace(/\s\s+/g, " ")} onChange={formik.handleChange} className={classNames({ "p-invalid": isFormFieldValid("name") }, "w-full md:w-10 inputClass")} />
                                        {getFormErrorMessage("name")}
                                    </div>
                                </div>
                                <div className="col-12 xl:col-4 md:col-4 lg:col-4">
                                    <div className="flex flex-column">
                                        <label className="mb-2">SO/WO/DO </label>
                                        <Dropdown
                                            name="fatherName"
                                            id="fatherName"
                                            className={classNames({ "p-invalid": isFormFieldValid("fatherName") }, "w-full md:w-10 inputClass")}
                                            optionLabel="organizationRepresentative.fatherName"
                                            optionValue="_id"
                                            options={fatherName}
                                            value={formik.values.fatherName}
                                            onChange={formik.handleChange} />
                                        {getFormErrorMessage("fatherName")}
                                    </div>
                                </div>
                                <div className="col-12 xl:col-4 md:col-4 lg:col-4">
                                    <div className="flex flex-column">
                                        <label className="mb-2">CNIC</label>
                                        <InputText name="cnic" id="cnic" type="text" value={formik?.values?.cnic?.replace(/\s\s+/g, " ")} onChange={formik.handleChange} className={classNames({ "p-invalid": isFormFieldValid("cnic") }, "w-full md:w-10 inputClass")} />
                                        {getFormErrorMessage("cnic")}
                                    </div>
                                </div>
                                <div className="col-12 xl:col-4 md:col-4 lg:col-4">
                                    <div className="flex flex-column">
                                        <label className="mb-2">Mobile Number</label>
                                        <InputText name="contactNumber" id="contactNumber" type="text" value={formik?.values?.contactNumber?.replace(/\s\s+/g, " ")} onChange={formik.handleChange} className={classNames({ "p-invalid": isFormFieldValid("contactNumber") }, "w-full md:w-10 inputClass")} />
                                        {getFormErrorMessage("contactNumber")}
                                    </div>
                                </div>
                                <div className="col-12 xl:col-4 md:col-4 lg:col-4">
                                    <div className="flex flex-column">
                                        <label className="mb-2">Picture</label>
                                        <AddEditImage handleImages={handleImages} editable={editable} EditIconImage={formik?.values?.image} />
                                        {/* <InputText name="image" id="image" type="file" value={formik?.values?.image?.replace(/\s\s+/g, " ")} onChange={formik.handleChange} className={classNames({ "p-invalid": isFormFieldValid("image") }, "w-full md:w-10 inputClass")} />
                                                {getFormErrorMessage("image")} */}
                                    </div>
                                </div>

                            </div>

                        </div>


                        {/* representatives */}

                    </div>
                    <div className="grid">
                        <div className="col-12 xl:col-12 md:col-12 lg:col-12 text-right pt-4">
                            <Button label="Cancel" onClick={onHide} type="button" className="Cancelbtn p-mr-3" />
                            <Button  type="submit" disabled={loading} autoFocus className="Savebtn p-mr-3" label={editable ? "UPDATE" : "SAVE"} ></Button>
                        </div>
                    </div>


                </form>
            )}
        </>
    );
}

export default AddEditDelivery;
