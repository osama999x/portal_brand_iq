import React, { useState, useEffect, useRef } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { Link } from "react-router-dom";
import Moment from "moment";
import { handleGetRequest } from "../../service/GetTemplate";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { Sidebar } from "primereact/sidebar";
import AddEditReturn from "./AddEditReturn";
import { useHistory } from "react-router-dom";
const ManageReturn = () => {
    
    const [visibleEdit, setVisibleEdit] = useState(false);
    const [visibleDelete, setVisibleDelete] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [editable, setEditable] = useState(false);
    const [returnorderData, setReturnOrderData] = useState([]);
    const [loading, setloading] = useState(false);
    const [orderData, setOrderData] = useState([]);
    const [orderRowData, setOrderRowData] = useState("");



    const onHide = () => {
        setEditable(false);
        setVisibleEdit(false);
    };


    const getReturnOrderData = async () => {
        setloading(true);
        const res = await handleGetRequest("api/v1/returnOrder/list", false);
    
        if (res) {
            setReturnOrderData(res);
        }
        setloading(false);
    };
    useEffect(() => {
        getReturnOrderData();
    }, []);
    const actionTemplate = (rowData) => {
        return (
            <div className="Edit_Icon">
               <Button tooltip="Detail" 
                    // icon="pi pi-arrow-circle-right" 
                    label="Detail"
                    tooltipOptions={{ position: "top" }} className='btn btn-info ml-auto'
                    onClick={() => history.push({
                        pathname: '/detailreturnordermanagement',
                        search: `?orderid=${rowData?.orderId?._id}`,
                        state: { id: rowData?.orderId?._id }
                    }
                    )} />
            </div>
        );
    };

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    const statusTemplete = (rowData) => {
        const status = capitalizeFirstLetter(rowData?.orderId?.status);
        return <span className={`${status}`}>{status}</span>;
    }

    const OrderIdClickable = (rowData) => {
    
        return (
            <React.Fragment>
                {/* <Link to={"./Dashboard"}>Dashboard</Link> */}
                {/* ./detailordermanagement?orderid=${rowData._id} */}
                <Link to={`./detailreturnordermanagement?orderid=${rowData?.orderId?._id}`}>{rowData?.orderId?.orderId}</Link>
            </React.Fragment>
        );
    };
    const customerNameTemplete = (rowData) => {
        let customerName = "";
        if (rowData?.orderId?.customer?.firstName) {
            customerName = rowData?.orderId?.customer?.firstName + " " + rowData?.orderId?.customer?.lastName;
        
            return <React.Fragment>{customerName}</React.Fragment>
        }
    };
    const orderDateTemplete = (rowData) => {
        return (
            <React.Fragment>
                <span>{Moment(rowData?.returnDate).format("MMM DD, YYYY h:mm a")}</span>
            </React.Fragment>
        );
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
    const sidebarHeader = () => {
        return (
            <div className="card-header">
                <label>DETAILS</label>
            </div>
        );
    };
    const history = useHistory();
    const toast = useRef(null);

  return (
    <>
          <Toast ref={toast} />
          <Sidebar header={sidebarHeader} position="right" className="w-full" visible={visibleEdit} onHide={onHide}>
              {/* <Create /> */}
              {/* <Add></Add> */}
              <AddEditReturn getReturnOrderData={getReturnOrderData} editable={editable} onHide={onHide} orderRowData={orderRowData} />
          </Sidebar>
          <div className="grid">
              <div className="col-12  md:col-12 lg:col-12 xl:col-12">
                  <div className="text-right">
                      <span className="p-input-icon-right mr-3">
                          <input type="text" placeholder="Search" onInput={(e) => setGlobalFilter(e.target.value)} className="p-inputtext p-component p-filled" />
                          <i className="pi pi-search"></i>
                      </span>
                  </div>
              </div>
              <div className="col-12 md:col-12 lg:col-12 xl:col-12">
                  <div className="innr-Body">
                      <DataTable
                          // loading={loading}
                          rows={10} paginator
                          responsiveLayout="scroll"
                          value={returnorderData}
                          globalFilter={globalFilter}>
                          <Column body={OrderIdClickable} header="Order ID" />
                          <Column body={customerNameTemplete} header="Customer's Name" />
                          <Column body={orderDateTemplete} header="Return Date" />
                          <Column body={statusTemplete} header="Status" />
                          <Column body={actionTemplate} header="Detail" />
                      </DataTable>
                  </div>
              </div> 
              </div>   
    </>
  )
}

export default ManageReturn
