import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { useHistory } from "react-router-dom";
import { useFormik } from "formik";
import classNames from "classnames";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
// import { RadioButton } from "primereact/radiobutton";
import { Editor } from "primereact/editor";
// import { MultiSelect } from "primereact/multiselect";
import { Checkbox } from "primereact/checkbox";
import * as Yup from "yup";
// import ImageUpload from "../../../components/ImageUpload/index";
//
import MultiImage from "../../../components/MultiImage";
// import MultipleFileUpload from "../../../components/multipleFileUpload";
import { handleGetRequest } from "../../../service/GetTemplate";
import { handlePostRequest } from "../../../service/PostTemplate";
import { handlePatchRequest } from "../../../service/PatchTemplete";
import { useDispatch } from "react-redux";
import { ProgressSpinner } from "primereact/progressspinner";

const AddEditProduct = ({ getProductData, onHide, editable, productRowData }) => {
    const [loading, setLoading] = useState(false);
    const [isDisable, setisDisable] = useState(false);
    const [allImages, setAllImages] = useState([]);
    const [featureImage, setFeatureImage] = useState("");
    // const [multiProductImages, setMultiProductImages] = useState([]);
    // const [variantLength, setVariantLength] = useState();
    const [variantList, setVariantList] = useState([{ colorName: "", actualPrice: "", size: "", colorHex: "", discountedPrice: "", quantity: "", sku: "" }]);
    const [VariantError, setVariantError] = useState([{ colorName: "", actualPrice: "", size: "", colorHex: "", discountedPrice: "", quantity: "", sku: "" }]);
    // const [loadingIcon, setloadingIcon] = useState("pi pi-save");
    const [category, setCategory] = useState();
    const [subCategory, setSubCategory] = useState();
    // const [taxType, setTaxType] = useState();
    // const [taxHead, setTaxHead] = useState();
    const [htmlText, setHtmlText] = useState();

    const history = useHistory();
    const dispatch = useDispatch();

    const getProductById = async () => {
        setLoading(true);
        const res = await handleGetRequest(`api/v1/products/details?productId=${productRowData}`, true);
        if (res) {
            const keyData = res;
            // setUserId(res.userId);
            setLoading(false);
            Object.keys(keyData).forEach((key) => {
                if (formik.initialValues.hasOwnProperty(key)) {
                    formik.setFieldValue(key, keyData[key]);
                }
            });

            let description = keyData?.description;
            setHtmlText(description);
            setVariantList(keyData?.variant);
            let metaDataString = (keyData?.metaData).toString();
            formik.setFieldValue("metaDataString", metaDataString);

            let metaDescriptionString = (keyData?.metaDescription).toString();
            formik.setFieldValue("metaDescriptionString", metaDescriptionString);

            let categoryId = keyData?.category?._id;
            formik.setFieldValue("categoryId", categoryId);

            let subcategoryId = keyData?.subcategory?._id;
            formik.setFieldValue("subcategoryId", subcategoryId);
        }

        // // const rolesName = roles.map((name) => name?._id);
    };
    const getCategoryData = async () => {
        const res = await handleGetRequest("api/v1/category/all", false);
        if (res) {
            setCategory(res);
        }
    };
    const getSubCategoryData = async () => {
        const res = await handleGetRequest("api/v1/subcategory/all", false);
        if (res) {
            setSubCategory(res);
        }
    };
    // const getTaxHeads = async () => {
    //     const res = await handleGetRequest("api/v1/tax/head", false);
    //     if (res) {
    //         setTaxHead(res);
    //     }
    // };
    // const getTaxTypes = async () => {
    //     const res = await handleGetRequest("api/v1/tax/type", false);
    //     if (res) {
    //         setTaxType(res);
    //     }
    // };

    useEffect(() => {
        getCategoryData();
        getSubCategoryData();
        // getTaxHeads();
        // getTaxTypes();
    }, []);

    useEffect(() => {
        if (productRowData !== undefined && productRowData !== null && editable === true) {
            // setisDisable(true);
            getProductById();
        }
    }, []);

    const validationSchema = Yup.object().shape({
        categoryId: Yup.mixed().required("This field is required"),
        subcategoryId: Yup.mixed().required("This field is required"),
        name: Yup.mixed().required("This field is required"),
        title: Yup.mixed().required("This field is required"),
        // metaDataString: Yup.mixed().required("This field is required"),
        metaDescriptionString: Yup.mixed().required("This field is required"),
        vendor: Yup.mixed().required("This field is required"),
        // name: Yup.mixed().required("This field is required"),
        // quantity: Yup.mixed().required("This field is required"),
        // price: Yup.mixed().required("This field is required"),
        // description: Yup.mixed().required("This field is required"),
        // additionalDescription: Yup.mixed().required("This field is required"),

        // binary: Yup.mixed().required("This field is required"),
        // tax_type: Yup.mixed().required("This field is required"),
        // tax_head: Yup.mixed().required("This field is required"),
        // practical: Yup.mixed().required("This field is required"),
        // theory: Yup.mixed().required("This field is required"),
        // tax: Yup.mixed().required("This field is required"),
    });

    const formik = useFormik({
        validationSchema: validationSchema,
        initialValues: {
            categoryId: "",
            subcategoryId: "",
            name: "",
            title: "",
            // quantity: "",
            // price: "",
            description: "",
            longDescription: "",
            vendor: "",
            thumbnail: "",
            variant: "",
            // discountedPrice: "",
            metaDataString: "",
            metaDescriptionString: "",
            isActive: true,
            isColor: true,
            variant: true
        },
        onSubmit: async (data) => {
            setLoading(true);
            // setloadingIcon("pi pi-spin pi-spinner");
            if (editable === true) {
                data["productId"] = productRowData;
                //Sending Multiple Images
                let multipleImages = JSON.parse(JSON.stringify(allImages));
                // let remainingImages = multipleImages.shift();
                data["images"] = multipleImages;

                //Single Feature Image
                // data["thumbnail"] = featureImage===undefined? null:featureImage;
                data["thumbnail"] = featureImage;

                let metaDataString = data["metaDataString"].toString();
                let metaDataStringArray = metaDataString.split(",");
                let metaDescriptionString = data["metaDescriptionString"].toString();
                let metaDescriptionArray = metaDescriptionString.split(",");
                data["variant"] = variantList;
                data["metaData"] = metaDataStringArray;
                data["metaDescription"] = metaDescriptionArray;
                data["longDescription"] = htmlText;
                data["description"] = htmlText;
                delete data["metaDataString"];
                delete data["metaDescriptionString"];
                
                const res = await dispatch(handlePatchRequest(data, "api/v1/products/", true, true));
                
                if (res?.status === 200) {
                    await getProductData();
                    formik.resetForm();
                    onHide();
                }
            } else {
                let multipleImages = JSON.parse(JSON.stringify(allImages));
                // let remainingImages = multipleImages.shift();
                let metaDataString = data["metaDataString"].toString();
                let metaDataStringArray = metaDataString.split(",");
                let metaDescriptionString = data["metaDescriptionString"].toString();
                let metaDescriptionArray = metaDescriptionString.split(",");
                data["quantity"] = parseInt.data["quantity"];
                data["metaData"] = metaDataStringArray;
                data["metaDescription"] = metaDescriptionArray;
                data["name"] = data["title"];
                data["thumbnail"] = featureImage;
                data["images"] = multipleImages;
                data["variant"] = variantList;
                data["longDescription"] = htmlText;
                data["description"] = htmlText;
                delete data["metaDataString"];
                delete data["metaDescriptionString"];

                
                const res = await dispatch(handlePostRequest(data, "api/v1/products/", true));
                if (res?.status === 200) {
                    await getProductData();
                    formik.resetForm();
                    onHide();
                }
            }
            setLoading(false);
            // setloadingIcon("pi pi-save");
        },
    });



    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };
    // const handleFormReset = () => {
    //     formik.resetForm();
    // };
    const handleCancel = (e) => {
        e.preventDefault();
        onHide();
    };
    //Callback Function to Get Base64 of Uploaded Image
    const handleImages = (images) => {
        setAllImages(images);
        setFeatureImage(images[0]);
    };
    const handleAddClick = (e, i) => {
        e.preventDefault();
        setVariantError([...VariantError, { colorName: "", actualPrice: "", size: "", colorHex: "", discountedPrice: "", quantity: "", sku: "" }]);
        setVariantList([...variantList, { colorName: "", actualPrice: "", size: "", colorHex: "", discountedPrice: "", quantity: "", sku: "" }]);
    };

    const handleRemoveClick = (e, index) => {
        e.preventDefault();
        const errorList = [...VariantError];
        errorList.splice(index, 1);
        setVariantError(errorList);
        const variant = [...variantList];
        variant.splice(index, 1);
        setVariantList(variant);
    };
    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        
    
        const variant = [...variantList];
        variant[index][name] = value;
        setVariantList(variant);
    };

    useEffect(() => {
        
    }, [formik.values])


    return (
        <>
            {loading ? (
                <ProgressSpinner style={{ display: "flex", justifyContent: "center", alignItem: "center", height: "50vh" }} strokeWidth="2" stroke-miterlimit="10" />
            ) : (
                <form onSubmit={formik.handleSubmit}>
                    <div>
                        <div className="grid">
                            <div className="col-12 md:col-6 lg:col-6 xl:col-6">
                                <div className="flex flex-column">
                                    <label className="mb-2">Category</label>
                                    <Dropdown
                                        id="categoryId"
                                        name="categoryId"
                                        placeholder="Select Category"
                                        className={classNames({ "p-invalid": isFormFieldValid("categoryId") }, "w-full md:w-10 inputClass")}
                                        value={formik.values.categoryId}
                                        options={category}
                                        onChange={formik.handleChange}
                                        optionValue="_id"
                                        optionLabel="name"
                                    />
                                    {getFormErrorMessage("categoryId")}
                                </div>
                            </div>
                            <div className="col-12 md:col-6 lg:col-6 xl:col-6">
                                <div className="flex flex-column">
                                    <label className="mb-2">Sub-Category</label>
                                    <Dropdown
                                        id="subcategoryId"
                                        name="subcategoryId"
                                        placeholder="Select Sub-Category"
                                        className={classNames({ "p-invalid": isFormFieldValid("subcategoryId") }, "w-full md:w-10 inputClass")}
                                        value={formik.values.subcategoryId}
                                        options={subCategory}
                                        onChange={formik.handleChange}
                                        optionValue="_id"
                                        optionLabel="name"
                                    />
                                    {getFormErrorMessage("subcategoryId")}
                                </div>
                            </div>
                            <div className="col-12 md:col-6 lg:col-6 xl:col-6">
                                <div className="flex flex-column">
                                    <label className="mb-2">Product Name</label>
                                    <InputText placeholder="Enter Product Name" id="name" name="name" value={formik?.values?.name?.replace(/\s\s+/g, " ")} onChange={formik.handleChange} className={classNames({ "p-invalid": isFormFieldValid("name") }, "w-full md:w-10 inputClass")} />
                                    {getFormErrorMessage("name")}
                                </div>
                            </div>

                            <div className="col-12 md:col-6 lg:col-6 xl:col-6">
                                <div className="flex flex-column">
                                    <label className="mb-2">Product Title</label>
                                    <InputText placeholder="Enter Product Name" id="title" name="title" value={formik?.values?.title?.replace(/\s\s+/g, " ")} onChange={formik.handleChange} className={classNames({ "p-invalid": isFormFieldValid("title") }, "w-full md:w-10 inputClass")} />
                                    {getFormErrorMessage("title")}
                                </div>
                            </div>
                            <div className="col-12 md:col-6 lg:col-6 xl:col-6">
                                <div className="flex flex-column">
                                    <label className="mb-2">is Active?</label>
                                    <Checkbox id="isActive" name="isActive" inputId="binary" checked={formik?.values?.isActive} onChange={formik.handleChange} />
                                    {getFormErrorMessage("quantity")}
                                </div>
                            </div>
                            <div className="col-12 md:col-6 lg:col-6 xl:col-6">
                                <div className="flex flex-column">
                                    <label className="mb-2">Meta Data</label>
                                    <InputText
                                        placeholder="Enter Meta Data"
                                        id="metaDataString"
                                        name="metaDataString"
                                        value={formik?.values?.metaDataString?.replace(/\s\s+/g, " ")}
                                        onChange={formik.handleChange}
                                        className={classNames({ "p-invalid": isFormFieldValid("metaDataString") }, "w-full md:w-10 inputClass")}
                                    />
                                    {getFormErrorMessage("metaDataString")}
                                </div>
                            </div>
                            <div className="col-12 md:col-6 lg:col-6 xl:col-6">
                                <div className="flex flex-column">
                                    <label className="mb-2">Meta Description</label>
                                    <InputText
                                        placeholder="Enter Meta Description"
                                        id="metaDescriptionString"
                                        name="metaDescriptionString"
                                        value={formik?.values?.metaDescriptionString?.replace(/\s\s+/g, " ")}
                                        onChange={formik.handleChange}
                                        className={classNames({ "p-invalid": isFormFieldValid("metaDescriptionString") }, "w-full md:w-10 inputClass")}
                                    />
                                    {getFormErrorMessage("metaDescriptionString")}
                                </div>
                            </div>
                            <div className="col-12 md:col-6 lg:col-6 xl:col-6">
                                <div className="flex flex-column">
                                    <label className="mb-2">Vendor</label>
                                    <InputText placeholder="Enter Name" id="vendor" name="vendor" value={formik?.values?.vendor?.replace(/\s\s+/g, " ")} onChange={formik.handleChange} className={classNames({ "p-invalid": isFormFieldValid("vendor") }, "w-full md:w-10 inputClass")} />
                                    {getFormErrorMessage("vendor")}
                                </div>
                            </div>

                            <div className="col-12 md:col-6 lg:col-6 xl:col-6">
                                <div className="flex flex-column">
                                    <label className="mb-2">Images</label>
                                    <MultiImage handleImages={handleImages} />
                                    {/* <ImageUpload handleImages={handleImages} className="w-full md:w-10 inputClass" /> */}
                                    {/* <InputText type="file" className="w-full md:w-10 inputClass" /> */}
                                </div>
                            </div>
                            <div className="col-12 md:col-6 lg:col-6 xl:col-6">
                                <div className="flex flex-column">
                                    <label className="mb-2">Has Color?</label>
                                    <Checkbox id="isColor" name="isColor" inputId="binary" checked={formik?.values?.isColor} onChange={formik.handleChange} />
                                    {getFormErrorMessage("isColor")}
                                </div>
                            </div>
                            <div className="col-12 md:col-6 lg:col-6 xl:col-6">
                                <div className="flex flex-column">
                                    <label className="mb-2">Has Variant?</label>
                                    <Checkbox id="variant" name="variant" inputId="binary" checked={formik?.values?.variant} onChange={formik.handleChange} />
                                    {getFormErrorMessage("variant")}
                                </div>
                            </div>
                            <div className="col-12 md:col-6 lg:col-6 xl:col-6">
                                <div className="flex flex-column">
                                    <label className="mb-2">Has Size?</label>
                                    <Checkbox id="size" name="size" inputId="binary" checked={formik?.values?.size} onChange={formik.handleChange} />
                                    {getFormErrorMessage("size")}
                                </div>
                            </div>

                            {variantList &&
                                variantList?.map((x, i) => {
                                    return (
                                        // <div className="col-12 md:col-12 lg:col-12 xl:col-12">
                                        //     <div className="flex flex-column">

                                        <React.Fragment key={i}>
                                            {/* <div className="col-12 md:col-12 xl:col-12 lg:col-12 pt-3 pb-3">
                                                <label>
                                                    <span className="pr-5">
                                                        <b>o</b>
                                                    </span>
                                                    <b> Variants Details</b>
                                                </label>
                                            </div> */}
                                            <label className="mb-3">Variants Details - {i + 1}</label>
                                            <div className="grid Variants">

                                                <div className="col-12 md:col-6 lg:col-6 xl:col-6">
                                                    <div className="flex flex-column">
                                                        <label className="mb-2">Color Name</label>
                                                        <InputText name="colorName" placeholder="Enter Color Name" value={x.colorName} onChange={(e) => handleInputChange(e, i)} className={classNames({ "p-invalid": isFormFieldValid("colorName") }, "w-full md:w-10 inputClass")} />
                                                        {getFormErrorMessage("colorName")}
                                                    </div>
                                                </div>
                                                <div className="col-12 md:col-6 lg:col-6 xl:col-6">
                                                    <div className="flex flex-column">
                                                        <label className="mb-2">Color Hex Code</label>
                                                        <InputText name="colorHex" placeholder="Enter Color Hex Code" value={x.colorHex} onChange={(e) => handleInputChange(e, i)} className={classNames({ "p-invalid": isFormFieldValid("colorHex") }, "w-full md:w-10 inputClass")} />
                                                        {getFormErrorMessage("colorHex")}
                                                    </div>
                                                </div>
                                                {/* </div>{ colorName: "", actualPrice: "", colorHex: "", discountedPrice: "", quantity: "", sku: "" } */}
                                                <div className="col-12 md:col-6 lg:col-6 xl:col-6">
                                                    <div className="flex flex-column">
                                                        <label className="mb-2">Actual Price</label>
                                                        <InputText name="actualPrice" placeholder="Enter Actual Price" value={x.actualPrice} onChange={(e) => handleInputChange(e, i)} className={classNames({ "p-invalid": isFormFieldValid("actualPrice") }, "w-full md:w-10 inputClass")} />
                                                        {getFormErrorMessage("actualPrice")}
                                                    </div>
                                                </div>
                                                <div className="col-12 md:col-6 lg:col-6 xl:col-6">
                                                    <div className="flex flex-column">
                                                        <label className="mb-2">Discounted Price</label>
                                                        <InputText
                                                            name="discountedPrice"
                                                            placeholder="Enter Discounted Price"
                                                            value={x.discountedPrice}
                                                            onChange={(e) => handleInputChange(e, i)}
                                                            className={classNames({ "p-invalid": isFormFieldValid("discountedPrice") }, "w-full md:w-10 inputClass")}
                                                        />
                                                        {getFormErrorMessage("discountedPrice")}
                                                    </div>
                                                </div>
                                                <div className="col-12 md:col-6 lg:col-6 xl:col-6">
                                                    <div className="flex flex-column">
                                                        <label className="mb-2">Size</label>
                                                        <InputText name="size" placeholder="Enter Size" value={x.size} onChange={(e) => handleInputChange(e, i)} className={classNames({ "p-invalid": isFormFieldValid("size") }, "w-full md:w-10 inputClass")} />
                                                        {getFormErrorMessage("size")}
                                                    </div>
                                                </div>
                                                <div className="col-12 md:col-6 lg:col-6 xl:col-6">
                                                    <div className="flex flex-column">
                                                        <label className="mb-2">Quantity</label>
                                                        <InputText type="number" keyfilter="int" name="quantity" placeholder="Enter Quantity" value={x.quantity} onChange={(e) => handleInputChange(e, i)} className={classNames({ "p-invalid": isFormFieldValid("quantity") }, "w-full md:w-10 inputClass")} />
                                                        {getFormErrorMessage("quantity")}
                                                    </div>
                                                </div>
                                                <div className="col-12 md:col-6 lg:col-6 xl:col-6">
                                                    <div className="flex flex-column">
                                                        <label className="mb-2">SKU</label>
                                                        <InputText name="sku" id="sku" placeholder="Enter SKU" value={x.sku} onChange={(e) => handleInputChange(e, i)} className={classNames({ "p-invalid": isFormFieldValid("sku") }, "w-full md:w-10 inputClass")} />
                                                        {getFormErrorMessage("sku")}
                                                    </div>
                                                </div>


                                                <div className="col-12 md:col-6 lg:col-6 xl:col-6">
                                                    <div className="flex flex-row">
                                                        <div className="field col-12 md:col-1 sm:col-12 button-style">{variantList.length - 1 === i && <Button icon="pi pi-plus" onClick={(e) => handleAddClick(e, i)} disabled={isDisable} />}</div>
                                                        {/* <div className="field col-12 md:col-1 sm:col-12 button-style">{<Button icon="pi pi-plus" onClick={(e) => handleAddClick(e, i)} disabled={isDisable} />}</div> */}
                                                        {/* <div className="field col-12 md:col-1 sm:col-12 button-style">{<Button onClick={(e) => handleRemoveClick(e, i)} disabled={isDisable} icon="pi pi-minus" className="p-button-danger" />}</div> */}
                                                        <div className="field col-12 md:col-1 sm:col-12 button-style">{variantList.length !== 1 && <Button onClick={(e) => handleRemoveClick(e, i)} disabled={isDisable} icon="pi pi-minus" className="p-button-danger" />}</div>

                                                    </div>
                                                </div>
                                            </div>
                                        </React.Fragment>

                                        //     </div>
                                        // </div>
                                    );
                                })}
                            <div className="col-12 md:col-12 lg:col-12 xl:col-12">
                                <div className="flex flex-column">
                                    <label className="mb-2">Description</label>
                                    <InputText placeholder="Enter Description" id="description" name="description" value={formik?.values?.description?.replace(/\s\s+/g, " ")} onChange={formik.handleChange} className={classNames({ "p-invalid": isFormFieldValid("description") }, "w-full md:w-10 inputClass")} />
                                    {getFormErrorMessage("description")}
                                    {/* <InputText type="text" id="description" name="description" style={{ height: "220px" }} value={htmlText} onTextChange={(e) => setHtmlText(e.htmlValue)} /> */}
                                    {/* <Editor id="description" name="description" style={{height:'320px'}} value={formik?.values?.description?.replace(/\s\s+/g, " ")} onTextChange={formik.handleChange} /> */}
                                </div>
                            </div>
                            <div className="col-12 md:col-12 lg:col-12 xl:col-12">
                                <div className="flex flex-column">
                                    <label className="mb-2">Long Description</label>
                                    <Editor id="longDescription" name="longDescription" style={{ height: "320px" }} value={formik.values.longDescription} onTextChange={(e) => setHtmlText(e.htmlValue)} />
                                    {/* <Editor id="description" name="description" style={{height:'320px'}} value={formik?.values?.description?.replace(/\s\s+/g, " ")} onTextChange={formik.handleChange} /> */}
                                </div>
                            </div>

                            {/* TAX PART IS PENDING BY CLIENT */}
                            {/* <div className="col-12 md:col-6 lg:col-6 xl:col-6">
                    <div className="flex">
                        <label htmlFor="binary" className="p-pl-2"><b>is Taxable</b></label>
                        <Checkbox inputId="binary" value={formik.values.isTaxable} checked={formik.values.isTaxable} onChange={formik.handleChange} />
                    </div>
                </div><div className="col-12 md:col-12 lg:col-12 xl:col-12 innr_padding">
                   <div className="grid">
                   <div className="col-12 md:col-6 lg:col-6 xl:col-6">
                        <div className="flex flex-column">
                            <label className="mb-2">Tax Type</label>
                            <Dropdown           id="tax_type"  
                                            name="tax_type"
                                            placeholder="Select Tax Type"className={classNames({ "p-invalid": isFormFieldValid("tax_type") }, "w-full md:w-10 inputClass")} value={formik.values.tax_type} options={taxType} onChange={formik.handleChange} optionValue="_id" optionLabel="taxType" />
                        </div>
                    </div>
                    <div className="col-12 md:col-6 lg:col-6 xl:col-6">
                        <div className="flex flex-column">
                            <label className="mb-2">Tax Head</label>
                            <Dropdown           id="tax_head"  
                                            name="tax_head"
                                            placeholder="Select Tax Head"className={classNames({ "p-invalid": isFormFieldValid("tax_head") }, "w-full md:w-10 inputClass")} value={formik.values.tax_head} options={taxType} onChange={formik.handleChange} optionValue="_id" optionLabel="taxType" />
                        </div>
                    </div>
                   </div>
                </div>

                <div className="col-12 md:col-12 lg:col-12 xl:col-12 pt-4 pb-4">
                    <div className="flex radio_button">
                        <RadioButton className="mr-2 ml-2" inputId="Practical" name="Practical" value="Practical" onChange={(e) => setCity(e.value)} checked={city === 'Percentage'} />
                        <label htmlFor="Practical">Percentage</label>
                        <RadioButton className="mr-2 ml-2" inputId="Theory" name="Theory" value="Theory" onChange={(e) => setCity(e.value)} checked={city === 'Amount'} />
                        <label htmlFor="Theory">Amount</label>
                    </div>
                </div>
                <div className="col-12 flex innr_padding">
                    <div className="col-12 md:col-6 lg:col-6 xl:col-6">
                        <div className="flex flex-column">
                            <label className="mb-2">Tax </label>
                            <InputText type="text" placeholder="Enter" className="w-full md:w-10 inputClass" />
                        </div>
                    </div>

                </div> */}
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

export default AddEditProduct;
