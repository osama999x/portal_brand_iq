import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { Link } from "react-router-dom";
import { confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { handleGetRequest } from "../../service/GetTemplate";
import { handleDeleteRequest } from "../../service/DeleteTemplete";
import { useDispatch } from "react-redux";
import Moment from "moment";
import { Sidebar } from "primereact/sidebar";
import { useHistory } from "react-router-dom";
import AddEditOrderManagement from "./AddEditOrderManagement";
import { FilterMatchMode } from "primereact/api";

// import AddEditProduct from "./AddEditProduct"


const OrderManagement = () => {
    const dispatch = useDispatch();
    const [visibleEdit, setVisibleEdit] = useState(false);
    const [visibleDelete, setVisibleDelete] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [editable, setEditable] = useState(false);
    const [orderRowData, setOrderRowData] = useState("");
    const [urlOrderId, setUrlOrderId] = useState("");
    const [orderData, setOrderData] = useState([]);
    const [loading, setloading] = useState(false);
    const [orderid, setOrderid] = useState();
    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    useEffect(() => {
        getOrderData();
    }, []);
    useEffect(() => {
        if (visibleDelete === true) {
            handleDeleteRow();
        }
    }, [visibleDelete]);

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters["global"].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };



    const onHide = () => {
        setEditable(false);
        setVisibleEdit(false);
    };

    const getOrderData = async () => {
        setloading(true);
        const res = await handleGetRequest("api/v1/order/all", false);
        if (res) {
            setOrderData(res);
        }
        setloading(false);
    };

    const handleDeleteRow = async () => {
        setloading(true);
        const data = {};
        data["productId"] = orderRowData;

        const res = await dispatch(handleDeleteRequest(data, `api/v1/products/`, true, true));

        setloading(false);
        if (res?.status === 200) {
            getOrderData();
            // setloading(false);
            // setSeverities("success")
            // setShowMessage('A password reset link has been sent to the user email address: "' + userEmailAddress+'"')
        } else {
            // setloading(false);
            // setSeverities("error")
            // setShowMessage('Please update user email address. "'+ userEmailAddress+'" is not registered ')
        }
    };


    const actionTemplate = (rowData) => {
        setUrlOrderId(rowData._id);
        return (
            <div className="Edit_Iconn">
                <Button tooltip="Details"
                    //  icon="pi pi-pencil"
                    label="Details"
                    tooltipOptions={{ position: "top" }}
                    className="btn btn-info ml-auto"
                    onClick={() => history.push({
                        // id:rowData._id},'',`/detailordermanagement?orderid=${rowData._id}`

                        pathname: '/detailordermanagement',
                        search: `?orderid=${rowData._id}`,
                        state: { id: rowData._id, data: rowData }
                    }
                    )} />
                {/* <Button tooltip="Delete" icon="pi pi-trash" tooltipOptions={{ position: "top" }} className="delete p-mr-2 p-ml-3" onClick={() => confirm2(rowData)} /> */}
                {/* <Button tooltip="Delete" icon="pi pi-trash" tooltipOptions={{ position: "top" }} className="delete p-mr-2 p-ml-3" onClick={confirm2} /> */}
            </div>
        );
    };



    const editOrder = (rowData) => {
        setVisibleEdit(true);
        setEditable(true);
        // setOrderRowData(rowData._id);
    };
    const confirm2 = (rowData) => {
        setOrderRowData(rowData._id);
        confirmDialog({
            message: "Do you want to delete this record?",
            header: "Delete Confirmation",
            icon: "pi pi-trash",
            acceptClassName: "Savebtn",
            rejectClassName: "Cancelbtn",
            accept,
            reject,
        });
    };
    const accept = () => {
        setVisibleDelete(true);
        // toast.current.show({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
    };

    const reject = () => {
        setVisibleDelete(false);
        // toast.current.show({ severity: 'info', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
    };

    const customerNameTemplete = (rowData) => {
        let customerName = "";
        if (rowData?.customer?.firstName) {
            customerName = rowData?.customer?.firstName + " " + rowData?.customer?.lastName;
            return <React.Fragment><Link to={`./customerdetails?orderid=${rowData?.customer._id}`}>{customerName}</Link></React.Fragment>;
        }
    };


    const statusTemplete = (rowData) => {
        const status = capitalizeFirstLetter(rowData?.status);
        return <span className={`${status}`}>{status}</span>;
    };
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
                <Link to={`./detailordermanagement?orderid=${rowData?._id}`}>{rowData?.orderId}</Link>
            </React.Fragment>
        );
    };

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    const history = useHistory();
    const toast = useRef(null);
    const sidebarHeader = () => {
        return (
            <div className="card-header">
                <label>Details</label>
            </div>
        );
    };
    return (
        <>
            <Toast ref={toast} />
            <Sidebar header={sidebarHeader} position="right" className="w-full" visible={visibleEdit} onHide={onHide}>
                {/* <Create /> */}
                {/* <Add></Add> */}
                <AddEditOrderManagement orderId={urlOrderId} getOrderData={getOrderData} editable={editable} onHide={onHide} orderRowData={orderRowData} />
            </Sidebar>

            <div className="grid">
                <div className="col-12  md:col-12 lg:col-12 xl:col-12">
                    <div className="text-right">
                        <span className="p-input-icon-right mr-3">
                            <input type="text" placeholder="Search" onInput={(e) => setGlobalFilter(e.target.value)} className="p-inputtext p-component p-filled" />
                            <i className="pi pi-search"></i>
                        </span>
                        {/* <button className="p-button p-button-primary p-component" onClick={() => setVisibleEdit(true)}>
                            <span className="p-button-icon p-c p-button-icon-left pi pi-plus"></span>
                            <span className="p-button-label p-c">Add New</span>
                            <span className="p-ink"></span>
                        </button> */}
                    </div>
                </div>
                <div className="col-12 md:col-12 lg:col-12 xl:col-12">
                    <div className="innr-Body">
                        <DataTable
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Records"
                            // loading={loading}
                            rows={10} paginator
                            responsiveLayout="scroll"
                            value={orderData}
                            globalFilter={globalFilter}
                            globalFilterFields={["orderId", "customer.firstName", "customer.lastName", "placedOn"]}
                        >
                            <Column body={OrderIdClickable} header="Order ID" />
                            <Column body={customerNameTemplete} field="customer.firstName" header="Customer's Name" />
                            <Column body={orderDateTemplete} field="placedOn" header="Placed On" />
                            <Column field="totalBill" header="Order Amount" />
                            <Column body={statusTemplete} header="Status" />
                            <Column body={actionTemplate} header="Action" />
                        </DataTable>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrderManagement;
