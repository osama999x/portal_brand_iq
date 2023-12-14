import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from 'primereact/inputtextarea';
import { useHistory } from "react-router-dom";
import { useFormik } from "formik";
import classNames from "classnames";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
// import { RadioButton } from "primereact/radiobutton";
//import { Editor } from "primereact/editor";
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
import { toast } from "react-toastify";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import EditSizeDialog from "./edit_size_dialog";
import { Image } from 'primereact/image';
//import { getClippingParents } from "@fullcalendar/core";
import { baseURL } from "../../../utilities/Config";
import { Chips } from 'primereact/chips';

const AddEditProduct = ({ getProductData, onHide, editable, productRowData }) => {
    const [loading, setLoading] = useState(false);
    const [disable, setDisable] = useState(false);
    const [allImages, setAllImages] = useState([]);
    const [featureImage, setFeatureImage] = useState("");
    const [category, setCategory] = useState();
    const [subCategory, setSubCategory] = useState([]);
    const [taxType, setTaxType] = useState();
    const [taxHead, setTaxHead] = useState();
    const [oldImages, setOldImages] = useState([])
    const [isFromColumn, setIsFromColumn] = useState(false)
    const [variantColorName, setVariantColorName] = useState(false)
    const history = useHistory();
    const dispatch = useDispatch();
    const [variants, setVariants] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [editSize, setEditSize] = useState(null);
    const [hasVariants, setHasVariants] = useState(false);
    const [hasColors, setHasColors] = useState(false);
    const [hasSizes, setHasSizes] = useState(false);
    const [showEditSizeDialog, setShowEditSizeDialog] = useState(false);
    const [editSizeIndex, setEditSizeIndex] = useState();
    const [showEditColorDialog, setShowEditColorDialog] = useState(false);
    const [editProductId, setEditProductId] = useState();
    const [expandedRows, setExpandedRows] = useState(null);
    const [isDiscount, setIsDiscount] = useState(false);

    const [existingSKUs, setExistingSKUs] = useState([]);

    const dialogFuncMap = {
        'showEditSizeDialog': setShowEditSizeDialog,
        'showEditColorDialog': setShowEditColorDialog,

    }
    const onClick = (name, position) => {
        dialogFuncMap[`${name}`](true);


    }


    const onHideInternal = (name) => {
        dialogFuncMap[`${name}`](false);
    }


    const isEmpty = (val) => {
        return val.length === 0;
    }



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
    const getTaxHeads = async () => {
        const res = await handleGetRequest("api/v1/tax/head", false);

        if (res) {
            setTaxHead(res);
        }
    };
    const getTaxTypes = async () => {
        const res = await handleGetRequest("api/v1/tax/type", false);

        if (res) {
            setTaxType(res);
        }
    };

    useEffect(() => {
        getCategoryData();
        getSubCategoryData();
        getTaxHeads();
        getTaxTypes();
    }, []);

    useEffect(() => {
        if (productRowData !== undefined && productRowData !== null && editable === true) {
            getProductById();
        }
    }, []);


    const stringToAbsString = (value) => {
        return Math.abs(parseInt(value.toString())).toString();
    }


    var validationSchema = Yup.object().shape({
        categoryId: Yup.mixed().required("This field is required"),
        subcategoryId: Yup.mixed().required("This field is required"),
        name: Yup.mixed().required("This field is required"),
        title: Yup.mixed().required("This field is required"),
        vendor: Yup.mixed().required("This field is required"),
        description: Yup.mixed().required("This field is required"),
        taxType: Yup.mixed().required("This field is required"),
        metaDataString: Yup.mixed().required("This field is required"),
        tags: Yup.mixed().required("This field is required"),
        sku: ((!hasColors && !hasSizes) || (hasSizes && !hasColors)) ? Yup.string().required("This field is required").test('sku-test', 'SKU can contain only letters, numbers, "_" and "-".', function (value) { return /^[\w-_]+$/.test(value); }) : null,
        actualPrice: !hasColors && !hasSizes ? Yup.number().required("This field is required").min(1, 'Minimum price is 1') : null,
        // actualPrice: Yup.number()
        //     .test('len', 'Actual Price must not exceed 10 characters', val => val.toString().length <= 10)
        //     .required('Actual Price is required'),
        //discountedPrice: isDiscount === true ? Yup.number().required("Discount Price is required").min(1, 'Minimum discount is 1') : null,
        quantity: !hasColors && !hasSizes ? Yup.number().required("Quantity is required is required").min(0, 'Minimum discount is 0') : null,


    });


    const formik = useFormik({
        validationSchema: validationSchema,
        initialValues: {
            categoryId: "",
            subcategoryId: "",
            name: "",
            taxType: "",
            title: "",
            description: "",
            longDescription: "",
            vendor: "",
            thumbnail: "",
            metaDataString: "",
            metaDescription: "",
            sku: "",
            actualPrice: '',
            discountedPrice: "",
            quantity: "",
            isActive: true,
            oneTimeDeal: false,
            isDiscount: false,
            tags: "",
            taxAmount: '',



        },
        onSubmit: async (data) => {


            //data['metaData']= data?.metaDataString.toString()

            if (hasVariants && !hasColors && !hasSizes) {
                toast.warn("Wrong selection");
                return;
            }


            if (allImages.length === 0 && editable === false) {
                toast.warn("Please choose images");
                return;
            }

            if (allImages.length === 0 && editable === true && oldImages.length === 0) {
                toast.warn("Please choose images");
                return;
            }


            if (!hasVariants) {

                if (editable) {

                    handleNoColorNoSizeEditSubmit(data);
                } else {
                    handleNoColorNoSize(data);
                }

            }
            if (hasVariants && hasColors && !hasSizes) {
                if (editable) {
                    handleColorsNoSizeEditSubmit(data)
                } else {
                    handleColorsNoSize(data);

                }

            }


            if (hasVariants && !hasColors && hasSizes) {
                if (editable) {
                    handleNoColorSizesEditSubmit(data);

                } else {
                    handleNoColorSizes(data);
                }
            }
            if (hasVariants && hasColors && hasSizes) {
                if (editable) {
                    handleColorSizeEditSubmit(data);
                } else {
                    handleColorSize(data);
                }
            }
        },
    });


    const getCommonFields = (data) => {
        let multipleImages = JSON.parse(JSON.stringify(allImages));

        let value = {
            "categoryId": data.categoryId,
            "subcategoryId": data.subcategoryId,
            "name": data.name,
            "taxType": data.taxType,
            "title": data.title,
            "description": data.description,
            "longDescription": data.longDescription,
            "isDiscount": data.isDiscount,
            "isDeal": false,
            "vendor": data.vendor,
            "metaData": data.metaDataString.join(','),
            "metaDescription": data.metaDescription,
            "thumbnail": featureImage,
            "isTaxable": true,
            "taxHead": "6385e95304beaf8be86471ce",
            "isPercentage": false,
            "taxAmount": data.taxAmount,
            "tags": data.tags,
            "addons": [],
            "isColor": true,

        };
        if (editable) {
            value['images'] = oldImages;
            value['newImages'] = multipleImages

        } else {
            value['images'] = multipleImages;

        }

        return value;

    }


    useEffect(() => {

        setIsDiscount(formik.values.isDiscount);
        setSizes([]);
        setVariants([]);
    }, [formik.values.isDiscount])


    useEffect(() => {

        setSizes([])
        setVariants([])
    }, [hasSizes, hasColors])

    const handleColorSize = async (data) => {
        if (variants.length === 0) {
            toast.warn("Please add atleast one variant")
            return;
        }
        let multipleImages = JSON.parse(JSON.stringify(allImages));

        data["thumbnail"] = featureImage;
        let body = {
            ...getCommonFields(data),
            "variant": variants,


        }
        handleApiCall(body);




    }
    const handleColorSizeEditSubmit = async (data) => {
        if (variants.length === 0) {
            toast.warn("Please add atleast one variant")
            return;
        }
        let multipleImages = JSON.parse(JSON.stringify(allImages));
        // let remainingImages = multipleImages.shift();

        data["thumbnail"] = featureImage;
        let body = {
            ...getCommonFields(data),
            "variant": variants,
        }
        handleUpdateApiCall(body);




    }


    const handleColorsNoSize = async (data) => {

        if (variants.length === 0) {
            toast.warn("Please add at least one variant")
            return;
        }
        data["thumbnail"] = featureImage;
        let body = {
            ...getCommonFields(data),
            "variant": variants,



        }
        handleApiCall(body);

    }
    const handleColorsNoSizeEditSubmit = async (data) => {

        if (variants.length === 0) {
            toast.warn("Please add at least one variant")
            return;
        }
        data["thumbnail"] = featureImage;
        let body = {
            ...getCommonFields(data),
            "variant": variants,



        }
        handleUpdateApiCall(body);


    }

    const handleNoColorNoSize = async (data) => {





        let multipleImages = JSON.parse(JSON.stringify(allImages));
        // let remainingImages = multipleImages.shift();

        data["thumbnail"] = featureImage;
        let body = {
            ...getCommonFields(data),
            "variant": [
                {
                    "colorName": "",
                    "colorHex": "",
                    "sku": data.sku,
                    "actualPrice": data.actualPrice,
                    "discountedPrice": data.discountedPrice,
                    "quantity": data.quantity,
                    "image": "",
                    "size": []
                }
            ],
        }


        handleApiCall(body);


    }
    const handleNoColorNoSizeEditSubmit = async (data) => {





        data["thumbnail"] = featureImage;
        let body = {
            ...getCommonFields(data),
            "variant": [
                {
                    "colorName": "",
                    "colorHex": "",
                    "sku": data.sku,
                    "actualPrice": data.actualPrice,
                    "discountedPrice": data.discountedPrice,
                    "quantity": data.quantity,
                    "image": "",
                    "size": []
                }
            ],
        }
        handleUpdateApiCall(body);
    }
    const handleNoColorSizes = async (data) => {

        let multipleImages = JSON.parse(JSON.stringify(allImages));
        data["thumbnail"] = featureImage;
        let body = {
            ...getCommonFields(data),
            "variant": [
                {
                    "colorName": "",
                    "colorHex": "",
                    "sku": data.sku,
                    "size": sizes,
                    "discountedPrice": data.discountedPrice,

                }
            ],
        }
        handleApiCall(body);


    }
    const handleNoColorSizesEditSubmit = async (data) => {
        let multipleImages = JSON.parse(JSON.stringify(allImages));
        // let remainingImages = multipleImages.shift();

        data["thumbnail"] = featureImage;
        let body = {
            ...getCommonFields(data),
            "variant": [
                {
                    "colorName": "",
                    "colorHex": "",
                    "sku": data.sku,

                    "size": sizes
                }
            ],
        }
        handleUpdateApiCall(body);


    }



    const handleApiCall = async (body) => {

        setLoading(true);
        const res = await dispatch(handlePostRequest(body, "api/v1/products/", true, true));
        setLoading(false);
        if (res?.status === 200) {
            await getProductData();
            formik.resetForm();
            onHide();
        }

    }
    const handleUpdateApiCall = async (body) => {

        body['productId'] = editProductId;
        setLoading(true);
        const res = await dispatch(handlePatchRequest(body, "api/v1/products/", true));

        setLoading(false);
        if (res?.status === 200) {
            await getProductData();
            formik.resetForm();
            onHide();
        }

    }



    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };

    //Callback Function to Get Base64 of Uploaded Image
    const handleImages = (images) => {
        setAllImages(images);
        setFeatureImage(images[0]);
    };

    const [addVariant, setAddVariant] = useState({
        colorName: "",
        colorHex: "",
        sku: "",
        actualPrice: "",
        // discountedPrice: "0",
        quantity: "",
        size: [],
        image: ""
    })
    const [addSize, setAddSize] = useState({
        "name": "",
        "actualPrice": "",
        "discountedPrice": "",
        "quantity": ""
    })

    const resetAddSize = () => {
        setAddVariant({
            "name": "",
            "actualPrice": "",
            "discountedPrice": "",
            "quantity": ""
        })
    }

    const resetAddVariant = () => {
        setAddVariant({
            colorName: '',
            colorHex: "",
            sku: "",
            actualPrice: "",
            discountedPrice: "",
            quantity: "",
            size: [],
            image: ""
        })
    }

    const onAddVariantsFieldsChange = (iden, val) => {
        if (val.length > 0 && (iden === 'actualPrice' || iden === 'discountedPrice' || iden === 'quantity')) {
            val = stringToAbsString(val);
        }


        setAddVariant((prev) => {
            prev[iden] = val;
            return { ...prev }
        })

    }
    const onSizeFieldsChange = (iden, val) => {
        if (val.length > 0 && (iden === 'actualPrice' || iden === 'discountedPrice' || iden === 'quantity')) {
            val = stringToAbsString(val);
        }
        setAddSize((prev) => {
            prev[iden] = val;
            return { ...prev }
        })

    }

    const productTypeComponent = () => {

        return <div className="grid">
            <div className="col-12">
                <Checkbox inputId="cb1" disabled={editable} onChange={(e) => setHasVariants(e.checked)} checked={hasVariants}></Checkbox>



                <label htmlFor="cb1" className="p-checkbox-label ml-3">Has variants</label>
            </div>
            {hasVariants && <div className="col-12">
                <Checkbox inputId="cb2" disabled={editable} onChange={(e) => setHasColors(e.checked)} checked={hasColors}></Checkbox>
                <label htmlFor="cb2" className="p-checkbox-label ml-3">Has colors</label>
            </div>}
            {hasVariants && <div className="col-12">
                <Checkbox inputId="cb3" disabled={editable} onChange={(e) => setHasSizes(e.checked)} checked={hasSizes}></Checkbox>
                <label htmlFor="cb3" className="p-checkbox-label ml-3">Has sizes</label>
            </div>}

        </div>;
    }




    const handleAddVariantSubmit = (e) => {
        e.preventDefault();
        let varnts = { ...addVariant };
        delete varnts['size'];
        delete varnts['image'];

        if (formik.values.isDiscount === false) {
            delete varnts['discountedPrice'];
        }

        let values = Object.values(varnts);
        if (values.filter((item) => item.length === 0).length > 0) {
            toast.warn("Please enter all the values");
            return;
        }
        if (formik.values.isDiscount) {
            if (varnts['discountedPrice'] < 1) {
                toast.warn("Discount price is required");
                return;
            }

        }
        let sku = addVariant.sku;
        if (variants.filter((item) => item.sku === sku).length > 0) {
            toast.warn("Please choose a unique sku");
            return;
        }


        //TODO: add validation on add variant



        setVariants((prev) => {
            return [...prev, { ...addVariant }];
        });
        resetAddVariant();

    }



    const handleColorSizeSubmit = (e) => {
        e.preventDefault();

        if (addVariant.colorHex.length === 0 || addVariant.colorName.length === 0 || addVariant.sku.length === 0) {
            toast.warn("Please enter all values");
            return;
        }
        if (sizes.length === 0) {
            toast.warn("Please enter atleast one size");
        }

        setVariants((prev) => {

            let variant = {
                "colorName": addVariant.colorName,
                "colorHex": addVariant.colorHex,
                "sku": addVariant.sku,
                "image": addVariant.image,
                "size":
                    sizes

            };
            return [...prev, variant];

        });
        resetAddSize();
        resetAddVariant();
        setSizes([]);

    }
    const handleAddSizeSubmit = (e) => {

        e.preventDefault();
        if (formik.values.isDiscount === false) {
            delete addSize['discountedPrice'];
        }

        let values = Object.values(addSize);

        if (values.filter((item) => item.toString().length === 0).length > 0) {
            toast.warn("Please enter all the values");
            return;
        }
        let name = addSize.name;
        if (formik.values.isDiscount) {
            if (addSize['discountedPrice'] < 1) {
                toast.warn("Discount price is required");
                return;
            }

        }
        if (sizes.filter((item) => item.name === name).length > 0) {
            toast.warn("Please choose a size name");
            return;
        }

        let addSizeVal = { ...addSize }
        setSizes((prev) => {
            return [...prev, { ...addSizeVal }];
        });


        addSize.quantity = ""
        addSize.discountedPrice = ""
        addSize.name = ""
        addSize.actualPrice = ""


    }


    const getProductById = async () => {
        setLoading(true);
        const res = await handleGetRequest(`api/v1/products/detailsWeb?productId=${productRowData}`, false);
        console.log("data", res)
        if (res) {
            let product = res;
            let firstVariant = product.variant[0];
            //No Color No Size
            setEditProductId(product._id);
            setOldImages(product.images);

            if (isEmpty(firstVariant.colorHex) && isEmpty(firstVariant.size)) {

                handleNoColorNoSizeProductEdit(product);
            }
            //No Color but Size
            if (isEmpty(firstVariant.colorHex) && !isEmpty(firstVariant.size)) {
                handleNoColorButSizeProductEdit(product);

            }
            // Color no Size
            if (!isEmpty(firstVariant.colorHex) && isEmpty(firstVariant.size)) {
                handleColorNoSizeProductEdit(product);
            }
            // Color Size
            if (!isEmpty(firstVariant.colorHex) && !isEmpty(firstVariant.size)) {
                handleColorSizeProductEdit(product);
            }


            const keyData = res;
            setLoading(false);
        }
    };

    //handling no color no size product editing

    const handleNoColorNoSizeProductEdit = (product) => {



        setHasVariants(false);
        setHasColors(false);
        setHasSizes(false);
        let variant = product.variant[0]
        formik.setFieldValue("categoryId", product.category._id);
        formik.setFieldValue("subcategoryId", product.subcategory._id);
        formik.setFieldValue("name", product.name);
        formik.setFieldValue("title", product.title);
        formik.setFieldValue("description", product.description);
        formik.setFieldValue("longDescription", product.longDescription);
        formik.setFieldValue("vendor", product.vendor);
        formik.setFieldValue("metaDataString", product.metaData.split(','));
        formik.setFieldValue("metaDescription", product.metaDescription);
        formik.setFieldValue("sku", variant.sku);
        formik.setFieldValue("actualPrice", variant.actualPrice);
        //formik.setFieldValue("discountedPrice", variant.discountedPrice);
        formik.setFieldValue("discountedPrice", product.discount);
        formik.setFieldValue("taxType", product.taxType);
        formik.setFieldValue("taxAmount", product.taxAmount);
        formik.setFieldValue("quantity", product.variant[0].quantity);
        formik.setFieldValue("discountedPrice", variant.discountedPrice);
        formik.setFieldValue("isDiscount", product.isDiscount);
        formik.setFieldValue("tags", product.tags);




    }
    const handleNoColorButSizeProductEdit = (product) => {
        setHasVariants(true);
        setHasColors(false);
        setHasSizes(true);

        let variant = product.variant[0]
        formik.setFieldValue("categoryId", product.category._id);
        formik.setFieldValue("subcategoryId", product.subcategory._id);
        formik.setFieldValue("name", product.name);
        formik.setFieldValue("title", product.title);
        formik.setFieldValue("description", product.description);
        formik.setFieldValue("longDescription", product.longDescription);
        formik.setFieldValue("vendor", product.vendor);
        formik.setFieldValue("metaDataString", product.metaData.split(','))
        formik.setFieldValue("metaDescription", product.metaDescription);
        formik.setFieldValue("sku", variant.sku.replace(variant.size, ""));
        formik.setFieldValue("actualPrice", variant.actualPrice);
        //formik.setFieldValue("discountedPrice", variant.discountedPrice);
        formik.setFieldValue("discountedPrice", product.discountedPrice);
        formik.setFieldValue("quantity", product.quantity);
        formik.setFieldValue("taxType", product.taxType);
        formik.setFieldValue("taxAmount", product.taxAmount);
        formik.setFieldValue("tags", product.tags);
        formik.setFieldValue("isDiscount", product.isDiscount);
        let temp = [];
        for (var item of product.variant) {
            temp.push({
                "name": item.size,
                "actualPrice": item.actualPrice,
                "discountedPrice": item.discountedPrice,
                "quantity": item.quantity
            })
        }
        setSizes(temp)




    }
    const handleColorNoSizeProductEdit = (product) => {
        setHasVariants(true);
        setHasColors(true);
        setHasSizes(false);

        let variant = product.variant[0]
        formik.setFieldValue("categoryId", product.category._id);
        formik.setFieldValue("subcategoryId", product.subcategory._id);
        formik.setFieldValue("name", product.name);
        formik.setFieldValue("title", product.title);
        formik.setFieldValue("description", product.description);
        formik.setFieldValue("longDescription", product.longDescription);
        formik.setFieldValue("vendor", product.vendor);
        formik.setFieldValue("metaDataString", product.metaData.split(','));
        formik.setFieldValue("metaDescription", product.metaDescription);
        formik.setFieldValue("sku", variant.sku);
        formik.setFieldValue("actualPrice", variant.actualPrice);
        //formik.setFieldValue("discountedPrice", variant.discountedPrice);
        formik.setFieldValue("discountedPrice", product.discountedPrice);
        formik.setFieldValue("quantity", product.quantity);
        formik.setFieldValue("taxType", product.taxType);
        formik.setFieldValue("taxAmount", product.taxAmount);
        formik.setFieldValue("tags", product.tags);
        formik.setFieldValue("isDiscount", product.isDiscount);
        let localVariants = [];
        for (var item of product.variant) {
            localVariants.push({
                colorName: item.colorName,
                colorHex: item.colorHex,
                sku: item.sku,
                actualPrice: item.actualPrice,
                discountedPrice: item.discountedPrice,
                quantity: item.quantity,
                size: item.size,
                image: item.image
            })
        }
        setVariants(localVariants);





    }
    const handleColorSizeProductEdit = (product) => {
        setHasVariants(true);
        setHasColors(true);
        setHasSizes(true);

        let variant = product.variant[0]
        formik.setFieldValue("categoryId", product.category._id);
        formik.setFieldValue("subcategoryId", product.subcategory._id);
        formik.setFieldValue("name", product.name);
        formik.setFieldValue("title", product.title);
        formik.setFieldValue("description", product.description);
        formik.setFieldValue("longDescription", product.longDescription);
        formik.setFieldValue("vendor", product.vendor);
        formik.setFieldValue("metaDataString", product.metaData.split(','));
        formik.setFieldValue("metaDescription", product.metaDescription);
        formik.setFieldValue("sku", variant.sku);
        formik.setFieldValue("actualPrice", variant.actualPrice);
        //formik.setFieldValue("discountedPrice", variant.discountedPrice);
        formik.setFieldValue("discountedPrice", product.discountedPrice);
        formik.setFieldValue("quantity", product.quantity);
        formik.setFieldValue("taxType", product.taxType);
        formik.setFieldValue("taxAmount", product.taxAmount);
        formik.setFieldValue("tags", product.tags);
        formik.setFieldValue("isDiscount", product.isDiscount);
        let localVariants = [];
        const grouped = product.variant.reduce((acc, item) => {
            const key = `${item.colorName}-${item.colorHex}`;
            if (!acc[key]) {
                acc[key] = {
                    items: []
                };
            }
            acc[key].items.push(item);
            return acc;
        }, {});

        let keys = Object.keys(grouped);
        for (var key of keys) {
            let colorName = key.split('-')[0];
            let colorHex = key.split('-')[1];

            localVariants.push({
                colorName: colorName,
                colorHex: colorHex,
                sku: grouped[key]['items'][0].sku.replace(grouped[key]['items'][0].size, ""),
                image: "",
                size: grouped[key]['items'].map((item) => {
                    return {
                        "name": item.size,
                        "actualPrice": item.actualPrice,
                        "discountedPrice": item.discountedPrice,
                        "quantity": item.quantity
                    }
                })




            })

        }




        setVariants(localVariants);


    }

    useEffect(() => {
        if (formik.values.discountedPrice !== "" && formik.values.actualPrice !== "" && formik.values.discountedPrice > formik.values.actualPrice) {
            toast.warn("Discounted Price can't be more than actual price")
            setDisable(true)
            return;
        }
        else {
            setDisable(false)
        }
    }, [formik.values.discountedPrice, formik.values.actualPrice]);


    const onRowExpand = (event) => {



    }


    useEffect(() => {
        if (addSize.discountedPrice !== "" && addSize.actualPrice !== "" && parseFloat(addSize.discountedPrice) > parseFloat(addSize.actualPrice)) {
            setDisable(true);
            toast.warn("Discounted Price can't be more than actual price");
        }
        else {
            setDisable(false);
        }
    }, [addSize.discountedPrice, addSize.actualPrice]);

    const allowExpansion = (rowData) => {

        return <>
            {rowData.length > 0};
        </>

    };
    const rowExpansionTemplate = (sizeData) => {


        return (
            <DataTable showGridlines={true} responsiveLayout="scroll" value={sizeData.size}>
                <Column field="name" header="Name" />
                <Column field="actualPrice" header="Actual Price" />
                <Column
                    //hidden={!formik.values.isDiscount}
                    field="discountedPrice" header="Dicounted Price" />
                <Column field="quantity" header="Quantity" />
                <Column header="Action" body={(data, props) => {
                    return (
                        <>
                            {<Button onClick={(e) => {
                                e.preventDefault();
                                setEditSize(data);
                                setEditSizeIndex(props.rowIndex)
                                setIsFromColumn(true);
                                setSizes(sizeData.size)
                                setVariantColorName(sizeData.colorName)
                                onClick('showEditSizeDialog')
                            }} icon="pi pi-pencil" className="p-button-rounded p-button-text" aria-label="Edit" />}

                            {!editable && <Button onClick={(e) => {
                                e.preventDefault();
                                setSizes((prev) => {
                                    prev = prev.splice(props.rowIndex, 1);
                                    return [...prev]
                                })
                            }} icon="pi pi-trash" className="p-button-rounded p-button-text" aria-label="Delete" />}

                        </>


                    )

                }} />


            </DataTable>
        );
    }

    const colorNoSizeComponent = () => {
        return <div>
            <div id="add-variant-form" >
                <div className="grid">
                    <div className="col-12 md:col-6 lg:col-6 xl:col-6">
                        <div className="flex flex-column">
                            <label className="mb-2">Color Name</label>
                            <InputText placeholder="Color name" value={addVariant.colorName} onChange={(e) => onAddVariantsFieldsChange('colorName', e.target.value)} className="w-full md:w-10 inputClass" />
                        </div>
                    </div>
                    <div className="col-12 md:col-6 lg:col-6 xl:col-6">
                        <div className="flex flex-column">
                            <label className="mb-2">Color Hex</label>
                            <InputText placeholder="Color Hex" value={addVariant.colorHex} onChange={(e) => onAddVariantsFieldsChange('colorHex', e.target.value)} className="w-full md:w-10 inputClass" />
                        </div>
                    </div>
                    <div className="col-12 md:col-6 lg:col-6 xl:col-6">
                        <div className="flex flex-column">
                            <label className="mb-2">Sku</label>
                            <InputText placeholder="Sku"
                                value={addVariant.sku}
                                //value={formik?.values?.sku?.replace(/\s\s+/g, " ")}
                                onChange={(e) => onAddVariantsFieldsChange('sku', e.target.value)} className="w-full md:w-10 inputClass" />
                        </div>
                    </div>
                    <div className="col-12 md:col-6 lg:col-6 xl:col-6">
                        <div className="flex flex-column">
                            <label className="mb-2">Actual Price</label>
                            <InputText placeholder="Actual price" type="number" min="1" value={addVariant.actualPrice} onChange={(e) => onAddVariantsFieldsChange('actualPrice', e.target.value)} className="w-full md:w-10 inputClass" />
                        </div>
                    </div>
                    {formik.values.isDiscount && <div className="col-12 md:col-6 lg:col-6 xl:col-6">
                        <div className="flex flex-column">
                            <label className="mb-2">Discounted Price</label>
                            <InputText placeholder="Discounted price" type='number' min="0" value={addVariant.discountedPrice} onChange={(e) => onAddVariantsFieldsChange('discountedPrice', e.target.value)} className="w-full md:w-10 inputClass" />
                        </div>
                    </div>}
                    <div className="col-12 md:col-6 lg:col-6 xl:col-6">
                        <div className="flex flex-column">
                            <label className="mb-2">Quantity</label>
                            <InputText placeholder="Quantity" type="number" min="0" value={addVariant.quantity} onChange={(e) => onAddVariantsFieldsChange('quantity', e.target.value)} className="w-full md:w-10 inputClass" />
                        </div>
                    </div>

                    <div className="text-right col-12">
                        <Button onClick={handleAddVariantSubmit} form="add-variant-form" disabled={loading} iconPos="right" label={"Add"} className="Savebtn p-mr-3" />

                    </div>


                </div>
            </div>

            <div className="col-12 md:col-12 lg:col-12 xl:col-12">
                <div className="innr-Body">
                    <DataTable responsiveLayout="scroll" value={variants}>
                        <Column field="colorName" header="Color name" body={(data, props) => customEditInput({
                            value: data.colorName, onChange: (e) => {
                                let value = e.target.value;
                                setVariants((prev) => {
                                    prev[props.rowIndex].colorName = value;
                                    return [...prev]
                                })
                            }
                        })} />
                        <Column field="colorHex" header="Color Hex" body={(data, props) => customEditInput({
                            value: data.colorHex, onChange: (e) => {
                                let value = e.target.value;
                                setVariants((prev) => {
                                    prev[props.rowIndex].colorHex = value;
                                    return [...prev]
                                })
                            }
                        })} />
                        <Column field="sku" header="SKU" />
                        <Column field="actualPrice" header="Actual Price" body={(data, props) => customEditInput({
                            value: data.actualPrice, onChange: (e) => {
                                let value = e.target.value;
                                setVariants((prev) => {
                                    prev[props.rowIndex].actualPrice = value;
                                    return [...prev]
                                })
                            }
                        })} />
                        <Column
                            //hidden={!formik.values.isDiscount}
                            field="discountedPrice" header="Discounted Price" body={(data, props) => customEditInput({
                                value: data.discountedPrice, onChange: (e) => {
                                    let value = e.target.value;
                                    setVariants((prev) => {
                                        prev[props.rowIndex].discountedPrice = value;
                                        return [...prev]
                                    })
                                }
                            })} />

                        <Column header="Action" body={(data, props) => {
                            return (
                                <Button onClick={(e) => {
                                    e.preventDefault();

                                    setVariants((prev) => {
                                        prev.splice(props.rowIndex, 1);
                                        return [...prev]
                                    })
                                }} icon="pi pi-trash" className="p-button-rounded p-button-text" aria-label="Delete" />

                            )

                        }} />

                    </DataTable>
                </div>
            </div>



        </div>;

    }
    const noColorSizeComponent = (showAddButton) => {

        return <div>
            <div id="add-variant-form" >
                <div className="grid">
                    <div className="col-12 md:col-6 lg:col-6 xl:col-6">
                        <div className="flex flex-column">
                            <label className="mb-2">Size</label>
                            <InputText placeholder="Enter Size" value={addSize.name} onChange={(e) => onSizeFieldsChange('name', e.target.value)} className="w-full md:w-10 inputClass" />
                        </div>
                    </div>
                    <div className="col-12 md:col-6 lg:col-6 xl:col-6">
                        <div className="flex flex-column">
                            <label className="mb-2">Actual Price</label>
                            <InputText placeholder="Actual Price" min="1" value={addSize.actualPrice} onChange={(e) => onSizeFieldsChange('actualPrice', e.target.value)} className="w-full md:w-10 inputClass" />
                        </div>
                    </div>
                    {formik.values.isDiscount && <div className="col-12 md:col-6 lg:col-6 xl:col-6">
                        <div className="flex flex-column">
                            <label className="mb-2">Discounted Price</label>
                            <InputText placeholder="Discounted Price" min='0' value={addSize.discountedPrice} onChange={(e) => onSizeFieldsChange('discountedPrice', e.target.value)} className="w-full md:w-10 inputClass" />
                        </div>
                    </div>}
                    <div className="col-12 md:col-6 lg:col-6 xl:col-6">
                        <div className="flex flex-column">
                            <label className="mb-2">Quantity</label>
                            <InputText placeholder="Quantity" min="0" value={addSize.quantity} onChange={(e) => onSizeFieldsChange('quantity', e.target.value)} className="w-full md:w-10 inputClass" />
                        </div>
                    </div>


                    <div className="col-12 text-right">
                        <Button onClick={handleAddSizeSubmit} iconPos="right" label={"Add Size"} className=" p-mr-3" />

                    </div>

                </div>
            </div>

            {sizes.length > 0 && <div className="col-12 md:col-12 lg:col-12 xl:col-12">
                <div className="innr-Body">
                    <DataTable responsiveLayout="scroll" value={sizes}>
                        {/* loading={loading}  */}

                        <Column field="name" header="Name" />
                        <Column field="actualPrice" header="Actual Price" />
                        <Column
                            //hidden={!formik.values.isDiscount}
                            field="discountedPrice" header="Dicounted Price" />

                        <Column field="quantity" header="Quantity" />
                        <Column header="Action" body={(data, props) => {
                            return (
                                <>

                                    {<Button onClick={(e) => {
                                        e.preventDefault();
                                        setEditSize(data);
                                        setEditSizeIndex(props.rowIndex)
                                        onClick('showEditSizeDialog')




                                    }} icon="pi pi-pencil" className="p-button-rounded p-button-text" aria-label="Edit" />}
                                    {!editable && <Button onClick={(e) => {
                                        e.preventDefault();
                                        setSizes((prev) => {

                                            prev = prev.splice(props.rowIndex, 1);

                                            return [...prev]
                                        })
                                    }} icon="pi pi-trash" className="p-button-rounded p-button-text" aria-label="Delete" />}

                                </>
                            )
                        }} />
                    </DataTable>
                </div>
            </div>}
        </div>;
    }

    //working
    const colorSizeComponent = () => {
        return <div>
            <div id="add-variant-form" >
                <div className="grid">
                    <div className="col-12 md:col-6 lg:col-6 xl:col-6">
                        <div className="flex flex-column">
                            <label className="mb-2">Color Name</label>
                            <InputText placeholder="Color name" value={addVariant.colorName} onChange={(e) => onAddVariantsFieldsChange('colorName', e.target.value)} className="w-full md:w-10 inputClass" />
                        </div>
                    </div>
                    <div className="col-12 md:col-6 lg:col-6 xl:col-6">
                        <div className="flex flex-column">
                            <label className="mb-2">Color Hex</label>
                            <InputText placeholder="Color hex" value={addVariant.colorHex} onChange={(e) => onAddVariantsFieldsChange('colorHex', e.target.value)} className="w-full md:w-10 inputClass" />
                        </div>
                    </div>
                    <div className="col-12 md:col-6 lg:col-6 xl:col-6">
                        <div className="flex flex-column">
                            <label className="mb-2">Sku</label>
                            <InputText placeholder="Sku" value={addVariant.sku} onChange={(e) => onAddVariantsFieldsChange('sku', e.target.value)} className="w-full md:w-10 inputClass" />
                        </div>
                    </div>

                    <div className="col-12">
                        <h3>Sizes</h3>
                    </div>
                    <div className="col-12">
                        {noColorSizeComponent(false)}
                    </div>



                    <div className="col-12 text-right">
                        <Button onClick={handleColorSizeSubmit} disabled={loading} iconPos="right" label={"Add Variant"} className="Savebtn p-mr-3" />

                    </div>

                </div>
            </div>



            <div className="col-12 md:col-12 lg:col-12 xl:col-12">
                <div className="innr-Body">
                    <DataTable onRowExpand={onRowExpand} expandedRows={expandedRows} onRowToggle={(e) => {

                        setExpandedRows(e.data);
                    }}

                        rowExpansionTemplate={rowExpansionTemplate}

                        responsiveLayout="scroll" value={variants}>
                        {/* loading={loading}  */}

                        <Column expander={allowExpansion} style={{ width: '3em' }} />

                        <Column field="colorName" header="Color name" body={(data, props) => customEditInput({
                            value: data.colorName, onChange: (e) => {
                                let value = e.target.value;
                                setVariants((prev) => {
                                    prev[props.rowIndex].colorName = value;
                                    return [...prev]
                                })
                            }
                        })} />
                        <Column field="colorHex" header="Color Hex"
                            body={(data, props) => customEditInput({
                                value: data.colorHex, onChange: (e) => {
                                    let value = e.target.value;
                                    setVariants((prev) => {
                                        prev[props.rowIndex].colorHex = value;
                                        return [...prev]
                                    })
                                }
                            })}
                        />
                        <Column field="sku"

                            header="SKU" />


                        <Column header="Action" body={(data, props) => {
                            return (
                                <Button onClick={(e) => {
                                    e.preventDefault();
                                    setVariants((prev) => {

                                        prev.splice(props.rowIndex, 1);

                                        return [...prev]
                                    })
                                }} icon="pi pi-trash" className="p-button-rounded p-button-text" aria-label="Delete" />

                            )

                        }} />




                    </DataTable>
                </div>
            </div>

        </div>;

    }

    const customEditInput = ({ value, onChange, type = 'text' }) => {
        return <input value={value} onChange={onChange} />

    }

    return (
        <>
            <Dialog header="Edit size" visible={showEditSizeDialog} style={{ width: '40vw' }} onHide={() => onHideInternal('showEditSizeDialog')}>
                <EditSizeDialog isFromColumn={isFromColumn} setVariants={setVariants} colorName={variantColorName} onHide={() => onHideInternal('showEditSizeDialog')} setSizes={setSizes} size={editSize} sizes={sizes} index={editSizeIndex} />
            </Dialog>
            {loading === true && editable === true ? <ProgressSpinner /> : (
                <form onSubmit={formik.handleSubmit}>
                    <div>
                        <div className="grid">
                            <div className="col-12 md:col-4">
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
                            <div className="col-12 md:col-4">
                                <div className="flex flex-column">
                                    <label className="mb-2">Sub-Category</label>
                                    <Dropdown
                                        id="subcategoryId"
                                        name="subcategoryId"
                                        placeholder="Select Sub-Category"
                                        className={classNames({ "p-invalid": isFormFieldValid("subcategoryId") }, "w-full md:w-10 inputClass")}
                                        value={formik.values.subcategoryId}
                                        options={subCategory?.filter((item) => item?.category?._id === formik.values.categoryId)}
                                        onChange={formik.handleChange}
                                        optionValue="_id"
                                        optionLabel="name"

                                    />
                                    {getFormErrorMessage("subcategoryId")}
                                </div>
                            </div>
                            <div className="col-12 md:col-4">
                                <div className="flex flex-column">
                                    <label className="mb-2">Product Name</label>
                                    <InputText maxLength={40} minLength={3} placeholder="Enter Product Name" id="name" name="name" value={formik?.values?.name?.replace(/\s\s+/g, " ")} onChange={formik.handleChange} className={classNames({ "p-invalid": isFormFieldValid("name") }, "w-full md:w-10 inputClass")} />
                                    {getFormErrorMessage("name")}
                                </div>
                            </div>


                            <div className="col-12 md:col-4">
                                <div className="flex flex-column">
                                    <label className="mb-2">Tax Type</label>
                                    <Dropdown
                                        id="taxType"
                                        name="taxType"
                                        placeholder="Select Tax Type"
                                        className={classNames({ "p-invalid": isFormFieldValid("taxType") }, "w-full md:w-10 inputClass")}
                                        value={formik.values.taxType}
                                        options={taxType}
                                        onChange={formik.handleChange}
                                        optionValue="_id"
                                        optionLabel="taxType"

                                    />
                                    {getFormErrorMessage("taxType")}
                                </div>
                            </div>
                            <div className="col-12 md:col-4">
                                <div className="flex flex-column">
                                    <label className="mb-2">Tax Amount</label>
                                    <InputText maxLength={6} keyfilter="int" placeholder="Enter Tax Amount" id="taxAmount" name="taxAmount" value={formik?.values?.taxAmount} onChange={formik.handleChange} className={classNames({ "p-invalid": isFormFieldValid("taxAmount") }, "w-full md:w-10 inputClass")} />
                                    {getFormErrorMessage("taxAmount")}
                                </div>
                            </div>

                            <div className="col-12 md:col-4">
                                <div className="flex flex-column">
                                    <label className="mb-2">Product Title</label>
                                    <InputText maxLength={70} placeholder="Enter Product Title" id="title" name="title" value={formik?.values?.title?.replace(/\s\s+/g, " ")} onChange={formik.handleChange} className={classNames({ "p-invalid": isFormFieldValid("title") }, "w-full md:w-10 inputClass")} />
                                    {getFormErrorMessage("title")}
                                </div>
                            </div>
                            <div className="col-12 md:col-4 flex">
                                <div className="flex flex-column">
                                    <label className="mb-2">is Active?</label>
                                    <Checkbox id="isActive" name="isActive" inputId="binary" checked={formik?.values?.isActive} onChange={formik.handleChange} />
                                    {/* {getFormErrorMessage("isActive")} */}
                                </div>
                                <div className="flex flex-column ml-3">
                                    <label className="mb-2">is Discount?</label>
                                    <Checkbox id="isDiscount" name="isDiscount" inputId="binary" checked={formik?.values?.isDiscount} onChange={formik.handleChange} />
                                    {/* {getFormErrorMessage("isActive")} */}
                                </div>
                            </div>



                            <div className="col-12 md:col-4">
                                <div className="flex flex-column">
                                    <label className="mb-2">Meta Data</label>
                                    <Chips id="metaDataString"
                                        name="metaDataString"
                                        value={formik?.values?.metaDataString}
                                        onChange={formik.handleChange}
                                        className={classNames({ "p-invalid": isFormFieldValid("metaDataString") }, "w-full md:w-10 inputClass")}
                                        separator="," />
                                    {getFormErrorMessage("metaDataString")}
                                </div>
                            </div>
                            <div className="col-12 md:col-4">
                                <div className="flex flex-column">
                                    <label className="mb-2">Tags</label>
                                    <InputText id="tags"
                                        name="tags"
                                        value={formik?.values?.tags}
                                        onChange={formik.handleChange}
                                        className={classNames({ "p-invalid": isFormFieldValid("tags") }, "w-full md:w-10 inputClass")}
                                    //separator=","
                                    />
                                    {getFormErrorMessage("tags")}
                                </div>
                            </div>
                            <div className="col-12 md:col-4">
                                <div className="flex flex-column">
                                    <label className="mb-2">Meta Description</label>
                                    <InputTextarea
                                        rows={5} cols={30}
                                        placeholder="Enter Meta Description"
                                        id="metaDescription"
                                        name="metaDescription"
                                        value={formik?.values?.metaDescription?.replace(/\s\s+/g, " ")}
                                        onChange={formik.handleChange}
                                        className={classNames({ "p-invalid": isFormFieldValid("metaDescription") }, "w-full md:w-10 inputClass")}
                                    />
                                    {getFormErrorMessage("metaDescription")}
                                </div>
                            </div>
                            <div className="col-12 md:col-4">
                                <div className="flex flex-column">
                                    <label className="mb-2">Description</label>
                                    <InputTextarea
                                        rows={5} cols={30}
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
                            <div className="col-12 md:col-6">
                                <div className="flex flex-column">
                                    <label className="mb-2">Long Description</label>
                                    <InputTextarea
                                        rows={5} cols={30}
                                        placeholder="Enter Long Description"
                                        id="longDescription"
                                        name="longDescription"
                                        value={formik?.values?.longDescription?.replace(/\s\s+/g, " ")}
                                        onChange={formik.handleChange}
                                        className={classNames({ "p-invalid": isFormFieldValid("longDescription") }, "w-full md:w-10 inputClass")}
                                    />
                                    {getFormErrorMessage("longDescription")}
                                </div>
                            </div>
                            <div className="col-12 md:col-4">
                                <div className="flex flex-column">
                                    <label className="mb-2">Vendor</label>
                                    <InputText placeholder="Enter Vendor" id="vendor" name="vendor" value={formik?.values?.vendor?.replace(/\s\s+/g, " ")} onChange={formik.handleChange} className={classNames({ "p-invalid": isFormFieldValid("vendor") }, "w-full md:w-10 inputClass")} />
                                    {getFormErrorMessage("vendor")}
                                </div>
                            </div>

                            <div className="col-12 md:col-12 lg:col-12 xl:col-12">
                                <div className="flex flex-column">
                                    <label className="mb-2">Images</label>
                                    <div className="flex flex-row">
                                    {console.log(oldImages, 'old imagesssssssssssssssssss')}
                                        {
                                            oldImages.map((item, index) => {
                                                return <div key={`${index} images`} className="relative">
                                                    <Image className="mx-2" height="80px" width="80px" preview src={`${baseURL}${item}`} />

                                                    <Button icon="pi pi-times" onClick={(e) => {
                                                        e.preventDefault();

                                                        setOldImages((prev) => {



                                                            return [...prev]
                                                        })

                                                    }} className="p-button-rounded p-button-danger p-button-text absolute right-0 top-0" aria-label="Cancel" />

                                                </div>
                                            })
                                        }
                                    </div>
                                    <MultiImage handleImages={handleImages} />
                                    {/* <ImageUpload handleImages={handleImages} className="w-full md:w-10 inputClass" /> */}
                                    {/* <InputText type="file" className="w-full md:w-10 inputClass" /> */}
                                </div>
                            </div>

                            {/* ========== */}

                            {(!hasVariants || (hasVariants && hasSizes && !hasColors)) && <div className="col-12 md:col-3">
                                <div className="flex flex-column">
                                    <label className="mb-2">Product SKU</label>
                                    <InputText disabled={editable} placeholder="SKU" id="sku" name="sku" value={formik?.values?.sku?.replace(/\s\s+/g, " ")} onChange={formik.handleChange} className={classNames({ "p-invalid": isFormFieldValid("sku") }, "w-full md:w-10 inputClass")} />
                                    {getFormErrorMessage("sku")}
                                </div>
                            </div>}
                            {!hasVariants && <div className="col-12 md:col-3">
                                <div className="flex flex-column">
                                    <label className="mb-2">Acutal Price</label>
                                    <InputText placeholder="Acutal Price" id="title" type='number' min="1" name="actualPrice" value={formik?.values?.actualPrice} onChange={formik.handleChange} className={classNames({ "p-invalid": isFormFieldValid("actualPrice") }, "w-full md:w-10 inputClass")} />
                                    {getFormErrorMessage("actualPrice")}
                                </div>
                            </div>}
                            {formik.values.isDiscount && !hasVariants && <div className="col-12 md:col-3">
                                <div className="flex flex-column">
                                    <label className="mb-2">Product Discounted Price</label>
                                    <InputText placeholder="Discounted Price" id="title" type='number' min="0" name="discountedPrice" value={formik?.values?.discountedPrice} onChange={formik.handleChange} className={classNames({ "p-invalid": isFormFieldValid("discountedPrice") }, "w-full md:w-10 inputClass")} />
                                    {getFormErrorMessage("discountedPrice")}
                                </div>
                            </div>}

                            {!hasVariants && <div className="col-12 md:col-3">
                                <div className="flex flex-column">
                                    <label className="mb-2">Quantity</label>
                                    <InputText placeholder="Quantity" type='number' min="0" id="title" name="quantity" value={formik?.values?.quantity} onChange={formik.handleChange} className={classNames({ "p-invalid": isFormFieldValid("quantity") }, "w-full md:w-10 inputClass")} />
                                    {getFormErrorMessage("quantity")}
                                </div>
                            </div>}





                        </div>

                        {productTypeComponent()}

                        {
                            hasVariants && hasColors && !hasSizes && colorNoSizeComponent()
                        }
                        {
                            hasVariants && hasSizes && !hasColors && noColorSizeComponent()
                        }

                        {hasVariants && hasSizes && hasColors && colorSizeComponent()}
                    </div>
                    <div className="col-12 md:col-12 xl:col-12 lg:col-12 text-center">
                        <Button
                            label="Cancel"
                            onClick={onHide}
                            type="button"
                            className="Cancelbtn p-mr-3"
                        />
                        <Button type="submit" disabled={disable} loading={loading} iconPos="right" label={editable ? "Update" : "Save"} autoFocus className="Savebtn p-mr-3" />
                    </div>
                </form>
            )}
        </>
    );
};

export default AddEditProduct;
