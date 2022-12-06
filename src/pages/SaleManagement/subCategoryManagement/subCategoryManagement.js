import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import {handleGetRequest} from '../../../service/GetTemplate';
import { handleDeleteRequest } from '../../../service/DeleteTemplete';
import { useDispatch } from "react-redux";
import AddEditSubCategory from './AddEditSubCategory';
const SubCategoryManagement = () => {
    const dispatch = useDispatch();
    const [visibleEdit, setVisibleEdit] = useState(false);
    const [visibleDelete, setVisibleDelete] = useState(false);
    const [editable, setEditable] = useState(false);
    const [categoryRowData, setCategoryRowData] = useState("");
    const [subCategoryData, setSubCategoryData] = useState([]);
    const [loading,setloading] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
  

    const onHide = () => {
        setEditable(false);
        setVisibleEdit(false);
    }
    const onHideDeleteDialog = () => {
        setVisibleDelete(false);
    }
    const CategoryTemplete = (rowData) => {
        const category = rowData?.category;
        return <React.Fragment>{category?.name}</React.Fragment>;

    }
    
    const getSubCategoryData = async () => {   
        setloading(true);
        const res = await handleGetRequest("api/v1/subcategory/all",false);
        if (res) {
            setSubCategoryData(res);
        }
        setloading(false);
    };
    useEffect(() => {
         getSubCategoryData();
    }, []);
    const RequestResetPassword = async () => {
         setloading(true);
        const data = {};
        data["subcategoryId"] = categoryRowData;
       
        const res = await dispatch(handleDeleteRequest(data, `api/v1/subcategory/`,true ,true));
        setloading(false);
        if (res?.status === 200) {
            getSubCategoryData();
            // setloading(false); 
            // setSeverities("success")
            // setShowMessage('A password reset link has been sent to the user email address: "' + userEmailAddress+'"')

        }
        else { 
            // setloading(false); 
            // setSeverities("error")
            // setShowMessage('Please update user email address. "'+ userEmailAddress+'" is not registered ')
           
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
                <Button tooltip="Delete" icon="pi pi-trash" tooltipOptions={{ position: "top" }} className="delete p-mr-2 p-ml-3" onClick={() =>confirm2(rowData)} />
                {/* <Button tooltip="Delete" icon="pi pi-trash" tooltipOptions={{ position: "top" }} className="delete p-mr-2 p-ml-3" onClick={confirm2} /> */}
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
        setVisibleDelete(false);

        // toast.current.show({ severity: 'info', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
    }
    const toast = useRef(null);
    return (
        <>
            <Toast ref={toast} />
            <Dialog header = {editable ? "EDIT" : "ADD NEW SUB-CATEGORY"} visible={visibleEdit} style={{ width: '40vw' }}  onHide={onHide}>
            <AddEditSubCategory getSubCategoryData={getSubCategoryData} editable={editable} onHide={onHide} categoryRowData={categoryRowData} />
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
                        <DataTable globalFilter={globalFilter} rows={5} paginator responsiveLayout="scroll" value={subCategoryData}>
                         {/* loading={loading}  */}
                        
                            <Column field="_id" header="Sub-Category ID" sortable />
                            <Column field="name" header="Sub-Category Name" sortable />
                            <Column body={CategoryTemplete} header="CategoryName" sortable/>
                            <Column field="description" header="Description" sortable />
                            <Column body={actionTemplate} header="Action" />
                        </DataTable>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SubCategoryManagement;
