import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import * as Yup from "yup";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { handleGetRequest } from "../../../service/GetTemplate";
import { handlePostRequest } from "../../../service/PostTemplate";
import { handlePatchRequest } from "../../../service/PatchTemplete";
import { classNames } from 'primereact/utils';
import { Button } from 'primereact/button';
import AddEditImage from "../../../components/AddEditImage";
import { Checkbox } from "primereact/checkbox";
import moment from 'moment';

const Addedit = ({ onHide, getCoupandata, addEditCoupan, coupanRowData }) => {

    const [loading, setloading] = useState(false);

    const [fileUploadData, setfileUploadData] = useState("");
    const dispatch = useDispatch();
    const getMembersByID = async () => {
        const res = await handleGetRequest(`api/v1/coupon/getOne?couponId=${coupanRowData}`, true);
        setloading(false);
        if (res) {
            const keyData = res;
            Object.keys(keyData).forEach((key) => {
                if (formik.initialValues.hasOwnProperty(key)) {
                    formik.setFieldValue(key, keyData[key]);
                }
            });
        }
    }

    const validationSchema = Yup.object().shape({
        couponCode:Yup.string().required("This field is required"),
        image: Yup.mixed().optional("This field is Optional."),
        expireDate: Yup.string().required("This field is required"),
        orderPriceLimit: Yup.mixed().required("This field is required."),
        couponValue: Yup.mixed().required("This field is required."),
        // activeFrom: Yup.mixed().required("This field is required."),
        // activeTo: Yup.mixed().required("This field is required."),
        // isActive: Yup.mixed().required("This field is required."),
    });
    const formik = useFormik({
        validationSchema: validationSchema,
        initialValues: {
            couponCode: "",
            image: "",
            expireDate: "",
            orderPriceLimit: "",
            couponValue: "",
            // activeFrom: "",
            // activeTo: "",
            isActive: Yup.boolean,
            isPercentage: Yup.boolean,

        },
        onSubmit: async (data) => {
            if (addEditCoupan === true) {
                data["image"] = fileUploadData[0];
                data["couponId"] = coupanRowData;
                const res = await dispatch(handlePatchRequest(data, "api/v1/coupon", true, true));
                if (res.status === 200) {
                    await getCoupandata();
                    formik.resetForm();
                    onHide();
                }

            } else {
                data["image"] = fileUploadData;
                data["expireDate"] = moment().format("MM/DD/YYYY")
                const res = await dispatch(handlePostRequest(data, "api/v1/coupon", true, true));
                if (res?.status === 200 || res?.status === 201) {
                    await getCoupandata();
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
    useEffect(() => {
        if (coupanRowData !== undefined && coupanRowData !== null && addEditCoupan === true) {
            getMembersByID();
        };

    }, []);

    const handleImages = (images) => {
        setfileUploadData(images);
    };
    // const statusOption = [
    //     { name: 'Active', status: true },
    //     { name: 'InActive', status: false },
    // ];
    // const percentageOption = [
    //     { name: 'Active', status: true },
    //     { name: 'InActive', status: false },
    // ];
    // const couponOption = [
    //     { name: 'Flate', cpn: 'flate' },
    //     { name: 'Product', cpn: 'product' },
    // ];

    return (
        <div>
            <form onSubmit={formik.handleSubmit}>
                <div className="grid">
                    <div className="col-12 md:col-12 lg:col-12 xs:col-12">
                        <div className="flex flex-column">
                            <label className="mb-2">Coupon Code</label>
                            <InputText
                                maxLength={25}
                                name='couponCode'
                                id='couponCode'
                                keyfilter="alphanum-"

                                className={classNames({ "p-invalid": isFormFieldValid("couponCode") }, "w-full md:w-10 inputClass")}
                                value={formik.values.couponCode}
                                onChange={formik.handleChange}
                                placeholder=""
                            />
                        </div>
                        {getFormErrorMessage("couponCode")}
                    </div>
                    <div className="col-12 md:col-12 lg:col-12 xl:col-12">
                        <div className="flex flex-column">
                            <label className="mb-2">Upload Voucher</label>
                            <AddEditImage handleImages={handleImages} editable={addEditCoupan} EditIconImage={formik?.values?.image} />
                        </div>
                    </div>

                    <div className="col-12 md:col-12 lg:col-12 xs:col-12">
                        <div className="flex flex-column">
                            <label htmlFor="fromDate">Expire Date</label>
                            <InputText
                                id="expireDate"
                                name="expireDate"
                                value={moment(formik.values.expireDate).format("YYYY-MM-DD")}
                                onChange={formik.handleChange}
                                className={classNames({ "p-invalid": isFormFieldValid("expireDate") }, "w-full md:w-10 inputClass")}
                                optionlabel="name"
                                type="date"
                                min={moment().format("YYYY-MM-DD")}
                            />
                        </div>
                        {getFormErrorMessage("expireDate")}
                    </div>
                    <div className="col-12 md:col-12 lg:col-12 xs:col-12">
                        <div className="flex flex-column">
                            <label className="mb-2">Order Price Limit</label>
                            <InputText
                                name='orderPriceLimit'
                                id='orderPriceLimit'
                                className={classNames({ "p-invalid": isFormFieldValid("orderPriceLimit") }, "w-full md:w-10 inputClass")}
                                value={formik.values.orderPriceLimit}
                                onChange={formik.handleChange}
                                placeholder=""
                            />
                        </div>
                        {getFormErrorMessage("orderPriceLimit")}
                    </div>

                    <div className="col-12 md:col-6 lg:col-6 xl:col-6">
                        <div className="flex flex-column">
                            <label className="mb-2">Is Active</label>
                            <Checkbox id="isActive" name="isActive" inputId="binary" checked={formik?.values?.isActive} onChange={formik.handleChange} />
                            {getFormErrorMessage("isActive")}
                        </div>
                    </div>
                    {/* <div className="col-12 md:col-6 lg:col-6 xl:col-6">
                        <div className="flex flex-column">
                            <label className="mb-2">Is Percentage</label>
                            <Checkbox id="isPercentage" name="isPercentage" inputId="binary" checked={formik?.values?.isPercentage} onChange={formik.handleChange} />
                            {getFormErrorMessage("isPercentage")}
                        </div>
                    </div> */}
                    <div className="col-12 flex innr_padding">
                        <div className="col-12 md:col-12 lg:col-12 xs:col-12">
                            <div className="flex flex-column">
                                <label className="mb-2">Coupon Value </label>
                                <InputText
                                    maxLength={2}
                                    name='couponValue'
                                    id='couponValue'
                                    //type="number"
                                    keyfilter="int"
                                    className={classNames({ "p-invalid": isFormFieldValid("couponValue") }, "w-full md:w-10 inputClass")}
                                    value={formik.values.couponValue}
                                    onChange={formik.handleChange}
                                />
                            </div>
                            {getFormErrorMessage("couponValue")}
                        </div>
                    </div>
                    {/* <div className="col-12 md:col-12 lg:col-12 xs:col-12">
                        <div className="flex flex-column">
                            <label className="mb-2">Coupan Type</label>
                            <Dropdown
                                id="couponType"
                                name="couponType"
                                value={formik.values.couponType}
                                onChange={formik.handleChange}
                                className={classNames({ "p-invalid": isFormFieldValid("couponType") }, "w-full md:w-10 inputClass")}
                                options={couponOption}
                                optionLabel="name"
                                optionValue="cpn"
                            />
                        </div>
                     {getFormErrorMessage("couponType")}
                    </div>  */}
                    {/* <div className="col-12 md:col-12 lg:col-12 xs:col-12">
                        <div className="flex flex-column">
                            <label htmlFor="fromDate"> To Date</label>
                            <InputText
                                id="activeTo"
                                name="activeTo"
                                value={formik.values.activeTo.split('T')[0]}
                                onChange={formik.handleChange}
                                className={classNames({ "p-invalid": isFormFieldValid("activeTo") }, "w-full md:w-10 inputClass")}
                                optionlabel="name"
                                type="date"
                            />

                        </div>
                        {getFormErrorMessage("activeTo")}
                    </div> */}
                    {/* <div className="col-12 md:col-12 lg:col-12 xs:col-12">
                        <div className="flex flex-column">
                            <label className="mb-2">Status</label>
                            <Dropdown
                                id="isActive"
                                name="isActive"
                                value={formik.values.isActive}
                                onChange={formik.handleChange}
                                className={classNames({ "p-invalid": isFormFieldValid("isActive") }, "w-full md:w-10 inputClass")}
                                options={statusOption}
                                optionLabel="name"
                                optionValue="status"
                            />
                        </div>
                        {getFormErrorMessage("isActive")}
                    </div> */}

                    <div className="col-12 md:col-12 xl:col-12 lg:col-12 text-center">
                        <Button
                            label="Cancel"
                            onClick={onHide}
                            type="button"
                            className="Cancelbtn p-mr-3"
                        />
                        <Button
                            // autoFocus
                            className="Savebtn"
                            label={addEditCoupan ? "Update" : "Save"}
                            disabled={loading}
                            type="submit"
                        />
                    </div>
                </div>

            </form>


        </div>
    );
}

export default Addedit;
