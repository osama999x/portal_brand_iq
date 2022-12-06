import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { handleGetRequest } from '../../../service/GetTemplate';
import { handleDeleteRequest } from '../../../service/DeleteTemplete';
import { useDispatch } from "react-redux";
import AddEditCategory from './AddEditCategory';
// import { FileUpload } from 'primereact/fileupload';
// import AddEditUsers from './AddEditUsers';

const CategoryManagement = () => {
    const dispatch = useDispatch();
    const [visibleEdit, setVisibleEdit] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [visibleDelete, setVisibleDelete] = useState(false);
    const [editable, setEditable] = useState(false);
    const [categoryRowData, setCategoryRowData] = useState("");
    const [categoryData, setCategoryData] = useState([]);

    const onHide = () => {
        setEditable(false);
        setVisibleEdit(false);
    }
    const getCategoryData = async () => {
        const res = await handleGetRequest("api/v1/category/all", false);
        if (res) {
            setCategoryData(res);
        }
    };
    useEffect(() => {
        getCategoryData();
    }, []);
    const RequestResetPassword = async () => {
        const data = {};
        data["categoryId"] = categoryRowData;
        const res = await dispatch(handleDeleteRequest(data, `api/v1/category/`, true, true));
        // setloading(false);
        if (res?.status === 200) {
            getCategoryData();
        }
    }
    useEffect(() => {
        if (visibleDelete === true) {
            RequestResetPassword();
        }
    }, [visibleDelete]);


    const actionTemplate = (rowData) => {
        return (
            <div className="Edit_Icon">
                <Button tooltip="Edit" icon="pi pi-pencil" tooltipOptions={{ position: "top" }} className="edit p-mr-2" onClick={() => editUsers(rowData)} />
                <Button tooltip="Delete" icon="pi pi-trash" tooltipOptions={{ position: "top" }} className="delete p-mr-2 p-ml-3" onClick={() => confirm2(rowData)} />
            </div>
        );
    };

    const editUsers = (rowData) => {
        setVisibleEdit(true);
        setEditable(true);
        setCategoryRowData(rowData._id);
    };
    const confirm2 = (rowData) => {
        setCategoryRowData(rowData._id);
        confirmDialog({
            message: 'Do you want to delete this record?',
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
        setVisibleEdit(false);
        // toast.current.show({ severity: 'info', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
    }
    const toast = useRef(null);
    return (
        <>
            <Toast ref={toast} />
            <Dialog header={editable ? "EDIT" : "ADD NEW CATEGORY"} visible={visibleEdit} style={{ width: '40vw' }} onHide={onHide}>
                <AddEditCategory getCategoryData={getCategoryData} editable={editable} onHide={onHide} categoryRowData={categoryRowData} />
            </Dialog>

            <div className="grid">
                <div className="col-12  md:col-12 lg:col-12 xl:col-12">
                    <div className="text-right">
                        <span className="p-input-icon-right mr-3">
                            <input type="text" placeholder="Search" onInput={(e) => setGlobalFilter(e.target.value)} className="p-inputtext p-component p-filled" />
                            <i className="pi pi-search"></i>
                        </span>
                        <button className="p-button p-button-primary p-component" onClick={() => setVisibleEdit(true)}>
                            <span className="p-button-icon p-c p-button-icon-left pi pi-plus"></span>
                            <span className="p-button-label p-c">Add New</span>
                            <span className="p-ink"></span>
                        </button>

                    </div>
                </div>
                <div className="col-12 md:col-12 lg:col-12 xl:col-12">
                    <div className="innr-Body">
                        <DataTable rows={7} paginator responsiveLayout="scroll" value={categoryData} globalFilter={globalFilter}>
                            {/* loading={loading}  */}

                            <Column field="_id" header="Category ID" sortable />
                            <Column field="name" header="Category Name" sortable />
                            {/* <Column body={RolesTemplate}  header="Category Name" /> */}
                            <Column field="description" header="Description" sortable />
                            <Column body={actionTemplate} header="Action" />
                        </DataTable>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CategoryManagement;
