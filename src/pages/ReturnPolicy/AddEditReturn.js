import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Image } from "primereact/image";
import { useFormik } from "formik";
import classNames from "classnames";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import * as Yup from "yup";
import { handleGetRequest } from "../../service/GetTemplate";
import { handlePostRequest } from "../../service/PostTemplate";
import { handlePatchRequest } from "../../service/PatchTemplete";
import { useDispatch } from "react-redux";
import { ProgressSpinner } from "primereact/progressspinner";
import { useHistory, useLocation } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { baseURL } from "../../utilities/Config";
import OrderRetured from "./OrderRetured";


const AddEditReturn = (props) => {

    let { search, state } = useLocation();

    console.log("stasddste", state?.id)


    const query = new URLSearchParams(search);
    const orderRowData = query.get("orderid");
    const editable = orderRowData ? true : false;

    const [loading, setLoading] = useState(false);
    const [fileUploadData, setfileUploadData] = useState("");
    const [loadingIcon, setloadingIcon] = useState("pi pi-save");
    const [displayDialog, setDisplayDialog] = useState(false);
    const [productData, setProductData] = useState([]);
    const [returnProduct, setReturnProduct] = useState();
    const [exchange, setExchange] = useState();
    const [shipment, setShipment] = useState();
    const [data, setData] = useState([]);
    const [myId, setMyId] = useState();

    const history = useHistory();
    const dispatch = useDispatch();

    const onHide = (name) => {

        setDisplayDialog(false);

    };

    useEffect(() => {

    }, [data])

    const handleDialog = () => {

        setDisplayDialog(true);

    };
    const handleCancel = (e) => {
        e.preventDefault();
        history.push("./returnmanagement")
        onHide();
    };

    const getUsersByID = async () => {
        const data = {};
        data["roleId"] = orderRowData;
        setLoading(true);
        const res = await handleGetRequest(`api/v1/returnOrder/details?orderId=${orderRowData}`, true);

        setReturnProduct(res?.returnProduct[0]?.productId?._id)

        setExchange(res?.exchangeReason)
        setShipment(res?.shipmentType)
        setProductData(res?.orderId?.product);
        setData(res?.images);
        if (res) {
            const keyData = res;
            setLoading(false);
            Object.keys(keyData).forEach((key) => {
                if (formik.initialValues.hasOwnProperty(key)) {
                    formik.setFieldValue(key, keyData[key]);
                }
            });
            const customerName = keyData?.orderId?.customer?.firstName + " " + keyData?.orderId?.customer?.lastName;
            formik.setFieldValue("customerName", customerName)
            const address = keyData?.orderId?.address;
            formik.setFieldValue("address", address)
            const contact = keyData?.orderId?.contact;
            formik.setFieldValue("contact", contact)
        }
    };

    useEffect(() => {
        if (orderRowData !== undefined && orderRowData !== null && editable === true) {
            getUsersByID();
            let didcancel = false;
        }
    }, []);

    const getOrderData = () => {
        history.push("./returnmanage")
    }

    const validationSchema = Yup.object().shape({
        name: Yup.string().required("This field is required."),
        description: Yup.string().required("This field is required.").nullable(),
    });

    const formik = useFormik({
        validationSchema: validationSchema,
        initialValues: {
            customerName: "",
            address: "",
            contact: "03",
            quantity: "",
            price: "",

            // permissionsId: "",
        },


        //     onSubmit: async (data) => {
        //         // setLoading(true);
        //         // setloadingIcon("pi pi-spin pi-spinner");
        //         if (editable === true) {
        //             data["categoryId"] = orderRowData;
        //             // const res = await dispatch(handlePatchRequest(data, "api/v1/category/", true, true));
        //             // if (res?.status === 200) {
        //             //     await getOrderData();
        //             //     formik.resetForm();
        //             //     // onHide();
        //             // }
        //         } else {
        //             data["icon"] = fileUploadData;
        //             // const res = await dispatch(handlePostRequest(data, "api/v1/category/", true, true));
        //             // if (res?.status === 200) {
        //             //     await getOrderData();
        //             //     formik.resetForm();
        //             // onHide();
        //             // }
        //         }
        //         // setLoading(false);
        //         // setloadingIcon("pi pi-save");
        //     },
    });
    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };


    const returnProductTempalte = () => {

        return <React.Fragment>{returnProduct}</React.Fragment>;
    };

    const exchangeTemplate = () => {

        return <React.Fragment>
            {exchange}
        </React.Fragment>;
    };
    const shipmentTypeTemplate = () => {

        return <React.Fragment>
            {shipment}
        </React.Fragment>;
    };

    const imageTemplate = (orderRowData) => {

        return (
            <React.Fragment>


                <Image src={`${baseURL}/${orderRowData}`} zoomSrc={`http://20.212.227.60:3007/${data}`} alt="Image" width="80" height="60" preview />

            </React.Fragment>
        );
    };


    // const subImageTemplate = (rowData) => {

    //     return (
    //         <React.Fragment>
    //             {/* {rowData?.image} */}
    //             {/* <img className='tbl__coupanImage' src={`http://20.212.227.60:3007/${rowData.image}`} alt="" /> */}
    //             <Image src={`${rowData?.images}`} zoomSrc={`http://20.212.227.60:3007/${rowData?.data.images}`} alt="Image" width="80" height="60" preview />
    //         </React.Fragment>
    //     );
    // };

    return (
        <>
            <Dialog header="Order Returned" visible={displayDialog} style={{ width: "40vw" }} closable={true} onHide={() => onHide('displayDialog')}>
                <OrderRetured id={state?.id} />

            </Dialog>

            {loading ? (
                <ProgressSpinner style={{ display: "flex", justifyContent: "center", alignItem: "center", height: "50vh" }} strokeWidth="2" stroke-miterlimit="10" />
            ) : (
                <form onSubmit={formik.handleSubmit}>
                    <div className="card headr_bg">
                        <div className="card-header">
                            <label>Details</label>
                        </div>
                        <div className="card-body">
                            <div className="grid">
                                <div className="col-12 md:col-12 xl:col-12 lg:col-12 pt-3 pb-3">
                                    <label>

                                        <b> Return Product</b>
                                    </label>
                                </div>
                                <div className="col-12 innr_padding mt-1 mb-1">
                                    <div className="grid">
                                        <div className="col-12 md:col-12 lg:col-12 xl:col-12">
                                            <div className="innr-Body">
                                                <DataTable rows={5} responsiveLayout="scroll" value={data} >
                                                    <Column body={returnProductTempalte} header="Return Product" />
                                                    <Column body={imageTemplate} header="Image" />
                                                    <Column body={shipmentTypeTemplate} header="Shipment Type" />
                                                    <Column body={exchangeTemplate} header="Exchange Reason" />


                                                </DataTable>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 md:col-12 xl:col-12 lg:col-12 pt-3 pb-3">
                                    <label>
                                        <b> Customer Details</b>
                                    </label>
                                </div>
                                <div className="col-12 md:col-4 xl:col-4 lg:col-4">
                                    <div className="flex flex-column">
                                        <label className="mb-2">Customer's Name</label>
                                        <InputText disabled={true} id="customerName" name="customerName" value={formik?.values?.customerName} type="text" placeholder="Enter" className="w-full md:w-10 inputClass" />
                                    </div>
                                </div>
                                <div className="col-12 md:col-4 xl:col-4 lg:col-4">
                                    <div className="flex flex-column">
                                        <label className="mb-2">Delivery Address</label>
                                        <InputText disabled={true} id="address" name="address" value={formik?.values?.address} type="text" placeholder="Enter" className="w-full md:w-10 inputClass" />
                                    </div>
                                </div>
                                <div className="col-12 md:col-4 xl:col-4 lg:col-4">
                                    <div className="flex flex-column">
                                        <label className="mb-2">Contact Number</label>
                                        <InputText disabled={true} id="contact" name="contact" value={formik?.values?.contact} type="text" placeholder="Enter" className="w-full md:w-10 inputClass" />
                                    </div>
                                </div>
                                <div className="col-12 md:col-12 xl:col-12 lg:col-12 pt-3 pb-3">
                                    <label>
                                        {/* <span className="pr-5">
                                            <b>o</b>
                                        </span> */}
                                        <b> Items Details</b>
                                    </label>
                                </div>
                                <div className="col-12 innr_padding mt-1 mb-1">
                                    <div className="grid">
                                        <div className="col-12 md:col-12 lg:col-12 xl:col-12">
                                            <div className="innr-Body">
                                                <DataTable rows={5} responsiveLayout="scroll" value={productData} >
                                                    <Column field="productId.name" header="Product Name" />
                                                    <Column field="quantity" header="Quantity" />
                                                    <Column field="price" header="Price" />


                                                </DataTable>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="grid">
                                <div className="col-12 text-center pt-4">
                                    <Button label="Cancel" onClick={(e) => handleCancel(e)} className="Cancelbtn p-mr-3" />
                                    <Button autoFocus className="Savebtn" label="Process" onClick={handleDialog} />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            )}
        </>
    );
};

export default AddEditReturn;
