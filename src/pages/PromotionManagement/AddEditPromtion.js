import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { useHistory, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import classNames from "classnames";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
// import { RadioButton } from "primereact/radiobutton";
// import { Editor } from "primereact/editor";
import { MultiSelect } from "primereact/multiselect";
// import { Checkbox } from "primereact/checkbox";
import AddEditImage from "../../components/AddEditImage";
import * as Yup from "yup";
import { handleGetRequest } from "../../service/GetTemplate";
import { handlePostRequest } from "../../service/PostTemplate";
import { handlePatchRequest } from "../../service/PatchTemplete";
import { useDispatch } from "react-redux";
import { ProgressSpinner } from "primereact/progressspinner";

const AddEditPromtions = ({ onHide }) => {
    let { search } = useLocation();
    const query = new URLSearchParams(search);
    const promotionRowData = query.get("promotionid");
    const editable = promotionRowData ? true : false;
    const [categories, setCategories] = useState();
    const [subCategories, setSubCategories] = useState();
    const [products, setProducts] = useState();
    const [promotion, setPromotion] = useState([{ category: "", subcategory: "", productId: "", discount: "", launchDate: "", endingDate: "", isActive: "" }]);
    const [promotionError, setPromotionError] = useState([{ category: "", subcategory: "", productId: "", discount: "", launchDate: "", endingDate: "", isActive: "" }]);
    const [loading, setLoading] = useState(false);
    const [fileUploadData, setfileUploadData] = useState("");
    // const [loadingIcon, setloadingIcon] = useState("pi pi-save");

    // const [promotionData, setPromotionData] = useState();

    const history = useHistory();
    const dispatch = useDispatch();

    const validationSchema = Yup.object().shape({
        campaignName: Yup.string().required("This field is required."),
    
    });

    const formik = useFormik({
        validationSchema: validationSchema,
        initialValues: {
            campaignName: "",
            banner: "",
        

        },

        onSubmit: async (data) => {
            // data["banner"] = fileUploadData;
            // data["promotionId"] = promotion;

            // console.log("data", data)
            // setLoading(true);
            // setloadingIcon("pi pi-spin pi-spinner");
            data["banner"] = fileUploadData;
            data["promotionId"] = promotion;
            setLoading(true);
            if (editable === true) {

                const res = await dispatch(handlePatchRequest(data, "api/v1/mPromotion/", true, true));
                if (res?.status === 200) {
                    await getPromotionData();
                    //formik.resetForm();

                }
                onHide();
            } else {
                data["image"] = fileUploadData;
                data["promotionId"] = promotion;
                const res = await dispatch(handlePostRequest(data, "api/v1/mPromotion/", true, true));
                if (res?.status === 200) {
                    await getPromotionData();
                    history.push("./promotionmanagement");
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
        // console.log("promotionRowData",promotionRowData);
        const res = await handleGetRequest(`api/v1/mPromotion/mPromotionDetailById?promotionId=${promotionRowData}`);
        // console.log("res of Promotion", res);
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
                // console.log("kewwys", objects.category);
                // console.log("keys",objects[index]?.keys);
                // console.log("promotion[index][keys]", objects[keys]);
                // promotion[index][keys] = 
            })

        })

        // console.log("keyData",res?.promotion)
    };
    // console.log("promtion",promotion);
    const handleImages = (images) => {
        setfileUploadData(images);
    };
    const getAllCategories = async () => {
        const response = await handleGetRequest("api/v1/category/all");
        if (response) {
            setCategories(response);
        }
    };
    const getAllSubCategories = async () => {
        const response = await handleGetRequest("api/v1/subcategory/all", false);
        if (response) {
            setSubCategories(response);
        }
    };
    const getAllProducts = async () => {
        const response = await handleGetRequest("api/v1/products/all", false);
        if (response) {
            setProducts(response);
        }
    };

    useEffect(() => {
        getAllCategories();
        getAllSubCategories();
        getAllProducts();
    }, []);

    useEffect(() => {
        if (promotionRowData !== undefined && promotionRowData !== null && editable === true) {
            getPromotionData();
        }
    }, []);
    const getOrderData = () => {
        history.push("/promotionmanagement");
    };
    const CheckValidations = (e, index) => {
        const { name, value } = e.target;
        //Logic for validations
        if (value === "") {
            const fieldError = [...promotionError];
            fieldError[index][name] = "This field is required";
            setPromotionError(fieldError);
        } else {
            const fieldError = [...promotionError];
            fieldError[index][name] = "";
            setPromotionError(fieldError);

            // if (!name === "startDate") {
            //     const promotionError = [...promotionError];
            //     promotionError[index][name] = "";
            //     setPromotionError(promotionError);
            // }
        }
    };
    const handleAddClick = (e, i) => {
        e.preventDefault();
        setPromotionError([...promotionError, { category: "", subcategory: "", productId: "", discount: "", launchDate: "", endingDate: "", isActive: "", }]);
        setPromotion([...promotion, { category: "", subcategory: "", productId: "", discount: "", launchDate: "", endingDate: "", isActive: "" }]);
    };
    const handleRemoveClick = (e, index) => {
        e.preventDefault();
        const errorList = [...promotionError];
        errorList.splice(index, 1);
        setPromotionError(errorList);
        const promotionDetails = [...promotion];
        promotionDetails.splice(index, 1);
        setPromotion(promotionDetails);
    };
    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        if (name === "discount") {
            // console.log("name: ", name)
            // console.log("value", value)
            const promotionDetails = [...promotion];
            promotionDetails[index][name] = parseInt(value);
            setPromotion(promotionDetails);
            CheckValidations(e, index);
        }
        else {
            // console.log("name: ", name)
            // console.log("value", value)
            const promotionDetails = [...promotion];
            promotionDetails[index][name] = value;
            setPromotion(promotionDetails);
            CheckValidations(e, index);
        }
    };

    const statusOption = [
        { name: 'Active', status: true },
        { name: 'InActive', status: false },
    ];
    // console.log("promtion", promotion);
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

                        <div className="card-body">
                            <div className="grid">
                                <div className="col-12 md:col-4 xl:col-4 lg:col-4">
                                    <div className="flex flex-column">
                                        <label className="mb-4">Campaign Name</label>
                                        <InputText id="campaignName" name="campaignName" onChange={formik.handleChange} value={formik?.values?.campaignName} type="text" placeholder="Enter Campaign Name" className="w-full md:w-10 inputClass" />
                                    </div>
                                </div>
                                <div className="col-12 md:col-4 xl:col-4 lg:col-4">
                                    <div className="flex flex-column">
                                        <label className="mb-2">Campaign Banner</label>
                                        <AddEditImage handleImages={handleImages} editable={editable} EditIconImage={formik?.values?.banner} />
                                    </div>
                                </div>
                                {promotion &&
                                    promotion?.map((x, i) => {
                                        return (
                                            <React.Fragment key={i}>
                                                <div className="col-12 md:col-12 xl:col-12 lg:col-12 pt-3 pb-3">
                                                    <label>
                                                        <span className="pr-5">
                                                            <b>{i + 1}</b>
                                                        </span>
                                                        Selected Promotion Items
                                                    </label>
                                                    <span className="m-2 button-style">{promotion.length - 1 === i && <Button icon="pi pi-plus" onClick={(e) => handleAddClick(e, i)} disabled={false} />}</span>
                                                    <span className="m-2 p-button-danger">{promotion.length !== 1 && <Button onClick={(e) => handleRemoveClick(e, i)} disabled={false} icon="pi pi-minus" className="p-button-danger" />}</span>

                                                    {/* <Button icon="pi pi-plus" className="plus_icons ml-5 mt-2" /> */}
                                                </div>
                                                <div className="col-12 flex innr_padding mt-3 mb-3">
                                                    <div className="grid">
                                                        <div className="col-12 md:col-4 xl:col-4 lg:col-4">
                                                            <div className="flex flex-column">
                                                                {/* category: "", subcategory: "", product: "", discount: "", launchDate: "", endingDate: "" */}
                                                                <label className="mb-2">Select Category </label>
                                                                <Dropdown
                                                                    // disabled={isDisable}
                                                                    placeholder="Select Category"
                                                                    className="w-full md:w-10 inputClass"
                                                                    name="category"
                                                                    id="category"
                                                                    htmlFor="category"
                                                                    onBlur={(e) => CheckValidations(e, i)}
                                                                    options={categories}
                                                                    value={x.category}
                                                                    optionLabel="name"
                                                                    optionValue="_id"
                                                                    onChange={(e) => handleInputChange(e, i)}
                                                                    
                                                                />
                                                                {getFormErrorMessage(promotionError?.[i]?.category)}
                                                            </div>
                                                        </div>
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
                                                                    onBlur={(e) => CheckValidations(e, i)}
                                                                    options={subCategories}
                                                                    value={x.subcategory}
                                                                    optionLabel="name"
                                                                    optionValue="_id"
                                                                    onChange={(e) => handleInputChange(e, i)}
                                                                />
                                                                {getFormErrorMessage(promotionError?.[i]?.subcategory)}
                                                            </div>
                                                        </div>
                                                        <div className="col-12 md:col-4 xl:col-4 lg:col-4">
                                                            <div className="flex flex-column">
                                                                <label className="mb-2">Discount %</label>
                                                                <InputText type="number" name="discount" placeholder="Enter Discount" value={x.discount} onChange={(e) => handleInputChange(e, i)} className={classNames({ "p-invalid": isFormFieldValid("discount") }, "w-full md:w-10 inputClass")} />
                                                                {getFormErrorMessage("discount")}
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
                                                                    onBlur={(e) => CheckValidations(e, i)}
                                                                    options={products}
                                                                    // value={x.productId}
                                                                    optionLabel="name"
                                                                    optionValue="_id"
                                                                    onChange={(e) => handleInputChange(e, i)}
                                                                />
                                                                {getFormErrorMessage(promotionError?.[i]?.productId)}
                                                            </div>
                                                        </div>
                                                        <div className="col-12 md:col-4 xl:col-4 lg:col-4">
                                                            <div className="flex flex-column">
                                                                <label className="mb-2">From Date</label>
                                                                <InputText type="date" name="launchDate" id="launchDate" placeholder="Select From Date" value={x.launchDate.split('T')[0]} onChange={(e) => handleInputChange(e, i)} className={classNames({ "p-invalid": isFormFieldValid("launchDate") }, "w-full md:w-10 inputClass")} />
                                                                {getFormErrorMessage(promotionError?.[i]?.launchDate)}
                                                            </div>
                                                        </div>
                                                        <div className="col-12 md:col-4 xl:col-4 lg:col-4">
                                                            <div className="flex flex-column">
                                                                <label className="mb-2">To Date</label>
                                                                <InputText
                                                                    type="date"
                                                                    name="endingDate"
                                                                    id="endingDate"
                                                                    placeholder="Select Till Date"
                                                                    value={x.endingDate.split('T')[0]}
                                                                    onChange={(e) => handleInputChange(e, i)}
                                                                    className={classNames({ "p-invalid": isFormFieldValid("endingDate") }, "w-full md:w-10 inputClass")} />
                                                                {getFormErrorMessage(promotionError?.[i]?.endingDate)}
                                                            </div>
                                                        </div>
                                                        <div className="col-12 md:col-4 lg:col-4 xs:col-4">
                                                            <div className="flex flex-column">
                                                                <label className="mb-2">Status</label>
                                                                <Dropdown
                                                                    id="status"
                                                                    name="status"
                                                                    value={formik.values.status}
                                                                    onChange={formik.handleChange}
                                                                    className={classNames({ "p-invalid": isFormFieldValid("status") }, "w-full md:w-10 inputClass")}
                                                                     options={statusOption}
                                                                    optionLabel="name"
                                                                    optionValue="status"
                                                                />
                                                                {getFormErrorMessage(promotionError?.[i]?.status)}
                                                            </div>
                                                          
                                                        </div>
                                                    </div>
                                                </div>
                                            </React.Fragment>
                                        );
                                    })}
                            </div>
                            <div className="grid">
                                <div className="col-12 md:col-12 xl:col-12 lg:col-12 align___Item pt-4">
                                    <Button className="Cancelbtn mr-2" onClick={getOrderData} label="Cancel"></Button>
                                    <Button autoFocus className="Savebtn" label="Save"></Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            )}
        </>
    );
};
export default AddEditPromtions;
