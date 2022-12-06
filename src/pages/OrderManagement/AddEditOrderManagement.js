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
import OrderDispatch from "./OrderDispatch";

const AddEditOrderManagement = (props) => {
    console.log("Props here:    ", props)
    let { search, state } = useLocation();
    // console.log('state here',state)
    const query = new URLSearchParams(search);
    const orderRowData = query.get("orderid");
    const editable = orderRowData ? true : false;

    const [loading, setLoading] = useState(false);
    const [fileUploadData, setfileUploadData] = useState("");
    const [loadingIcon, setloadingIcon] = useState("pi pi-save");
    const [displayDialog, setDisplayDialog] = useState(false);
    const [productData, setProductData] = useState();

    const history = useHistory();
    console.log("Data here: ", { search, state, history });
    const dispatch = useDispatch();

    const onHide = (name) => {

        setDisplayDialog(false);

    };

    const handleDialog = () => {

        setDisplayDialog(true);

    };

    const getUsersByID = async () => {
        const data = {};
        data["roleId"] = orderRowData;
        setLoading(true);
        const res = await handleGetRequest(`api/v1/order/detail?orderId=${orderRowData}`, true);
        if (res) {
            setProductData(res?.product)
            const keyData = res;
            setLoading(false);
            Object.keys(keyData).forEach((key) => {
                if (formik.initialValues.hasOwnProperty(key)) {
                    formik.setFieldValue(key, keyData[key]);
                }
            });
            const customerName = keyData?.customer?.firstName + " " + keyData?.customer?.lastName;
            formik.setFieldValue("customerName", customerName)
        }
    };

    useEffect(() => {
        if (orderRowData !== undefined && orderRowData !== null && editable === true) {
            getUsersByID();
        }
    }, []);

    const getOrderData = () => {
        history.push("./ordermanagement")
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
            contact: "",

            // permissionsId: "",
        },


        onSubmit: async (data) => {
            // setLoading(true);
            // setloadingIcon("pi pi-spin pi-spinner");
            if (editable === true) {
                data["categoryId"] = orderRowData;
                // const res = await dispatch(handlePatchRequest(data, "api/v1/category/", true, true));
                // if (res?.status === 200) {
                //     await getOrderData();
                //     formik.resetForm();
                //     // onHide();
                // }
            } else {
                data["icon"] = fileUploadData;
                // const res = await dispatch(handlePostRequest(data, "api/v1/category/", true, true));
                // if (res?.status === 200) {
                //     await getOrderData();
                //     formik.resetForm();
                // onHide();
                // }
            }
            // setLoading(false);
            // setloadingIcon("pi pi-save");
        },
    });
    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };

    const categoryTemplete = (rowData) => {
        return <React.Fragment>{rowData?.categoryId?.name}</React.Fragment>;
    };
    const subCategoryTemplete = (rowData) => {
        return <React.Fragment>{rowData?.subcategoryId?.name}</React.Fragment>;
    };
    const productTemplete = (rowData) => {
        return <React.Fragment>{rowData?.productId?.name}</React.Fragment>;
    };

    return (
        <>
            <Dialog header="ORDER DISPATAH" visible={displayDialog} style={{ width: "40vw" }} closable={true}  onHide={() => onHide('displayDialog')}>
                <OrderDispatch id={state?.id} />
            </Dialog>

            {loading ? (
                <ProgressSpinner style={{ display: "flex", justifyContent: "center", alignItem: "center", height: "50vh" }} strokeWidth="2" stroke-miterlimit="10" />
            ) : (
                <form onSubmit={formik.handleSubmit}>
                    <div className="card headr_bg">
                        <div className="card-header">
                            <label>DETAILS</label>
                        </div>
                        <div className="card-body">
                            <div className="grid">
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
                                <div className="col-12 innr_padding mt-3 mb-3">
                                    <div className="grid">
                                        <div className="col-12 md:col-12 lg:col-12 xl:col-12">
                                            <div className="innr-Body">
                                                <DataTable rows={5} responsiveLayout="scroll" value={productData} >
                                                    <Column body={categoryTemplete} header="Category" />
                                                    <Column body={subCategoryTemplete} header="Sub-Category" />
                                                    <Column body={productTemplete} header="Product Name" />
                                                    <Column field="quantity" header="Quantity" />
                                                    <Column field="price" header="Price" />
                                                </DataTable>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="grid">
                                <div className="col-12 text-right pt-4">

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

export default AddEditOrderManagement;
