import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import AddEdit from './AddEdit';
import { handleGetRequest } from '../../service/GetTemplate';
import { handleDeleteRequest } from '../../service/DeleteTemplete';
import { useDispatch } from 'react-redux';
import AddTaxType from './AddTaxType';



const ManageTax = () => {
    const dispatch = useDispatch();
    const [displayBasic, setDisplayBasic] = useState(false);
    const [displayBasic3, setDisplayBasic3] = useState(false);
    const [taxdata, setTaxdata] = useState([]);
    // const [TaxTypeData, setTaxTypeData] = useState([]);
    const [TaxRowData, setTaxRowData] = useState(null);
    const [TaxTypeRowData, setTaxTypeRowData] = useState([]);
    const [visibleDelete, setVisibleDelete] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [addEditTax, setaddEditTax] = useState(null);
    const [taxHeadId, setTaxHeadId] = useState();
    const [selectedDeleteId, setSelectedDeleteId] = useState('')

    // const [displayBasic2, setDisplayBasic2] = useState(false);
    // const [deleteModal, setDeleteModal] = useState(false);
    // const [position, setPosition] = useState('center');
    const dialogFuncMap = {
        'displayBasic': setDisplayBasic,
        // 'displayBasic2': setDisplayBasic2,
        // 'deleteModal': setDeleteModal,
        'displayBasic3':setDisplayBasic3,
    }
    const onClick = (name, position) => {
        dialogFuncMap[`${name}`](true);

        // if (position) {
        //     setPosition(position);
        // }
    }

    const getTaxData = async () => {
        const res = await handleGetRequest("api/v1/tax/head", false);
        if (res) {
            setTaxdata(res);
        }
    };
    useEffect(() => {
        getTaxData();
    }, []);

    const TaxHeadDelete = async () => {
        const data = {};    
        console.log("in box")
        data["taxHeadId"] = selectedDeleteId;
        // const data = {
        //     "taxHeadId" : selectedDeleteId
        // };

        const res = await dispatch(handleDeleteRequest(data, `api/v1/tax/head`, false, false));
        if (res.status === 200) {
            getTaxData();

        }
        setSelectedDeleteId('')
        setVisibleDelete(false);

    }
    useEffect(() => {
        if (visibleDelete === true && selectedDeleteId !=="") {
            TaxHeadDelete();
        }

    }, [visibleDelete]);

    const onHide = () => {
        setDisplayBasic(false);
        setDisplayBasic3(false);
    }



    const actionTemplate = (rowData) => {
        return (
            <div className="Edit_Icon">
                <Button tooltip="Edit" icon="pi pi-pencil" tooltipOptions={{ position: "top" }} className="edit p-mr-2" onClick={() => editUsers(rowData)} />
                <Button tooltip="Delete" icon="pi pi-trash" tooltipOptions={{ position: "top" }} className="delete p-mr-2 p-ml-3" onClick={() => { confirm2(rowData) }} />
            </div>
        );
    };

    const editUsers = (rowData) => {
        setDisplayBasic(true);
        setaddEditTax(true);
        setTaxRowData(rowData._id);
    
       
    };
    const confirm2 = (rowData) => {
        setSelectedDeleteId(rowData._id)
        //selectedDeleteId = rowData._id;
        //setTaxHeadId(rowData._id)
        // setTaxRowData(rowData._id);
        // setTaxTypeRowData(rowData._id);
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
        setVisibleDelete(true)
       // RequestToDel();
        //toast.current.show({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
    }

    const reject = () => {
        setVisibleDelete(false)
        // toast.current.show({ severity: 'info', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
    }
    const toast = useRef(null);


    const TaxTypeTemplate = (rowData) => {
        return <div>{rowData?.taxType?.taxType}</div>
    }

    return (
        <>
            <Toast ref={toast} />
            <Dialog header={addEditTax ? "EDIT" : "ADD NEW TAX"} visible={displayBasic}  style={{ width: '40vw' }} onHide={onHide}>
                <AddEdit onHide={onHide} getTaxpData={getTaxData} addEditTax={addEditTax} TaxRowData={TaxRowData} />
                
            </Dialog>
            <Dialog header= "ADD NEW TAXTYPE"  visible={displayBasic3} style={{ width: '40vw' }} onHide={onHide}>
                
                <AddTaxType onHide={onHide} getTaxData={getTaxData}  TaxTypeRowData={TaxTypeRowData} />
            </Dialog>

            <div className="grid">
                <div className="col-12 md:col-12 lg:col-12 xs:col-12">
                    <div className="text-right">
                        <span class="p-input-icon-right mr-3">
                            <input type="text" placeholder="Search" class="p-inputtext p-component p-filled" onInput={(e) => setGlobalFilter(e.target.value)} />
                            <i class="pi pi-search"></i>
                        </span>
                        <button className="p-button p-button-primary p-component mr-2" onClick={() =>{
                            setaddEditTax(false)
                            onClick('displayBasic')}}>
                            <span className="p-button-icon p-c p-button-icon-left pi pi-plus"></span>
                            <span className="p-button-label p-c">Add New</span>
                            <span className="p-ink"></span>
                        </button>
                    
                        <button className="p-button p-button-primary p-component" onClick={() => onClick('displayBasic3')}>
                            <span className="p-button-icon p-c p-button-icon-left pi pi-plus"></span>
                            <span className="p-button-label p-c">Add TaxType</span>
                            <span className="p-ink"></span>
                        </button>

                    </div>
                </div>
                <div className="col-12 md:col-12 lg:col-12 xs:col-12">
                    <div className="innr-Body">
                        <DataTable
                            globalFilter={globalFilter}
                            rows={7}
                            paginator
                            responsiveLayout="scroll"
                            value={taxdata}>
                            {/* <Column field="_id" header="Tax Head ID" /> */}
                            <Column body={TaxTypeTemplate} header="Tax Type" />
                            <Column field="taxHead" header="Tax Head" />
                            <Column field="description" header="Description" />
                            {/* <Column field="Conatct-Number" header="Conatct Number" /> */}
                            <Column body={actionTemplate} header="Action" />
                        </DataTable>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ManageTax;
