import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { useFormik } from "formik";
import { Button } from "primereact/button";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Link } from "react-router-dom";
import * as Yup from "yup";
import Moment from "moment";
import { handleGetRequest } from "../../service/GetTemplate";
// import { useDispatch } from "react-redux";
import { ProgressSpinner } from "primereact/progressspinner";
import { useHistory, useLocation } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import OrderDispatch from "../OrderManagement/OrderDispatch";


const CustomerDetails = () => {
    let { search ,state} = useLocation();
    const query = new URLSearchParams(search);
    const customerRowData = query.get("orderid");
    
    const editable = customerRowData?true:false;

    const [loading, setLoading] = useState(false);
    const [fileUploadData, setfileUploadData] = useState("");
    // const [loadingIcon, setloadingIcon] = useState("pi pi-save");

    // const [customerData, setCustomerData] = useState();
    
    const [displayDialog, setDisplayDialog] = useState(false);
    const [orderHitorey, setOrderHistory] = useState();

    const history = useHistory();
    // const dispatch = useDispatch();

    const getCustomerById = async () => {
        const data = {};
        data["roleId"] = customerRowData;
        setLoading(true);
        const res = await handleGetRequest("api/v1/customer/registeredCustomer",true);
        if (res)
        {   var customerById = res.filter(function (el)
            {
              return el._id == customerRowData;
            })
            
            formik.setFieldValue("customerName",customerById[0].customerName);
            formik.setFieldValue("address",customerById[0].address);
            formik.setFieldValue("contact",customerById[0].contact);
            setLoading(false);
        }
    };
    const getOrderHistoryByCustomerId = async () => {
        setLoading(true);
        const res = await handleGetRequest(`api/v1/order/customerOrderHistory?customerId=${customerRowData}`, false);
        if (res) {
        
            setOrderHistory(res);
        }
        setLoading(false);
    }
    
    useEffect(() => {
        if (customerRowData !== undefined && customerRowData !== null && editable === true) {
            getCustomerById();
            getOrderHistoryByCustomerId();
        }
    }, []);
    
    const getOrderData = () =>{
        history.push("./ordermanagement")
    }

    const validationSchema = Yup.object().shape({
        name: Yup.string().required("This field is required."),
        description: Yup.string().required("This field is required.").nullable(),
    });
    const onHide = (name) => {

        setDisplayDialog(false);

    };
    const handleDialog = () => {

        setDisplayDialog(true);

    };

    const formik = useFormik({
        validationSchema: validationSchema,
        initialValues: {
            customerName: "",
            address:"",
            contact:"",
            email:""
            // permissionsId: "",
        },

      
        onSubmit: async (data) => {
            // setLoading(true);
            // setloadingIcon("pi pi-spin pi-spinner");
            if (editable === true) {
                data["categoryId"] = customerRowData;
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

    const statusTemplete = (rowData) => {
        const status = capitalizeFirstLetter(rowData?.status);
        return <span className={`${status}`}>{status}</span>;
    };
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    const orderDateTemplete = (rowData) => {
        return (
            <React.Fragment>
                <span>{Moment(rowData?.placedOn).format("MMM DD, YYYY h:mm a")}</span>
            </React.Fragment>
        );
    };
    const OrderIdClickable = (rowData) => {
        return (
            <React.Fragment>
                {/* <Link to={"./Dashboard"}>Dashboard</Link> */}
                {/* ./detailordermanagement?orderid=${rowData._id} */}
                <Link to={`./detailordermanagement?orderid=${rowData._id}`}>{rowData?.orderId}</Link>
            </React.Fragment>
        );
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
                                        {/* <span className="pr-5">
                                            <b>o</b>
                                        </span> */}
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
                                <div className="col-6 innr_padding mt-3 mb-3">
                                    <div className="grid">
                                        <div className="col-12 md:col-12 lg:col-12 xl:col-12">
                                            <div className="innr-Body">
                                                <DataTable rows={5} responsiveLayout="scroll" value={orderHitorey} >
                                                    <Column body={OrderIdClickable} header="Order ID" />
                                                    <Column body={statusTemplete} header="Status" />
                                                    <Column body={orderDateTemplete} header="Placed On" />
                                                    {/* <Column field="price" header="Price" /> */}
                                                </DataTable>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="grid">
                                <div className="col-12 text-right pt-4">
                                    {/* <Button autoFocus className="Savebtn" label="Process" onClick={() => onClick("displayBasic")}></Button> */}
                                    <Button autoFocus className="Savebtn" label="Process" onClick={handleDialog} ></Button>

                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            )}
        </>
    );
};

export default CustomerDetails;
