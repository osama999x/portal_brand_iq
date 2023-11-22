import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import * as Yup from "yup";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { handleGetRequest } from "../../service/GetTemplate";
import { handlePatchRequest } from "../../service/PatchTemplete";
import { classNames } from 'primereact/utils';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { toast } from 'react-toastify';

const AddEditInventory = ({ productRowData, reviewsRowData, apprejdata, getReviewsData, onHide }) => {
    const [loading, setLoading] = useState('');
    const dispatch = useDispatch();
    const [sku, setSku] = useState([]);
    const [selectedSkuQuantity, setSelectedSkuQuantity] = useState("");
    const [selectedSku, setSelectedSku] = useState(null);
    const [disable, setDisable] = useState(false);
    const getMembersByID = async () => {
        const res = await handleGetRequest(`api/v1/products/details?productId=${reviewsRowData}`, false);

        if (res) {
            setSku(res.variant)
            const keyData = res?.variant[0];

            Object.keys(keyData).forEach((key) => {

                if (formik.initialValues.hasOwnProperty(key)) {
                    formik.setFieldValue(key, keyData[key]);
                }
            });
            setSelectedSkuQuantity(keyData.quantity);
        }
    }

    useEffect(() => {
        if (reviewsRowData !== undefined && reviewsRowData !== null && apprejdata === true) {
            getMembersByID();
        };

    }, []);

    const validationSchema = Yup.object().shape({
        // sku: Yup.mixed().required("This field is required."),
        // actualPrice: Yup.mixed().required("This field is required."),
        // discountedPrice: Yup.mixed().required("This field is required."),
        quantity: Yup.mixed().required("This field is required."),

    });
    const formik = useFormik({
        validationSchema: validationSchema,
        initialValues: {
            sku: "",
            // actualPrice: "",
            // discountedPrice: "",
            quantity: ""
        },
        onSubmit: async (data) => {
            try {
                if (apprejdata === true) {

                    data["productId"] = reviewsRowData;

                    setLoading(true);
                    const res = await dispatch(handlePatchRequest(data, "api/v1/products/quantityUpdate", true, true));
                    if (res?.status === 200) {
                        await getReviewsData();
                    }
                    // onHide();

                    setLoading(false);
                }
            }
            catch (error) {

            }
            finally {
                onHide();

            }

        },
    });

    const getAndOnHide = () => {
        getReviewsData();

        onHide();
    }

    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };
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
    useEffect(() => {
        if (selectedSku && formik.values.quantity !== selectedSku.quantity) {
            formik.setFieldValue("quantity", selectedSku.quantity);
        }
    }, [selectedSku, formik.values.quantity]);

    return (
        <form onSubmit={formik.handleSubmit}>
            <div className="grid p-p-3">

                <div className="col-12 md:col-12 lg:col-12 xl:col-12">
                    <div className="flex flex-column">
                        <label className="mb-2">Product SKU</label>
                        <Dropdown
                            //disabled={apprejdata}
                            placeholder="SKU"
                            id="sku"
                            name="sku"
                            value={formik.values.sku}
                            options={sku}
                            optionLabel='sku'
                            optionValue='_id'
                            //onChange={formik.handleChange}
                            onChange={(e) => {
                                formik.handleChange(e);
                                const selectedSku = sku.find((item) => item._id === e.target.value);
                                setSelectedSku(selectedSku);
                            }}
                            className={classNames({ "p-invalid": isFormFieldValid("sku") }, "w-full md:w-10 inputClass")}
                        />
                        {getFormErrorMessage("sku")}
                    </div>
                </div>
                {/* <div className="col-12 md:col-6">
                    <div className="flex flex-column">
                        <label className="mb-2">Acutal Price</label>
                        <InputText placeholder="Acutal Price" id="actualPrice" type='number' min="1" name="actualPrice" value={formik?.values?.actualPrice} onChange={formik.handleChange} className={classNames({ "p-invalid": isFormFieldValid("actualPrice") }, "w-full md:w-10 inputClass")} />
                        {getFormErrorMessage("actualPrice")}
                    </div>
                </div>
                <div className="col-12 md:col-6">
                    <div className="flex flex-column">
                        <label className="mb-2">Product Discounted Price</label>
                        <InputText placeholder="Discounted Price" id="discountedPrice" type='number' min="0" name="discountedPrice" value={formik?.values?.discountedPrice} onChange={formik.handleChange} className={classNames({ "p-invalid": isFormFieldValid("discountedPrice") }, "w-full md:w-10 inputClass")} />
                        {getFormErrorMessage("discountedPrice")}
                    </div>
                </div> */}
                <div className="col-12 md:col-12 lg:col-12 xl:col-12">
                    <div className="flex flex-column">
                        <label className="mb-2">Quantity</label>
                        <InputText
                            placeholder="Quantity"
                            type='number'
                            min="0"
                            id="quantity"
                            name="quantity"
                            //value={formik?.values?.quantity}
                            value={formik.values.quantity}
                            onChange={formik.handleChange}
                            className={classNames({ "p-invalid": isFormFieldValid("quantity") }, "w-full md:w-10 inputClass")} />
                        {getFormErrorMessage("quantity")}
                    </div>
                </div>

                <div className="col-12 md:col-12 xl:col-12 lg:col-12 text-center">
                    <Button
                        label="Submit"
                        onClick={onHide}
                        type="button"
                        className="Cancelbtn p-mr-3"
                    />
                    {/* <Button
                        // autoFocus
                        className="Savebtn"
                        label="Update"
                        disabled={disable}
                        //disabled={loading}
                        type="submit"
                        onHide={onHide}
                    /> */}

                </div>
            </div>
        </form>
    );
}

export default AddEditInventory;
