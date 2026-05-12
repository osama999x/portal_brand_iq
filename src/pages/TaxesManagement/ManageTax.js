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
import Edit from '../../../src/assets/ICONS/icon_edit.png'
import Delete from '../../../src/assets/ICONS/icon_delete.png'



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
    const [selectedDeleteId, setSelectedDeleteId] = useState('')

    // const [displayBasic2, setDisplayBasic2] = useState(false);
    // const [deleteModal, setDeleteModal] = useState(false);
    // const [position, setPosition] = useState('center');
    const dialogFuncMap = {
        'displayBasic': setDisplayBasic,
        // 'displayBasic2': setDisplayBasic2,
        // 'deleteModal': setDeleteModal,
        'displayBasic3': setDisplayBasic3,
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
        data["taxHeadId"] = selectedDeleteId;
        // const data = {
        //     "taxHeadId" : selectedDeleteId
        // };

        const res = await dispatch(handleDeleteRequest(data, `api/v1/tax/head`, true, true));
        if (res.status === 200) {
            getTaxData();

        }
        setSelectedDeleteId('')
        setVisibleDelete(false);

    }
    useEffect(() => {
        if (visibleDelete === true && selectedDeleteId !== "") {
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
                <Button tooltip="Edit" tooltipOptions={{ position: "top" }} className="edit p-mr-2" onClick={() => editUsers(rowData)} >
                    <img src={Edit} />
                </Button>
                <Button tooltip="Delete" tooltipOptions={{ position: "top" }} className="delete p-mr-2 p-ml-3" onClick={() => { confirm2(rowData) }} >
                    <img src={Delete} />
                </Button>
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
            message: 'Are you sure you want to delete this tax type?',
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
            <Dialog header={addEditTax ? "Edit" : "Add New Tax"} visible={displayBasic} style={{ width: '40vw' }} onHide={onHide}>
                <AddEdit onHide={onHide} getTaxpData={getTaxData} addEditTax={addEditTax} TaxRowData={TaxRowData} />

            </Dialog>
            <Dialog header="Add New Tax Type" visible={displayBasic3} style={{ width: '40vw' }} onHide={onHide}>

                <AddTaxType onHide={onHide} getTaxData={getTaxData} TaxTypeRowData={TaxTypeRowData} />
            </Dialog>

            <div className="grid grid-nogutter">
                <div className="col-12 md:col-12 lg:col-12 xs:col-12">
                    <div className="text-right flex flex-wrap align-items-center justify-content-end">
                        <span className="p-input-icon-right mr-3">
                            <input type="text" placeholder="Search" className="p-inputtext p-component p-filled" onInput={(e) => setGlobalFilter(e.target.value)} />
                            <i className="pi pi-search" />
                        </span>
                        <button className="p-button p-button-primary p-component mr-2" onClick={() => {
                            setaddEditTax(false)
                            onClick('displayBasic')
                        }}>
                            <span className="p-button-icon p-c p-button-icon-left pi pi-plus"></span>
                            <span className="p-button-label p-c">Add New</span>
                            <span className="p-ink"></span>
                        </button>

                        <button className="p-button p-button-primary p-component mr-2" onClick={() => onClick('displayBasic3')}>
                            <span className="p-button-icon p-c p-button-icon-left pi pi-plus"></span>
                            <span className="p-button-label p-c">Add Tax Type</span>
                            <span className="p-ink"></span>
                        </button>

                    </div>
                </div>
                <div className="col-12 md:col-12 lg:col-12 xs:col-12">
                    <div className="innr-Body innr-Body--table">
                        <DataTable
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Records"
                            globalFilter={globalFilter}
                            rows={7}
                            paginator
                            responsiveLayout="stack"
                            value={taxdata}
                            style={{ width: "100%" }}>
                            {/* <Column field="_id" header="Tax Head ID" /> */}
                            <Column field="taxHead" header="Tax Head ID" />
                            <Column body={TaxTypeTemplate} header="Tax Type" />

                            <Column field="description" header="Description" style={{ width: '250px', height: '57px' }} />
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
