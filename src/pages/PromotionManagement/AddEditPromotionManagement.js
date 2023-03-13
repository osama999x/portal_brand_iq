import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
//import { InputTextarea } from 'primereact/inputtextarea';
import { useHistory, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import classNames from "classnames";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
// import {  RadioButton } from "primereact/radiobutton";
// import { Editor } from "primereact/editor";
import { MultiSelect } from "primereact/multiselect";
//import AddEditImage from "../../components/AddEditImage";
import * as Yup from "yup";
import { handleGetRequest } from "../../service/GetTemplate";
import { handlePostRequest } from "../../service/PostTemplate";
import { handlePatchRequest } from "../../service/PatchTemplete";
import { useDispatch } from "react-redux";
import { ProgressSpinner } from "primereact/progressspinner";
import { Checkbox } from "primereact/checkbox";
import moment from "moment/moment";

const AddEditPromotionManagement = ({ onHide }) => {    
    let { search } = useLocation();
    const query = new URLSearchParams(search);
    const promotionRowData = query.get("promotionid");
    const editable = promotionRowData ? true : false;
    const [categories, setCategories] = useState();
    const [campaignID, setCampaignID] = useState([]);
    const [subCategories, setSubCategories] = useState();
    const [products, setProducts] = useState();
    const [promotion, setPromotion] = useState([{
        subcategory: "",
        // product: "",
        discount: "", expireDate: "", status: ""
    }]);
    // const [promotionError, setPromotionError] = useState([{
    //     subcategory: "",
    //     //  product: "", 
    //     discount: "", expireDate: "", status: ""
    // }]);
    const [loading, setLoading] = useState(false);
    const [fileUploadData, setfileUploadData] = useState("");
    // const [loadingIcon, setloadingIcon] = useState("pi pi-save");

    // const [promotionData, setPromotionData] = useState();

    const history = useHistory();
    const dispatch = useDispatch();

    const validationSchema = Yup.object().shape({
        // subcategory: Yup.string().required("This field is required."),
        // product: Yup.mixed().required("This field is required."),
        // status: Yup.mixed().required("This field is required."),
        // expireDate: Yup.mixed().required("This field is required."),
        //discount: Yup.mixed().required("This field is required."),
    });

    const formik = useFormik({
        validationSchema: validationSchema,
        initialValues: {
            subcategory: "",
            product: "",
            status: "",
            expireDate: "",
            discount: "",


        },

        onSubmit: async (data) => {
            // data["banner"] = fileUploadData;
            // data["promotionId"] = promotion;

            // console.log("data", data)
            // setLoading(true);
            // setloadingIcon("pi pi-spin pi-spinner");



            
            setLoading(true);
            if (editable === true) {

            //     data["banner"] = fileUploadData;
            // data["promotion"] = promotion;
                const res = await dispatch(handlePatchRequest(data, "api/v1/promotion/updatePromotion", true, true));
                
                if (res?.status === 200) {
                    await getPromotionData();
                    //formik.resetForm();

                }
                onHide();
            } else {
                data["campaignId"] = campaignID;
                
                // data["image"] = fileUploadData;
                //data["campaignId"] = promotion;
                data["expireDate"] = moment().format("MM/DD/YYYY")
                const res = await dispatch(handlePostRequest(data, "api/v1/promotion/addPromotion", true, true));
                
                if (res?.status === 200) {
                    await getPromotionData();
                    history.push("./managepromotion");
                }
                onHide();
            }
            // setLoading(false);
            // setloadingIcon("pi pi-save");
        },
    });
    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };

    const getPromotionData = async () => {
        setLoading(true);
        
        const res = await handleGetRequest(`api/v1/promotion/all`, true)
    
        if (res) {
            setPromotion(res?.promotion);
            const keyData = res;
            setLoading(false);
            Object.keys(keyData).forEach((key) => {
                if (formik.initialValues.hasOwnProperty(key)) {
                    formik.setFieldValue(key, keyData[key]);
                }
            });
        }
        promotion.map((objects, index) => {
            Object.keys(objects).forEach((keys) => {
               
                // promotion[index][keys] = 
            })

        })

        // console.log("keyData",res?.promotion)
    };
    
    // const handleImages = (images) => {
    //     setfileUploadData(images);
    // };
    // const getAllCategories = async () => {
    //     const response = await handleGetRequest("api/v1/category/all");
    //     if (response) {
    //         setCategories(response);
    //     }
    // };

    // const getCampaignID = async () => {
    //     const response = await handleGetRequest("api/v1/promotion/all", false);
    //     if (response) {
            
    //         //for (let i=0; i <= campaignID.length; i++) 
    //         setCampaignID(response[1]?._id);
    //         //console.log(response[0]?._id)
            
    //     }
    // };
    //console.log("resssponese", campaignID)

    const getAllSubCategories = async () => {
        const response = await handleGetRequest("api/v1/subcategory/all", false);
        if (response) {
            setSubCategories(response);
        }
    };
    const getAllProducts = async () => {
        const response = await handleGetRequest(`api/v1/subcategory/productsBySubcategory?subCategoryId=${formik.values.subcategory}`, false);
        if (response) {
            setProducts(response);
        }
    };

    useEffect(() => {
        // getAllCategories();
        getAllSubCategories();
        //getCampaignID();
    }, []);

    useEffect(() => {
        if (formik.values.subcategory.length > 0 ) {
            getAllProducts();
        }
        
    },[formik.values.subcategory]);

    useEffect(() => {
        if (promotionRowData !== undefined && promotionRowData !== null && editable === true) {
            getPromotionData();
        }
    }, []);
    const getOrderData = () => {
        history.push("/managepromotion");
    };
    // const CheckValidations = (e, index) => {
    //     const { name, value } = e.target;
    //     //Logic for validations
    //     if (value === "") {
    //         const fieldError = [...promotionError];
    //         fieldError[index][name] = "This field is required";
    //         setPromotionError(fieldError);
    //     } else {
    //         const fieldError = [...promotionError];
    //         fieldError[index][name] = "";
    //         setPromotionError(fieldError);

    //         // if (!name === "startDate") {
    //         //     const promotionError = [...promotionError];
    //         //     promotionError[index][name] = "";
    //         //     setPromotionError(promotionError);
    //         // }
    //     }
    // };
    // const handleAddClick = (e, i) => {
    //     e.preventDefault();
    //     setPromotionError([...promotionError, {
    //         subcategory: "",
    //         //  product: "",
    //         discount: "", expireDate: "", status: ""
    //     }]);
    //     setPromotion([...promotion, {
    //         subcategory: "",
    //         //  product: "",
    //         discount: "", expireDate: "", status: ""
    //     }]);
    // };
    // const handleRemoveClick = (e, index) => {
    //     e.preventDefault();
    //     const errorList = [...promotionError];
    //     errorList.splice(index, 1);
    //     setPromotionError(errorList);
    //     const promotionDetails = [...promotion];
    //     promotionDetails.splice(index, 1);
    //     setPromotion(promotionDetails);
    // };
    // const handleInputChange = (e, index) => {
    //     const { name, value } = e.target;
    //     if (name === "discount") {
    //         // console.log("name: ", name)
    //         // console.log("value", value)
    //         const promotionDetails = [...promotion];
    //         promotionDetails[index][name] = parseInt(value);
    //         setPromotion(promotionDetails);
    //         CheckValidations(e, index);
    //     }
    //     else {
    //         // console.log("name: ", name)
    //         // console.log("value", value)
    //         const promotionDetails = [...promotion];
    //         promotionDetails[index][name] = value;
    //         setPromotion(promotionDetails);
    //         CheckValidations(e, index);
    //     }
    // };

    const statusOption = [
        { name: 'Active', status: "active" },
        { name: 'InActive', status: "inactive" },
    ];

    return (
        <>
            {loading ? (
                <ProgressSpinner style={{ display: "flex", justifyContent: "center", alignItem: "center", height: "50vh" }} strokeWidth="2" stroke-miterlimit="10" />
            ) : (
                <form onSubmit={formik.handleSubmit}>
                    <div className="card headr_bg">
                        <div className="card-header">

                            <label>CREATE NEW PROMOTIONS</label>

                            {/* <button type="button" className="close" data-dismiss="modal"  aria-label="Close" onClick={getOrderData}>
                                    <span aria-hidden="true">&times;</span>
                                </button> */}
                        </div>

                        {/* <div className="card-body">
                            <div className="grid">
                                <div className="col-12 md:col-4 xl:col-4 lg:col-4">
                                    <div className="flex flex-column">
                                        <label className="mb-4">Campaign Name</label>
                                        <InputText id="campaignName" name="campaignName" onChange={formik.handleChange} value={formik?.values?.campaignName} type="text" placeholder="Enter Campaign Name" className="w-full md:w-10 inputClass" />
                                    </div>
                                </div>
                                    <div className="col-12 md:col-4 xl:col-4 lg:col-4">
                                        <div className="flex flex-column">
                                            <label className="mb-4">Description</label>
                                            <InputTextarea id="description" name="description" onChange={formik.handleChange} value={formik?.values?.description} type="text" placeholder="Enter description" className="w-full md:w-10 inputClass" />
                                        </div>
                                    </div>
                                <div className="col-12 md:col-4 xl:col-4 lg:col-4">
                                    <div className="flex flex-column">
                                        <label className="mb-2">Campaign Banner</label>
                                        <AddEditImage id="banner" name="banner" handleImages={handleImages} editable={editable} EditIconImage={formik?.values?.banner} />
                                    </div>
                                </div>
                                    <div className="col-12 md:col-4 xl:col-4 lg:col-4">
                                        <div className="flex flex-column">
                                            <label className="mb-2">Active From</label>
                                            <InputText type="date" name="activeFrom" id="activeFrom" placeholder="Select From Date" 
                                                value={formik?.values?.activeFrom.split('T')[0]} 
                                            onChange={formik.handleChange}
                                             className={classNames({ "p-invalid": isFormFieldValid("activeFrom") }, "w-full md:w-10 inputClass")} />
                                            {getFormErrorMessage("activeFrom")}
                                        </div>
                                    </div>
                                    <div className="col-12 md:col-4 xl:col-4 lg:col-4">
                                        <div className="flex flex-column">
                                            <label className="mb-2">Active To</label>
                                            <InputText type="date" name="activeTo" id="activeTo" placeholder="Select To Date"
                                                value={formik?.values?.activeTo.split('T')[0]}
                                                onChange={formik.handleChange}
                                                className={classNames({ "p-invalid": isFormFieldValid("activeTo") }, "w-full md:w-10 inputClass")} />
                                            {getFormErrorMessage("activeTo")}
                                        </div>
                                    </div> */}



                        <React.Fragment>
                            <div className="card-body">
                            {/* <div className="col-12 flex innr_padding mt-3 mb-3"> */}
                                <div className="grid">
                                    <div className="col-12 md:col-4 xl:col-4 lg:col-4">
                                        <div className="flex flex-column">
                                            <label className="mb-2">Select Sub-Category</label>
                                            <Dropdown
                                                // disabled={isDisable}
                                                placeholder="Select Sub-Category"
                                                className="w-full md:w-10 inputClass"
                                                name="subcategory"
                                                id="subcategory"
                                                htmlFor="subcategory"
                                                // onBlur={(e) => CheckValidations(e, i)}
                                                options={subCategories}
                                                //value={x.subcategory}
                                                value={formik?.values?.subcategory}
                                                optionLabel="name"
                                                optionValue="_id"
                                                // onChange={(e) => handleInputChange(e, i)}
                                                onChange={formik.handleChange}

                                            />
                                            {getFormErrorMessage("subcategory")}
                                        </div>
                                    </div>

                                    <div className="col-12 md:col-4 xl:col-4 lg:col-4">
                                        <div className="flex flex-column">
                                            <label className="mb-2">Select Product</label>
                                            <MultiSelect
                                                // disabled={isDisable}
                                                filter
                                                display="chip"
                                                placeholder="Select Product"
                                                className="w-full md:w-10 inputClass"
                                                name="product"
                                                id="product"
                                                htmlFor="product"
                                                // onBlur={(e) => CheckValidations(e, i)}
                                                options={products}
                                                // value={x.product}
                                                value={formik?.values?.product}
                                                optionLabel="name"
                                                optionValue="_id"
                                                // onChange={(e) => handleInputChange(e, i)}
                                                onChange={formik.handleChange}
                                            />
                                            {getFormErrorMessage("product")}
                                        </div>
                                    </div>
                                    <div className="col-12 md:col-4 lg:col-4 xs:col-4">
                                        <div className="flex flex-column">
                                            <label className="mb-2">Status</label>
                                            <Dropdown
                                                id="status"
                                                name="status"
                                                // onChange={formik.handleChange}
                                                value={formik.values.status}
                                                // value={x.status}
                                                // onChange={(e) => { 
                                                //     setPromotion((prev) => {
                                                //         prev[i].status = e.target.value;
                                                //         return [...prev]
                                                //     }) 
                                                // }                                                                     */}

                                                onChange={formik.handleChange}
                                                className={classNames({ "p-invalid": isFormFieldValid("status") }, "w-full md:w-10 inputClass")}
                                                options={statusOption}
                                                optionLabel="name"
                                                optionValue="status"
                                            />
                                            {getFormErrorMessage("status")}
                                        </div>

                                    </div>
                                    <div className="col-12 md:col-4 xl:col-4 lg:col-4">
                                        <div className="flex flex-column">
                                            <label className="mb-2">Expire Date</label>
                                            <InputText
                                                type="date"
                                                name="expireDate"
                                                id="expireDate"
                                                placeholder="Select Expire Date"
                                                // value={x.expireDate.split('T')[0]}
                                                value={formik.values.expireDate}
                                                // onChange={(e) => handleInputChange(e, i)}
                                                onChange={formik.handleChange}
                                                className={classNames({ "p-invalid": isFormFieldValid("expireDate") }, "w-full md:w-10 inputClass")} />
                                            {getFormErrorMessage("expireDate")}
                                        </div>
                                    </div>
                                    <div className="col-12 md:col-4 xl:col-4 lg:col-4">
                                        <div className="flex flex-column">
                                            <label className="mb-2">Discount %</label>
                                            <InputText 
                                                type="number"
                                                name="discount"
                                                id="discount"
                                                
                                                //value={x.discount}
                                                value={formik.values.discount}
                                                onChange={formik.handleChange} 
                                                className={classNames({ "p-invalid": isFormFieldValid("discount") }, "w-full md:w-10 inputClass")} />
                                            {getFormErrorMessage("discount")}
                                        </div>
                                    </div>

                                    <div className="col-12 md:col-6 lg:col-6 xl:col-6">
                                        <div className="flex flex-column">
                                            <label className="mb-2">is Active?</label>
                                            <Checkbox id="isActive" name="isActive" inputId="binary" checked={formik?.values?.isActive} onChange={formik.handleChange} />
                                            {getFormErrorMessage("isActive")}
                                        </div>
                                    </div>

                                    <div className="col-12 md:col-12 xl:col-12 lg:col-12 align___Item pt-4">
                                        <Button className="Cancelbtn mr-2" onClick={getOrderData} label="Cancel"></Button>
                                        <Button autoFocus type="submit" className="Savebtn" label="Save"></Button>
                                    </div>

                                </div>
                            {/* </div> */}
                            </div>
                        </React.Fragment>

                    </div>


                    {/* </div> */}

                    {/* </div> */}
                    {/* </div>  */}
                </form>
            )}
        </>
    );
};
export default AddEditPromotionManagement;
