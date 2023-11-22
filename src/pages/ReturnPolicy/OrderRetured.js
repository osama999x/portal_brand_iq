import React, { useState } from "react";
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
//import { handleGetRequest } from "../../service/GetTemplate";
// import { useLocation } from "react-router-dom";
import { Button } from "primereact/button";
//import { useFormik } from "formik";
//import * as Yup from "yup";
import { handlePostRequest } from "../../service/PostTemplate";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { Formik, useFormik } from "formik";
import * as Yup from "yup";
//import { classNames } from 'primereact/utils';

const OrderRetured = (id) => {

    console.log("id", id.id)




    const [loading, setLoading] = useState(false);
    //const dispatch = useDispatch();
    //  const [deliveryPartner, setDeliveryPaetner] = useState();
    const [selectedStatus, setSelectedStatus] = useState();
    const [selectedCateg, setSelectedCateg] = useState();
    // console.log("ssa", selectedCateg)

    // const [orderId, setOrderId] = useState(props?.id);
    const validationSchema = Yup.object().shape({
        orderStatus: Yup.mixed().required("This field is required."),
        message: Yup.mixed().required("This field is required."),
    });
    const formik = useFormik({
        validationSchema: validationSchema,
        initialValues: {
            orderStatus: '',
            message: "",
        }
    })


    const dispatch = useDispatch();
    const history = useHistory();
    const handleDispatch = async () => {


        let obj = {
            message: formik?.values?.message,
            orderId: id.id,
            orderStatus: selectedStatus
        }
        console.log("obj", obj)

        const res = await dispatch(handlePostRequest(obj, "api/v1/returnOrder/dispatchReturnOrder", false));
        console.log("response", res)

        if (res?.status === 200) {
            // setOrderId(res);
        }
        setLoading(false);
        // if (formik.values.orderStatus !== "" && formik.values.message !== ""){
        history.push("./returnmanage")
        // }
    };



    // const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    // const getFormErrorMessage = (name) => {
    //     return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    // };


    const onCategChangeStatus = (e) => {
        setSelectedStatus(e.value);
    }




    const statusOption = [
        { name: 'Return', orderStatus: 'Returned' },
        { name: 'Reject', orderStatus: 'Reject' },
    ];
    return (
        <>
            {/* <form onSubmit={formik.handleSubmit}> */}
            <div className="grid p-p-3">
                <div className="col-12 md:col-12 lg:col-12 xl:col-12">
                    <div className="flex flex-column">
                        <label className="mb-2">Order Status</label>
                        <Dropdown
                            //disabled={isDisable}
                            placeholder="Select Status"
                            className="w-full md:w-10 inputClass"
                            value={selectedStatus}
                            name="orderStatus"
                            id="orderStatus"
                            options={statusOption}
                            optionLabel="name"
                            optionValue="orderStatus"
                            onChange={onCategChangeStatus}

                        />
                    </div>
                    {/* {getFormErrorMessage("orderStatus")} */}
                </div>
                <div className="col-12 md:col-12 lg:col-12 xl:col-12">
                    <div className="flex flex-column">
                        <label className="mb-2">Message</label>
                        <InputText type="text" id="message" name="message" placeholder="Message" className="w-full md:w-10 inputClass" onChange={formik.handleChange} />
                    </div>
                    {/* {getFormErrorMessage("message")} */}
                </div>

                <div className="col-12 text-center">

                    <Button disabled={loading} iconPos="right" label={"Submit"} autoFocus className="Savebtn p-mr-3"
                        onClick={() => handleDispatch()}
                    />
                </div>

            </div>
            {/* </form> */}
        </>
    );
}

export default OrderRetured;
