import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Link } from "react-router-dom";
import { InputSwitch } from 'primereact/inputswitch';
import { handleGetRequest } from '../../service/GetTemplate';
const CustomerMangement = () => {
    // const [checked1, setChecked1] = useState(false);
    const [loading, setloading] = useState(false);
    const [customersDetails, setCustomersDetails] = useState([]);
    const [GlobalFilter, setGlobalFilter] = useState(null)


    const getCustomersData = async () => {
        setloading(true);
        const res = await handleGetRequest("api/v1/customer/registeredCustomer", false);
        if (res) {
            setCustomersDetails(res);
        }
        setloading(false);
    };

    useEffect(() => {
        getCustomersData();
    }, []);

    const customerNameTemplete = (rowData) => {
        // let customerName = "";
        // if (rowData?.customerName)
        return (
            <div>{rowData?.customerName}</div>)
    };
    return (
        <div>
            <div className="grid">
                <div className="col-12 md:col-12 lg:col-12 xl:col-12">
                    <div className="text-right flex float_right">

                        <div className="">
                            <span className="p-input-icon-right mr-3">
                                <input type="text" placeholder="Search" onInput={(e) => setGlobalFilter(e.target.value)} className="p-inputtext p-component p-filled" />
                                <i className="pi pi-search"></i>
                            </span>
                        </div>

                    </div>
                </div>
                <div className="col-12 md:col-12 lg:col-12 xl:col-12">
                    <div className="innr-Body">
                        <DataTable
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Records"
                            // loading={loading}
                            rows={10}
                            globalFilter={GlobalFilter}
                            paginator
                            responsiveLayout="scroll"
                            value={customersDetails}
                        >
                            <Column body={customerNameTemplete} header="Customer's Name" style={{ width: '20%' }} />
                            {/* <Column field="MembershipCategory" header="Membership Category" /> */}
                            <Column field="contact" header="Contact Number" style={{ width: '20%' }} />
                            <Column field="address" header="Address" style={{ width: '20%' }} />
                            <Column field="email" header="Email Address" style={{ width: '20%' }} />
                            {/* <Column field="Status" header=" Status" /> */}
                            {/* <Column body={actionTemplate} header="Action" /> */}
                        </DataTable>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default CustomerMangement
