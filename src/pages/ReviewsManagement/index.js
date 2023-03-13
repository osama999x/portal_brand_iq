import React, { useState, useEffect, } from 'react';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { handleGetRequest } from '../../service/GetTemplate';
import ApproveReject from './ApproveReject';
import { confirmDialog } from 'primereact/confirmdialog';
import { handleDeleteRequest } from '../../service/DeleteTemplete';
import { useDispatch } from "react-redux";
import { FilterMatchMode } from "primereact/api";

const Index = () => {
    // const [selectedCateg, setSelectedCateg] = useState();

    const [displayBasic, setDisplayBasic] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [reviewData, setReviewData] = useState([]);
    const [reviewsRowData, setReviewsRowData] = useState([]);
    const [apprejdata, setAppRejData] = useState([]);
    const [visibleDelete, setVisibleDelete] = useState(false);
    const dispatch = useDispatch();
  
    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters["global"].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const onHide = (name) => {
        setDisplayBasic(false);
    }

    const actionTemplate = (rowData) => {
        return (
            <div className="Edit_Icon">
                <Button tooltip="Details" icon="pi pi-pencil" tooltipOptions={{ position: "top" }} className="edit p-mr-2" onClick={() => approveReject(rowData)} />
                <Button tooltip="Delete" icon="pi pi-trash" tooltipOptions={{ position: "top" }} className="delete p-mr-2 p-ml-3" onClick={() => { confirm2(rowData) }} />
            </div>
        );
    };

    const approveReject = (rowData) => {
        setDisplayBasic(true);
        setAppRejData(true);
        setReviewsRowData(rowData._id);
    };

    // const customerTemplate = (rowData) => {
    //     let customerName = "";
    //     if (rowData?.customerId?.firstName) {
    //         customerName = rowData?.customerId?.firstName + " " + rowData?.customerId?.lastName;
    //         return (<div>{customerName}</div>)
    //     }
    // };
    
    // const productTemplate = (rowData) => {
    //     return (
    //         <div>
    //             {rowData?.productId?.name}
    //         </div>
    //     );
            
        
    // };
    // const membershipTemplate = (rowData) => {
    //     return (
    //         <div>
    //             {rowData?.customerId?.membershipCategory}
    //         </div>
    //     );
    // };
    // const contactTemplate = (rowData) => {
    //     return (
    //         <div>
    //             {rowData?.customerId?.contact}
    //         </div>
    //     );
    // };
    const approveTemp = (rowData) => {
        return (<div>{rowData?.isApproved === true ? "Approved" : "Reject"}</div>
        );
    };
    const getReviewsData = async () => {

        const res = await handleGetRequest("api/v1/review/all", false);
        if (res) {
            setReviewData(res);
        }
    };

    useEffect(() => {
        getReviewsData();
    }, []);
    const RequestToDel = async () => {
        const data = {};
        data["reviewId"] = reviewsRowData;

        const res = await dispatch(handleDeleteRequest(data, `api/v1/review/`, false, false));
        if (res.status === 200) {
            getReviewsData();

        }
        setVisibleDelete(false);

    }
    useEffect(() => {
        getReviewsData();
        // RequestToDel();
        if (visibleDelete === true) {
            RequestToDel();

        }

    }, [visibleDelete]);
    const confirm2 = (rowData) => {
        setReviewsRowData(rowData._id);
        confirmDialog({
            message: 'Are you sure you want to delete this item?',
            header: 'Delete Confirmation',
            icon: 'pi pi-trash',
            acceptClassName: 'Savebtn',
            rejectClassName: 'Cancelbtn',
            accept,
            reject
        });
    };
    const accept = () => {
        setVisibleDelete(true);
        // toast.current.show({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
    }

    const reject = () => {
        setVisibleDelete(false);
        // toast.current.show({ severity: 'info', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
    }
    return (
        <div>
            <Dialog header="DETAIL Reviews" visible={displayBasic} style={{ width: '40vw' }} onHide={onHide}>
                <ApproveReject
                    onHide={onHide}
                    getReviewsData={getReviewsData}
                    reviewsRowData={reviewsRowData}
                    apprejdata={apprejdata}
                    globalFilterValue={globalFilterValue}
                />
            </Dialog>
            <div className="grid">
                <div className="col-12">
                    <div className="text-right flex float_right">
                        <div className="">
                            <span class="p-input-icon-right mr-3">
                                <input type="text" placeholder="Search" onChange={onGlobalFilterChange} class="p-inputtext p-component p-filled"
                                  onInput={(e) => setGlobalFilter(e.target.value)}
                                  />
                                <i class="pi pi-search"></i>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="col-12">
                    <div className="innr-Body">
                        <DataTable
                            globalFilter={globalFilter}
                            rows={7}
                            paginator
                            responsiveLayout="scroll"
                            value={reviewData}
                            globalFilterFields={["customerId.contact","channel"]}

                        >
                            <Column field="customer.name" header="Customer's Name" />
                            <Column field="customer.membershipCategory" header="Membership Category" />
                            <Column field="product.name" header="Product"/>
                            <Column field="customer.contact" header="Contact Number" />
                            <Column field="channel" header="Channel" />
                            <Column body={approveTemp} header="Approved Status" />
                            <Column body={actionTemplate} header="Action" />
                        </DataTable>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Index

