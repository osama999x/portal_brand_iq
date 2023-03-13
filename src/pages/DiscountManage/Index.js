import React, { useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import Create from './Create'
import Edit from './Edit'

const Index = () => {
    const [displayBasic, setDisplayBasic] = useState(false);
    const [displayBasic2, setDisplayBasic2] = useState(false);
    const [position, setPosition] = useState('center');
    const dialogFuncMap = {
        'displayBasic': setDisplayBasic,
        'displayBasic2': setDisplayBasic2,
    }
    const onClick = (name, position) => {
        dialogFuncMap[`${name}`](true);

        if (position) {
            setPosition(position);
        }
    }

    const onHide = (name) => {
        dialogFuncMap[`${name}`](false);
    }
    const renderFooter = (name, canDel) => {
        return (
            <div className="grid">
                <div className="col-12 text-center">
                    <Button label="Cancel" onClick={() => onHide(name)} className="Cancelbtn p-mr-3" />
                    <Button label="Save" onClick={() => onHide(name)} autoFocus className="Savebtn" />

                </div>
            </div>
        );
    }

    //================= Table body data=========//

    const [setdata, setdatatable] = useState([]);
    const user = [

        { ProductID: "011", ProductName: "Bloom", Category: "Perfume", SubCategory: "Women-Perfume", OriginalPrice: "300", DiscPrice: "240", Endingdate: "12-07-2022" },
        { ProductID: "012", ProductName: "Wireless A-11", Category: "HeadPhone", SubCategory: "Bluetooth", OriginalPrice: "13000", DiscPrice: "12000", Endingdate: "12-09-2022" },
    ]
    const actionTemplate = (rowData) => {
        return (
            <div className="Edit_Icon">
                <Button tooltip="Edit" icon="pi pi-pencil" tooltipOptions={{ position: "top" }} className="edit p-mr-2" onClick={() => onClick('displayBasic2')} />
                <Button tooltip="Delete" icon="pi pi-trash" tooltipOptions={{ position: "top" }} className="delete p-mr-2 p-ml-3" onClick={confirm2} />
            </div>
        );
    };
    const confirm2 = () => {
        confirmDialog({
            message: 'Do you want to delete this record?',
            header: 'DELETE',
            icon: 'pi pi-trash',
            acceptClassName: 'Savebtn',
            rejectClassName: 'Cancelbtn',
            accept,
            reject
        });
    };
    const accept = () => {
        toast.current.show({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
    }

    const reject = () => {
        toast.current.show({ severity: 'info', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
    }
    const toast = useRef(null);
    return (
        <>
            <Toast ref={toast} />
            <Dialog header="CREATE NEW DISCOUNTS" visible={displayBasic} style={{ width: '60vw' }} footer={renderFooter('displayBasic')} onHide={() => onHide('displayBasic')}>
                <Create />
            </Dialog>
            <Dialog header="EDIT" visible={displayBasic2} style={{ width: '60vw' }} footer={renderFooter('displayBasic2')} onHide={() => onHide('displayBasic2')}>
                <Edit />
            </Dialog>

            <div className="grid">
                <div className="col-12 md:col-12 xl:col-12 lg:col-12">
                    <div className="text-right">
                        <span class="p-input-icon-right mr-3">
                            <input type="text" placeholder="Search" class="p-inputtext p-component p-filled" />
                            <i class="pi pi-search"></i>
                        </span>
                        <button className="p-button p-button-primary p-component" onClick={() => onClick('displayBasic')}>
                            <span className="p-button-icon p-c p-button-icon-left pi pi-plus"></span>
                            <span className="p-button-label p-c">Create New</span>
                            <span className="p-ink"></span>
                        </button>

                    </div>
                </div>
                <div className="col-12 md:col-12 xl:col-12 lg:col-12">
                    <div className="innr-Body">
                        <DataTable rows={5} paginator responsiveLayout="scroll" value={user}>
                            <Column field="ProductID" header="Product ID" />
                            <Column field="ProductName" header="Product Name" />
                            <Column field="Category" header="Category" />
                            <Column field="SubCategory" header="Sub-Category" />
                            <Column field="OriginalPrice" header="Original Price" />
                            <Column field="DiscPrice" header="Disc.Price" />
                            <Column field="Endingdate" header="Ending Date" />
                            <Column body={actionTemplate} header="Action" />
                        </DataTable>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Index;
