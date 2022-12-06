import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
// import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
// import { Dropdown } from 'primereact/dropdown';
// import { useHistory } from 'react-router-dom';
import { handleGetRequest } from '../../service/GetTemplate';


const Index = () => {

    const [inventoryData, setInventoryData] = useState([]);
    // const [loading, setloading] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);

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

    return (
        <div>
            <div className="grid">
                <div className="col-12 md:col-12 xl:col-12 lg:col-12">
                    <div className="text-right flex float_right">

                        <div className="">
                            <span class="p-input-icon-right mr-3">
                                <input type="text" placeholder="Search" class="p-inputtext p-component p-filled" onInput={(e) => setGlobalFilter(e.target.value)} />
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
                            globalFilter={globalFilter}
                            rows={7}
                            paginator
                            responsiveLayout="scroll"
                            value={inventoryData}
                        >
                            <Column field="productsId" header="ProductID" />
                            <Column field="productsName" header="Product Name" />
                            <Column field="categoryName" header="Category" />
                            <Column field="subcategoryName" header="Sub-Category" />
                            <Column field="remainingQuantity" header="Remaining Status" />
                        </DataTable>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Index
