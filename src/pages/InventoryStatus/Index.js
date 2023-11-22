import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
// import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
// import { Dropdown } from 'primereact/dropdown';
// import { useHistory } from 'react-router-dom';
import { handleGetRequest } from '../../service/GetTemplate';
import { FilterMatchMode } from "primereact/api";
import Edit from '../../assets/ICONS/icon_edit.png';
import { Button } from 'primereact/button';
import AddEditInventory from './AddEditInventory';
import { Dialog } from 'primereact/dialog';
import { useHistory } from "react-router-dom";

const Index = () => {
    const [displayBasic, setDisplayBasic] = useState(false);
    const [inventoryData, setInventoryData] = useState([]);
    const [reviewsRowData, setReviewsRowData] = useState("");
    const [apprejdata, setAppRejData] = useState("");
    // const [loading, setloading] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
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
    const getInventoryData = async () => {
        // setloading(true);
        const res = await handleGetRequest("api/v1/inventoryStatus/all", false);

        if (res) {
            setInventoryData(res);
        }
        // setloading(false);
    };
    useEffect(() => {
        getInventoryData();
    }, []);

    const actionTemplate = (rowData) => {

        return (
            <div className="Edit_Icon">
                <Button tooltip="Edit" tooltipOptions={{ position: "top" }} className="edit p-mr-2" onClick={() => approveReject(rowData)} >
                    <img src={Edit} />
                </Button>

            </div>
        );
    };

    const approveReject = (rowData) => {
        setDisplayBasic(true);
        setAppRejData(true);
        setReviewsRowData(rowData?.productsId);
    };

    const history = useHistory();
    const onHide = (name) => {
        setDisplayBasic(false);
        setAppRejData(false)
    }
    // const serialTemplate = (rowData, props) => {
    //     return (
    //         <div>
    //             {props.rowIndex + 1}
    //         </div>
    //     )
    // };

    return (
        <div>
            <Dialog header="Update" visible={displayBasic} style={{ width: '40vw' }} onHide={onHide}>
                <AddEditInventory
                    onHide={onHide}
                    reviewsRowData={reviewsRowData}
                    apprejdata={apprejdata}
                    displayBasic={displayBasic}
                //productRowData={productRowData}
                // apprejdata={apprejdata}
                // globalFilterValue={globalFilterValue}
                />
            </Dialog>
            <div className="grid">
                <div className="col-12 md:col-12 xl:col-12 lg:col-12">
                    <div className="text-right flex float_right">

                        <div className="">
                            <span class="p-input-icon-right mr-3">
                                <input type="text" placeholder="Search" onChange={onGlobalFilterChange} class="p-inputtext p-component p-filled" onInput={(e) => setGlobalFilter(e.target.value)} />
                                <i class="pi pi-search"></i>
                            </span>
                        </div>
                        {/* <div className="">
                            < div className="flex flex-column">                               
                                <Dropdown className="w-full md:w-10 inputClass Drop_down" value={selectedCateg} options={categ} onChange={onCategChange} optionLabel="name" placeholder="Select Category" />
                            </div>
                        </div>
                        <div className="">
                            <div className="flex flex-column">

                                <Dropdown className="w-full md:w-10 inputClass Drop_down" value={selectedCateg} options={categ} onChange={onCategChange} optionLabel="name" placeholder="Select Sub-Category" />
                            </div>
                        </div> */}
                        {/* <div className="">
                            <button className="p-button p-button-primary p-component" >

                                <span className="p-button-label p-c">Export to excel</span>
                                <span className="p-ink"></span>
                            </button>
                        </div> */}
                    </div>
                </div>
                <div className="col-12 md:col-12 xl:col-12 lg:col-12">
                    <div className="innr-Body">
                        <DataTable
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Records"
                            globalFilter={globalFilter}
                            rows={7}
                            paginator
                            responsiveLayout="scroll"
                            value={inventoryData}
                            globalFilterFields={["productsName"]}
                        >
                            {/* <Column field="productsId" header="Product-ID" /> */}
                            <Column body={(data, props) => {
                                    return <div>{props.rowIndex + 1}</div>
                                }} header="Serial" />
                            <Column field="productsName" header="Product Name" />
                            <Column field="categoryName" header="Category" />
                            <Column field="subcategoryName" header="Sub-Category" />
                            <Column field="remainingQuantity" header="Remaining Status" />
                            <Column body={actionTemplate} header="Action" />
                        </DataTable>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Index
