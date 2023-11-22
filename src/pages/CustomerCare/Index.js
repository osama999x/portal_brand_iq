import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { handleGetRequest } from '../../service/GetTemplate';
import axios from "axios";
import moment from 'moment';


const Index = () => {
    const [globalFilter, setGlobalFilter] = useState(null);
    const [customercare, setCustomerCare] = useState([]);

    useEffect(() => {
        getCustomerCareData();
    }, []);


    const getCustomerCareData = async () => {
        const res = await axios.get("//zstorewebsite.appinsnap.com/api/get-customer-care-detail", false);
        if (res) {
            setCustomerCare(res?.data);

        }
    };
    const DateTemplate = (rowData) => {
        return (
            <React.Fragment>
                {moment(rowData?.created_at).format("YYYY-MM-DD")}
            </React.Fragment>
        );
    };

    return (
        <div>
            <div className="grid">
                <div className="col-12">
                    <div className="text-right flex float_right">
                        <div className="">
                            <span class="p-input-icon-right mr-3">
                                <input type="text" placeholder="Search" class="p-inputtext p-component p-filled" onInput={(e) => setGlobalFilter(e.target.value)} />
                                <i class="pi pi-search"></i>
                            </span>
                        </div>

                    </div>
                </div>
                <div className="col-12">
                    <div className="innr-Body">
                        <DataTable
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Records"
                            globalFilter={globalFilter}
                            rows={7}
                            paginator
                            responsiveLayout="scroll"
                            value={customercare}
                        >
                            <Column field="email" header="Email" />
                            <Column field="comment" header="Comment" />
                            <Column body={DateTemplate} header="Date" />

                        </DataTable>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Index

