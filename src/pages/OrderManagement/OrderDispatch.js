import React, { useState, useEffect } from "react";
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { handleGetRequest } from "../../service/GetTemplate";
// import { useLocation } from "react-router-dom";
import { Button } from "primereact/button";
import { handlePostRequest } from "../../service/PostTemplate";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import { classNames } from 'primereact/utils';
import { useFormik, validateYupSchema } from "formik";
const OrderDispatch = ({ status, trackingId, id }) => {

    // const location = useLocation();

    const [selectedCateg, setSelectedCateg] = useState();
    const [selectedStatus, setSelectedStatus] = useState();
    const [selectedCities1, setSelectedCities1] = useState(null);
    const [selectedValue, setSelectedValue] = useState('');
    const [warehouseData, setWarehouseData] = useState([]);
    const [postExData, setPostExData] = useState([]);


    // useEffect(() => {
    //     if(selectedStatus === "") {
    //         setSelectedStatus(location?.state?.data?.status)
    //     }
    // }, [selectedStatus]);

    // const [orderId, setOrderId] = useState(props?.id ? props?.id:null);

    const [loading, setloading] = useState(false);
    // const [updatestatus, setUpdateStatus] = useState();
    const [deliveryPartner, setDeliveryPaetner] = useState();



    const dispatch = useDispatch();
    const history = useHistory();


    const validationSchema = Yup.object().shape({
        courierType: Yup.string().required("This field is required."),
        originCityCode: Yup.string().required("This field is required."),
        orderType: Yup.string().required("This field is required."),
        description: Yup.string().required("This field is required."),
        packing: Yup.string().required("This field is required."),
        weight: Yup.string().required("This field is required."),


    });

    const formik = useFormik({
        validationSchema: validationSchema,
        initialValues: {
            courierType: "",
            // orderStatusType: "",
            originCityCode: "",
            orderType: "",
            description: "",
            packing: "",
            weight: "",

        },


        onSubmit: async (data) => {

            // data["parcelId"] = selectedValue;
            data["courierType"] = formik?.values?.courierType.toUpperCase()
            data["orderStatus"] = selectedStatus;
            data["orderId"] = id;


            delete data["undefined"]

            if (formik.values.orderStatusType === "Canceled") {
                data["parcelId"] = trackingId;
            }

            const res = await dispatch(handlePostRequest(data, "api/v1/order/orderDispatch", false));

            if (res?.status === 200) {
                // setOrderId(res);
            }

            setloading(false);
            history.push("./ordermanagement")
        }
    })
    // const getdeliverypartner = async () => {
    //     setloading(true);

    //     const res = await handleGetRequest("api/v1/deliverypartner/deliverPartnerList", false);

    //     if (res) {
    //         setDeliveryPaetner(res);
    //     }
    //     setloading(false);
    // }
    // useEffect(() => {
    //     getdeliverypartner();

    // },
    //     []);



    // const getAllStatus = async () => {
    //     setloading(true);
    //     const res = await handleGetRequest("api/v1/orderStatus/all", false);

    //     if (res) {
    //         let selectedId = res.find((item) => item.orderStatusName === status)?._id;
    //         setSelectedStatus(selectedId);
    //         setSelectedCities1(res);

    //     }
    //     setloading(false);
    // };
    // useEffect(() => {
    //     getAllStatus();
    //     // getOrderId();
    // }, []);


    // const handlePostEX = async () => {

    //     const res = await handleGetRequest("api/v1/courier/postEx/warehouse", false);

    //     if (res) {

    //         setWarehouseData(res)
    //     }

    // }

    async function handlePostEX() {
        try {
            const response = await fetch('http://20.212.227.60:3007/api/v1/courier/postEx/warehouse');
            const data = await response.json();

            setPostExData(data?.dist)

            return data;
        } catch (error) {

        }
    }

    const handleSWFTY = async () => {
        const res = await handleGetRequest("api/v1/courier/swyft/operationalCities", false);
        if (res) {

            setWarehouseData(res)
        }

    }

    useEffect(() => {
        if (formik.values.courierType === "PostEx") {
            handlePostEX()
        }

        else if (formik.values.courierType === "Swfyt") {
            handleSWFTY()
        }
        else {
            formik.setFieldValue(formik.values.courierType, "")
        }
    }, [formik.values.courierType])

    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };


    const DilveryOption = [
        { name: 'PostEx', id: 0 },
        { name: 'Swfyt', id: 1 },
    ];
    const OrderOption = [
        { name: 'Delivered', orderStatusType: "Delivered" },
        { name: 'Canceled', orderStatusType: "Canceled" },
    ];
    const OrdertypeOption = [
        { name: 'Normal', orderType: "Normal" },
        { name: 'Reverse', orderType: "Reverse" },
        { name: 'Replacement', orderType: "Replacement" },
    ];
    const PackingtypeOption = [
        { name: 'Flyer', packing: "Flyer" },
    ];



    return (
        <div>
            <form onSubmit={formik.handleSubmit}>
                <div className="grid p-p-3">
                    <div className="col-12 md:col-12 lg:col-12 xl:col-12">
                        <div className="flex flex-column">
                            <label className="mb-2">Delivery Partner</label>
                            <Dropdown

                                id="courierType"
                                name="courierType"
                                value={formik.values.courierType}
                                onChange={formik.handleChange}
                                className="w-full md:w-10 inputClass"
                                options={DilveryOption}
                                optionLabel="name"
                                optionValue="name"

                            />
                            {getFormErrorMessage("courierType")}
                        </div>
                    </div>



                    {/* <div className="col-12 md:col-12 lg:col-12 xl:col-12">
                        <div className="flex flex-column">
                            <label className="mb-2">Order Status</label>

                            <Dropdown

                                id="orderStatusType"
                                name="orderStatusType"
                                value={formik.values.orderStatusType}
                                onChange={formik.handleChange}
                                className="w-full md:w-10 inputClass"
                                options={OrderOption}
                                optionLabel="name"
                                optionValue="orderStatusType"

                            />

                        </div>
                    </div> */}

                    <div className="col-12 md:col-12 lg:col-12 xl:col-12">
                        <div className="flex flex-column">
                            <label className="mb-2">Ware House</label>

                            <Dropdown
                                id="originCityCode"
                                name="originCityCode"
                                value={formik?.values?.originCityCode}
                                onChange={formik.handleChange}
                                className="w-full md:w-10 inputClass"
                                options={formik.values.courierType.includes("PostEx") ? postExData : warehouseData}
                                optionLabel={formik.values.courierType === "PostEx" ? "address" : "name"}
                                optionValue={formik.values.courierType === "PostEx" ? "addressCode" : "code"}

                            />
                            {getFormErrorMessage("courierType")}
                        </div>
                    </div>
                    <div className="col-12 md:col-12 lg:col-12 xl:col-12">
                        <div className="flex flex-column">
                            <label className="mb-2">Order Type</label>

                            <Dropdown
                                id="ordercourierTypeType"
                                name="orderType"
                                value={formik?.values?.orderType}
                                onChange={formik.handleChange}
                                className="w-full md:w-10 inputClass"
                                options={OrdertypeOption}
                                optionLabel="name"
                                optionValue="orderType"

                            />
                            {getFormErrorMessage("courierType")}
                        </div>
                    </div>

                    <div className="col-12 md:col-12 lg:col-12 xl:col-12">
                        <div className="flex flex-column">
                            <label className="mb-2">Packing</label>

                            <Dropdown
                                id="packing"
                                name="packing"
                                value={formik?.values?.packing}
                                onChange={formik.handleChange}
                                className="w-full md:w-10 inputClass"
                                options={PackingtypeOption}
                                optionLabel="name"
                                optionValue="packing"

                            />

                            {getFormErrorMessage("packing")}
                        </div>
                    </div>
                    <div className="col-12 md:col-12 lg:col-12 xs:col-12">
                        <div className="flex flex-column">
                            <label htmlFor="fromDate">Weight</label>
                            <InputText
                                id="weight"
                                name="weight"
                                value={formik.values.weight}
                                onChange={formik.handleChange}
                                className={classNames({ "p-invalid": isFormFieldValid("weight") }, "w-full md:w-10 inputClass")}
                                optionlabel="weight"
                                type="weight"
                            />
                            {getFormErrorMessage("weight")}
                        </div>

                    </div>
                    <div className="col-12 md:col-12 lg:col-12 xs:col-12">
                        <div className="flex flex-column">
                            <label htmlFor="fromDate">Description</label>
                            <InputText
                                id="description"
                                name="description"
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                className={classNames({ "p-invalid": isFormFieldValid("description") }, "w-full md:w-10 inputClass")}
                                optionlabel="description"
                                type="description"
                            />
                            {getFormErrorMessage("description")}
                        </div>

                    </div>


                    {/* <div className="col-12 md:col-12 lg:col-12 xl:col-12">
                        <div className="flex flex-column">
                            <label className="mb-2">Ordered ID </label>
                            <InputText type="text" placeholder="Enter" className="w-full md:w-10 inputClass" value={orderId} />
                        </div>
                    </div> */}
                    <div className="col-12 text-center">

                        {/* <Button disabled={loading} iconPos="right" label={"Submit"} autoFocus className="Savebtn p-mr-3"
                            onClick={() => handleDispatch()} /> */}

                        <Button
                            // autoFocus
                            className="Savebtn"
                            label={"Submit"}
                            disabled={loading}
                            type="submit"
                        />
                    </div>
                </div>
            </form>
        </div>

    );
}

export default OrderDispatch;
