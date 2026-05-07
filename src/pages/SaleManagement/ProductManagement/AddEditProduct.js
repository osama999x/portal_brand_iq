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
        if (val === null || val === undefined) return true;
        if (Array.isArray(val)) return val.length === 0;
        return String(val).length === 0;
    }

    /* Normalise the `size` field from API — backend may return a plain string
       ("S"), an embedded object ({name, actualPrice, _id, …}), or an array.  */
    const getSizeName = (size) => {
        if (!size && size !== 0) return "";
        if (typeof size === "string") return size;
        if (Array.isArray(size)) return size[0]?.name ?? "";
        if (typeof size === "object") return size.name ?? "";
        return String(size);
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
            sizeGuide: "",
            sizeFit: "",
            deliveryReturns: "",
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
            "sizeGuide": data.sizeGuide,
            "sizeFit": data.sizeFit,
            "deliveryReturns": data.deliveryReturns,
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
        const TYPES = [
            { label: "Simple",         icon: "pi-box",       v: false, c: false, s: false },
            { label: "Colors Only",    icon: "pi-palette",   v: true,  c: true,  s: false },
            { label: "Sizes Only",     icon: "pi-th-large",  v: true,  c: false, s: true  },
            { label: "Colors + Sizes", icon: "pi-sliders-h", v: true,  c: true,  s: true  },
        ];
        return (
            <div className="product-type-selector">
                <span className="product-type-label">Product Type</span>
                <div className="product-type-pills">
                    {TYPES.map((type) => {
                        const isActive = type.v === hasVariants && type.c === hasColors && type.s === hasSizes;
                        return (
                            <button
                                key={type.label}
                                type="button"
                                disabled={editable}
                                className={`product-type-pill${isActive ? " active" : ""}`}
                                onClick={() => {
                                    setHasVariants(type.v);
                                    setHasColors(type.c);
                                    setHasSizes(type.s);
                                    setSizes([]);
                                    setVariants([]);
                                }}
                            >
                                <i className={`pi ${type.icon}`} />
                                {type.label}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
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
        formik.setFieldValue("sizeGuide", product.sizeGuide || "");
        formik.setFieldValue("sizeFit", product.sizeFit || "");
        formik.setFieldValue("deliveryReturns", product.deliveryReturns || "");
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
        formik.setFieldValue("sizeGuide", product.sizeGuide || "");
        formik.setFieldValue("sizeFit", product.sizeFit || "");
        formik.setFieldValue("deliveryReturns", product.deliveryReturns || "");
        formik.setFieldValue("vendor", product.vendor);
        formik.setFieldValue("metaDataString", product.metaData.split(','))
        formik.setFieldValue("metaDescription", product.metaDescription);
        formik.setFieldValue("sku", variant.sku.replace(getSizeName(variant.size), ""));
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
                "name": getSizeName(item.size),
                "actualPrice": item.actualPrice,
                "discountedPrice": item.discountedPrice,
                "quantity": item.quantity
            });
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
        formik.setFieldValue("sizeGuide", product.sizeGuide || "");
        formik.setFieldValue("sizeFit", product.sizeFit || "");
        formik.setFieldValue("deliveryReturns", product.deliveryReturns || "");
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
        formik.setFieldValue("sizeGuide", product.sizeGuide || "");
        formik.setFieldValue("sizeFit", product.sizeFit || "");
        formik.setFieldValue("deliveryReturns", product.deliveryReturns || "");
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
        const firstV = product.variant[0];
        /* Detect if the backend already returns one doc per colour with an
           embedded size array, e.g. size: [{name,actualPrice,_id,…}, …]      */
        const sizeIsEmbeddedArray =
            Array.isArray(firstV?.size) &&
            firstV.size.length > 0 &&
            typeof firstV.size[0] === "object";

        if (sizeIsEmbeddedArray) {
            /* New backend format — each variant doc already groups its sizes  */
            localVariants = product.variant.map((item) => ({
                colorName: item.colorName,
                colorHex : item.colorHex,
                sku      : item.sku,
                image    : item.image || "",
                size     : item.size.map((s) => ({
                    name           : s.name,
                    actualPrice    : s.actualPrice,
                    discountedPrice: s.discountedPrice ?? "",
                    quantity       : s.quantity,
                })),
            }));
        } else {
            /* Old flat format — one doc per size row, group by colour          */
            const grouped = product.variant.reduce((acc, item) => {
                const key = `${item.colorName}-${item.colorHex}`;
                if (!acc[key]) acc[key] = { items: [] };
                acc[key].items.push(item);
                return acc;
            }, {});

            for (var key of Object.keys(grouped)) {
                const first = grouped[key].items[0];
                localVariants.push({
                    colorName: first.colorName,
                    colorHex : first.colorHex,
                    sku      : first.sku.replace(getSizeName(first.size), ""),
                    image    : first.image || "",
                    size     : grouped[key].items.map((item) => ({
                        name           : getSizeName(item.size),
                        actualPrice    : item.actualPrice,
                        discountedPrice: item.discountedPrice ?? "",
                        quantity       : item.quantity,
                    })),
                });
            }
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
        return (
            <div className="variant-builder">
                <div className="variant-entry-card">
                    <div className="grid">
                        <div className="col-12 md:col-4">
                            <div className="flex flex-column">
                                <label className="mb-2">Color Name</label>
                                <InputText placeholder="e.g. Red" value={addVariant.colorName} onChange={(e) => onAddVariantsFieldsChange('colorName', e.target.value)} className="w-full inputClass" />
                            </div>
                        </div>
                        <div className="col-12 md:col-4">
                            <div className="flex flex-column">
                                <label className="mb-2">Color</label>
                                <div className="color-input-group">
                                    <input
                                        type="color"
                                        value={addVariant.colorHex || "#000000"}
                                        onChange={(e) => onAddVariantsFieldsChange('colorHex', e.target.value)}
                                        className="color-picker-native"
                                        title="Pick a color"
                                    />
                                    <InputText placeholder="#000000" value={addVariant.colorHex} onChange={(e) => onAddVariantsFieldsChange('colorHex', e.target.value)} className="color-hex-input inputClass" />
                                </div>
                            </div>
                        </div>
                        <div className="col-12 md:col-4">
                            <div className="flex flex-column">
                                <label className="mb-2">SKU</label>
                                <InputText placeholder="e.g. RED-001" value={addVariant.sku} onChange={(e) => onAddVariantsFieldsChange('sku', e.target.value)} className="w-full inputClass" />
                            </div>
                        </div>
                        <div className="col-12 md:col-4">
                            <div className="flex flex-column">
                                <label className="mb-2">Actual Price</label>
                                <InputText placeholder="Actual price" type="number" min="1" value={addVariant.actualPrice} onChange={(e) => onAddVariantsFieldsChange('actualPrice', e.target.value)} className="w-full inputClass" />
                            </div>
                        </div>
                        {formik.values.isDiscount && (
                            <div className="col-12 md:col-4">
                                <div className="flex flex-column">
                                    <label className="mb-2">Discounted Price</label>
                                    <InputText placeholder="Discounted price" type="number" min="0" value={addVariant.discountedPrice} onChange={(e) => onAddVariantsFieldsChange('discountedPrice', e.target.value)} className="w-full inputClass" />
                                </div>
                            </div>
                        )}
                        <div className="col-12 md:col-4">
                            <div className="flex flex-column">
                                <label className="mb-2">Quantity</label>
                                <InputText placeholder="Quantity" type="number" min="0" value={addVariant.quantity} onChange={(e) => onAddVariantsFieldsChange('quantity', e.target.value)} className="w-full inputClass" />
                            </div>
                        </div>
                        <div className="col-12 text-right">
                            <Button type="button" onClick={handleAddVariantSubmit} disabled={loading} label="Add This Color" icon="pi pi-plus" className="add-color-btn" />
                        </div>
                    </div>
                </div>

                {variants.length > 0 && (
                    <div className="variant-cards mt-3">
                        <span className="variant-cards-title">Added Colors ({variants.length})</span>
                        {variants.map((v, idx) => (
                            <div key={idx} className="variant-card" style={{ borderLeft: `4px solid ${v.colorHex || "#ccc"}` }}>
                                <div className="variant-card-header">
                                    <span className="color-dot" style={{ background: v.colorHex || "#ccc" }} />
                                    <strong className="variant-color-name">{v.colorName}</strong>
                                    <span className="variant-sku-badge">SKU: {v.sku}</span>
                                    <Button
                                        type="button"
                                        icon="pi pi-trash"
                                        className="p-button-text p-button-danger p-button-sm variant-remove-btn"
                                        onClick={() => setVariants((prev) => prev.filter((_, i) => i !== idx))}
                                        tooltip="Remove"
                                    />
                                </div>
                                <div className="variant-edit-row">
                                    <div className="size-edit-field">
                                        <span className="size-edit-label">Price (₹)</span>
                                        <input
                                            type="number"
                                            min="1"
                                            value={v.actualPrice}
                                            onChange={(e) => setVariants((prev) => prev.map((item, i) => i === idx ? { ...item, actualPrice: e.target.value } : item))}
                                            className="size-edit-input"
                                        />
                                    </div>
                                    {formik.values.isDiscount && (
                                        <div className="size-edit-field">
                                            <span className="size-edit-label">Disc. Price</span>
                                            <input
                                                type="number"
                                                min="0"
                                                value={v.discountedPrice || ""}
                                                onChange={(e) => setVariants((prev) => prev.map((item, i) => i === idx ? { ...item, discountedPrice: e.target.value } : item))}
                                                className="size-edit-input"
                                            />
                                        </div>
                                    )}
                                    <div className="size-edit-field">
                                        <span className="size-edit-label">Qty</span>
                                        <input
                                            type="number"
                                            min="0"
                                            value={v.quantity}
                                            onChange={(e) => setVariants((prev) => prev.map((item, i) => i === idx ? { ...item, quantity: e.target.value } : item))}
                                            className="size-edit-input size-edit-input--sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }
    const noColorSizeComponent = () => {
        return (
            <div className="variant-builder">
                <div className="variant-entry-card">
                    <h4 className="variant-entry-title">Size Variants</h4>

                    {sizes.length > 0 && (
                        <div className="size-edit-list mb-3">
                            <div className="size-edit-list-header">
                                <span>Size</span>
                                <span>Price (₹)</span>
                                {formik.values.isDiscount && <span>Disc. Price</span>}
                                <span>Qty</span>
                                <span></span>
                            </div>
                            {sizes.map((s, i) => (
                                <div key={i} className="size-edit-row">
                                    <span className="size-name-badge">{s.name}</span>
                                    <input
                                        type="number"
                                        min="1"
                                        value={s.actualPrice}
                                        onChange={(e) => setSizes((prev) => prev.map((item, idx) => idx === i ? { ...item, actualPrice: e.target.value } : item))}
                                        className="size-edit-input"
                                    />
                                    {formik.values.isDiscount && (
                                        <input
                                            type="number"
                                            min="0"
                                            value={s.discountedPrice || ""}
                                            onChange={(e) => setSizes((prev) => prev.map((item, idx) => idx === i ? { ...item, discountedPrice: e.target.value } : item))}
                                            className="size-edit-input"
                                        />
                                    )}
                                    <input
                                        type="number"
                                        min="0"
                                        value={s.quantity}
                                        onChange={(e) => setSizes((prev) => prev.map((item, idx) => idx === i ? { ...item, quantity: e.target.value } : item))}
                                        className="size-edit-input size-edit-input--sm"
                                    />
                                    <button
                                        type="button"
                                        className="size-edit-remove"
                                        onClick={() => setSizes((prev) => prev.filter((_, idx) => idx !== i))}
                                        title="Remove"
                                    >×</button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="size-inline-row">
                        <InputText
                            placeholder="Size (S / M / L)"
                            value={addSize.name}
                            onChange={(e) => onSizeFieldsChange('name', e.target.value)}
                            className="size-name-input inputClass"
                            onKeyDown={(e) => e.key === 'Enter' && handleAddSizeSubmit(e)}
                        />
                        <InputText
                            placeholder="Price"
                            type="number"
                            min="1"
                            value={addSize.actualPrice}
                            onChange={(e) => onSizeFieldsChange('actualPrice', e.target.value)}
                            className="size-price-input inputClass"
                            onKeyDown={(e) => e.key === 'Enter' && handleAddSizeSubmit(e)}
                        />
                        {formik.values.isDiscount && (
                            <InputText
                                placeholder="Disc. Price"
                                type="number"
                                min="0"
                                value={addSize.discountedPrice}
                                onChange={(e) => onSizeFieldsChange('discountedPrice', e.target.value)}
                                className="size-price-input inputClass"
                                onKeyDown={(e) => e.key === 'Enter' && handleAddSizeSubmit(e)}
                            />
                        )}
                        <InputText
                            placeholder="Qty"
                            type="number"
                            min="0"
                            value={addSize.quantity}
                            onChange={(e) => onSizeFieldsChange('quantity', e.target.value)}
                            className="size-qty-input inputClass"
                            onKeyDown={(e) => e.key === 'Enter' && handleAddSizeSubmit(e)}
                        />
                        <Button
                            type="button"
                            icon="pi pi-plus"
                            onClick={handleAddSizeSubmit}
                            className="p-button-rounded size-add-btn"
                            tooltip="Add size (or press Enter)"
                        />
                    </div>
                    <p className="size-inline-hint">
                        <i className="pi pi-info-circle mr-1" />
                        Press Enter or + to add. Click any price/qty above to edit directly.
                    </p>
                </div>
            </div>
        );
    }

    const colorSizeComponent = () => {
        const canCopySizes = variants.length > 0 && variants[variants.length - 1].size?.length > 0;

        return (
            <div className="variant-builder">
                {/* ── Entry form ── */}
                <div className="variant-entry-card">
                    <h4 className="variant-entry-title">Add Color Variant</h4>
                    <div className="grid">
                        <div className="col-12 md:col-4">
                            <div className="flex flex-column">
                                <label className="mb-2">Color Name</label>
                                <InputText
                                    placeholder="e.g. Red"
                                    value={addVariant.colorName}
                                    onChange={(e) => onAddVariantsFieldsChange('colorName', e.target.value)}
                                    className="w-full inputClass"
                                />
                            </div>
                        </div>
                        <div className="col-12 md:col-4">
                            <div className="flex flex-column">
                                <label className="mb-2">Color</label>
                                <div className="color-input-group">
                                    <input
                                        type="color"
                                        value={addVariant.colorHex || "#000000"}
                                        onChange={(e) => onAddVariantsFieldsChange('colorHex', e.target.value)}
                                        className="color-picker-native"
                                        title="Pick a color"
                                    />
                                    <InputText
                                        placeholder="#FF0000"
                                        value={addVariant.colorHex}
                                        onChange={(e) => onAddVariantsFieldsChange('colorHex', e.target.value)}
                                        className="color-hex-input inputClass"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-12 md:col-4">
                            <div className="flex flex-column">
                                <label className="mb-2">SKU</label>
                                <InputText
                                    placeholder="e.g. RED-001"
                                    value={addVariant.sku}
                                    onChange={(e) => onAddVariantsFieldsChange('sku', e.target.value)}
                                    className="w-full inputClass"
                                />
                            </div>
                        </div>
                    </div>

                    {/* ── Sizes for this color ── */}
                    <div className="sizes-section">
                        <div className="sizes-section-header">
                            <span className="sizes-section-title">
                                <i className="pi pi-th-large mr-2" />
                                Sizes for this color
                            </span>
                            {canCopySizes && (
                                <button
                                    type="button"
                                    className="copy-sizes-link"
                                    onClick={() => setSizes([...variants[variants.length - 1].size])}
                                >
                                    <i className="pi pi-copy mr-1" />
                                    Copy from {variants[variants.length - 1].colorName}
                                </button>
                            )}
                        </div>

                        {sizes.length > 0 && (
                            <div className="size-edit-list">
                                <div className="size-edit-list-header">
                                    <span>Size</span>
                                    <span>Price (₹)</span>
                                    {formik.values.isDiscount && <span>Disc.</span>}
                                    <span>Qty</span>
                                    <span></span>
                                </div>
                                {sizes.map((s, i) => (
                                    <div key={i} className="size-edit-row">
                                        <span className="size-name-badge">{s.name}</span>
                                        <input
                                            type="number"
                                            min="1"
                                            value={s.actualPrice}
                                            onChange={(e) => setSizes((prev) => prev.map((item, idx) => idx === i ? { ...item, actualPrice: e.target.value } : item))}
                                            className="size-edit-input"
                                        />
                                        {formik.values.isDiscount && (
                                            <input
                                                type="number"
                                                min="0"
                                                value={s.discountedPrice || ""}
                                                onChange={(e) => setSizes((prev) => prev.map((item, idx) => idx === i ? { ...item, discountedPrice: e.target.value } : item))}
                                                className="size-edit-input"
                                            />
                                        )}
                                        <input
                                            type="number"
                                            min="0"
                                            value={s.quantity}
                                            onChange={(e) => setSizes((prev) => prev.map((item, idx) => idx === i ? { ...item, quantity: e.target.value } : item))}
                                            className="size-edit-input size-edit-input--sm"
                                        />
                                        <button
                                            type="button"
                                            className="size-edit-remove"
                                            onClick={() => setSizes((prev) => prev.filter((_, idx) => idx !== i))}
                                            title="Remove"
                                        >×</button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="size-inline-row">
                            <InputText
                                placeholder="Size (S / M / L)"
                                value={addSize.name}
                                onChange={(e) => onSizeFieldsChange('name', e.target.value)}
                                className="size-name-input inputClass"
                                onKeyDown={(e) => e.key === 'Enter' && handleAddSizeSubmit(e)}
                            />
                            <InputText
                                placeholder="Price"
                                type="number"
                                min="1"
                                value={addSize.actualPrice}
                                onChange={(e) => onSizeFieldsChange('actualPrice', e.target.value)}
                                className="size-price-input inputClass"
                                onKeyDown={(e) => e.key === 'Enter' && handleAddSizeSubmit(e)}
                            />
                            {formik.values.isDiscount && (
                                <InputText
                                    placeholder="Disc. Price"
                                    type="number"
                                    min="0"
                                    value={addSize.discountedPrice}
                                    onChange={(e) => onSizeFieldsChange('discountedPrice', e.target.value)}
                                    className="size-price-input inputClass"
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddSizeSubmit(e)}
                                />
                            )}
                            <InputText
                                placeholder="Qty"
                                type="number"
                                min="0"
                                value={addSize.quantity}
                                onChange={(e) => onSizeFieldsChange('quantity', e.target.value)}
                                className="size-qty-input inputClass"
                                onKeyDown={(e) => e.key === 'Enter' && handleAddSizeSubmit(e)}
                            />
                            <Button
                                type="button"
                                icon="pi pi-plus"
                                onClick={handleAddSizeSubmit}
                                className="p-button-rounded size-add-btn"
                                tooltip="Add size (or press Enter)"
                            />
                        </div>
                        <p className="size-inline-hint">
                            <i className="pi pi-info-circle mr-1" />
                            Press Enter or click + to add each size, then click "Add This Color" when done.
                        </p>
                    </div>

                    <div className="variant-entry-footer">
                        <Button
                            type="button"
                            onClick={handleColorSizeSubmit}
                            label="Add This Color"
                            icon="pi pi-check"
                            className="add-color-btn"
                            disabled={loading || sizes.length === 0}
                        />
                    </div>
                </div>

                {/* ── Added variant cards ── */}
                {variants.length > 0 && (
                    <div className="variant-cards mt-3">
                        <span className="variant-cards-title">Added Color Variants ({variants.length})</span>
                        {variants.map((v, idx) => (
                            <div
                                key={idx}
                                className="variant-card"
                                style={{ borderLeft: `4px solid ${v.colorHex || "#ccc"}` }}
                            >
                                <div className="variant-card-header">
                                    <span className="color-dot" style={{ background: v.colorHex || "#ccc" }} />
                                    <strong className="variant-color-name">{v.colorName}</strong>
                                    <span className="variant-sku-badge">SKU: {v.sku}</span>
                                    <Button
                                        type="button"
                                        icon="pi pi-trash"
                                        className="p-button-text p-button-danger p-button-sm variant-remove-btn"
                                        onClick={() => setVariants((prev) => prev.filter((_, i) => i !== idx))}
                                        tooltip="Remove variant"
                                    />
                                </div>
                                {v.size?.length > 0 && (
                                    <div className="variant-size-list">
                                        <div className="size-edit-list-header size-edit-list-header--compact">
                                            <span>Size</span>
                                            <span>Price (₹)</span>
                                            {formik.values.isDiscount && <span>Disc.</span>}
                                            <span>Qty</span>
                                        </div>
                                        {v.size.map((s, si) => (
                                            <div key={si} className="size-edit-row size-edit-row--compact">
                                                <span className="size-name-badge">{s.name}</span>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={s.actualPrice}
                                                    onChange={(e) => setVariants((prev) => prev.map((vv, vi) => vi === idx ? {
                                                        ...vv,
                                                        size: vv.size.map((ss, ssi) => ssi === si ? { ...ss, actualPrice: e.target.value } : ss)
                                                    } : vv))}
                                                    className="size-edit-input"
                                                />
                                                {formik.values.isDiscount && (
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={s.discountedPrice || ""}
                                                        onChange={(e) => setVariants((prev) => prev.map((vv, vi) => vi === idx ? {
                                                            ...vv,
                                                            size: vv.size.map((ss, ssi) => ssi === si ? { ...ss, discountedPrice: e.target.value } : ss)
                                                        } : vv))}
                                                        className="size-edit-input"
                                                    />
                                                )}
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={s.quantity}
                                                    onChange={(e) => setVariants((prev) => prev.map((vv, vi) => vi === idx ? {
                                                        ...vv,
                                                        size: vv.size.map((ss, ssi) => ssi === si ? { ...ss, quantity: e.target.value } : ss)
                                                    } : vv))}
                                                    className="size-edit-input size-edit-input--sm"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
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
                <form onSubmit={formik.handleSubmit} className="aep__form">
                    <div className="add-edit-product">
                        <div className="grid aep__grid">
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
                            <div className="col-12 md:col-6">
                                <div className="flex flex-column">
                                    <label className="mb-2">Size Guide</label>
                                    <InputTextarea
                                        rows={5}
                                        cols={30}
                                        placeholder="Enter Size Guide"
                                        id="sizeGuide"
                                        name="sizeGuide"
                                        value={formik?.values?.sizeGuide?.replace(/\s\s+/g, " ")}
                                        onChange={formik.handleChange}
                                        className={classNames({ "p-invalid": isFormFieldValid("sizeGuide") }, "w-full md:w-10 inputClass")}
                                    />
                                    {getFormErrorMessage("sizeGuide")}
                                </div>
                            </div>
                            <div className="col-12 md:col-6">
                                <div className="flex flex-column">
                                    <label className="mb-2">Size & Fit</label>
                                    <InputTextarea
                                        rows={5}
                                        cols={30}
                                        placeholder="Enter Size & Fit"
                                        id="sizeFit"
                                        name="sizeFit"
                                        value={formik?.values?.sizeFit?.replace(/\s\s+/g, " ")}
                                        onChange={formik.handleChange}
                                        className={classNames({ "p-invalid": isFormFieldValid("sizeFit") }, "w-full md:w-10 inputClass")}
                                    />
                                    {getFormErrorMessage("sizeFit")}
                                </div>
                            </div>
                            <div className="col-12 md:col-6">
                                <div className="flex flex-column">
                                    <label className="mb-2">Delivery & Returns</label>
                                    <InputTextarea
                                        rows={5}
                                        cols={30}
                                        placeholder="Enter Delivery & Returns"
                                        id="deliveryReturns"
                                        name="deliveryReturns"
                                        value={formik?.values?.deliveryReturns?.replace(/\s\s+/g, " ")}
                                        onChange={formik.handleChange}
                                        className={classNames({ "p-invalid": isFormFieldValid("deliveryReturns") }, "w-full md:w-10 inputClass")}
                                    />
                                    {getFormErrorMessage("deliveryReturns")}
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
                    <div className="aep__footer">
                        <div className="aep__footerInner">
                            <Button
                                label="Cancel"
                                onClick={onHide}
                                type="button"
                                className="Cancelbtn"
                            />
                            <Button
                                type="submit"
                                disabled={disable}
                                loading={loading}
                                iconPos="right"
                                label={editable ? "Update" : "Save"}
                                autoFocus
                                className="Savebtn"
                            />
                        </div>
                    </div>
                </form>
            )}
        </>
    );
};

export default AddEditProduct;
