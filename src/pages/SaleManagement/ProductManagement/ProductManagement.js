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
import AddEditProduct from "./AddEditProduct"


const ProductManagement = () => {
    const dispatch = useDispatch();
    const [globalFilter, setGlobalFilter] = useState(null);
    const [visibleEdit, setVisibleEdit] = useState(false);
    const [visibleDelete, setVisibleDelete] = useState(false);
    const [editable, setEditable] = useState(false);
    const [productRowData, setProductRowData] = useState("");
    const [productData, setProductData] = useState([]);
    
    const [loading,setloading] = useState(false);
  

    const onHide = () => {
        setEditable(false);
        setVisibleEdit(false);
    }
    
    
    const getProductData = async () => {   
        setloading(true);
        const res = await handleGetRequest("api/v1/products/all",false);
        if (res) {
            setProductData(res);
        }
        setloading(false);
    };
    useEffect(() => {
         getProductData();
    }, []);
    const RequestResetPassword = async () => {
         setloading(true);
        let data = {};
        data["productId"] = productRowData;
       
        const res = await dispatch(handleDeleteRequest(data, `api/v1/products/`,true ,true));
        setloading(false);
        if (res?.status === 200) {
            getProductData();
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
        setProductRowData(rowData._id);
    };
    const confirm2 = (rowData) => {
        setProductRowData(rowData._id);
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

    const CategoryTemplete = (rowData) =>{
        const categoryName = rowData?.category?.name;
       
        return <React.Fragment>{categoryName}</React.Fragment>;
    }
    const SubCategoryTemplete = (rowData) => {
        const subcategoryName = rowData?.subcategory?.name;
        return <React.Fragment>{subcategoryName}</React.Fragment>;
    }
    const priceTemplete = (rowData) => {
        const variantPrice = rowData?.variant[0]?.actualPrice;
        return <React.Fragment>{variantPrice}</React.Fragment>;
    }
    const toast = useRef(null);
    return (
        <>
            <Toast ref={toast} />
            <Dialog header={editable ? "EDIT" : "ADD NEW PRODUCT"} visible={visibleEdit} style={{ width: '80vw' }}  onHide={onHide}>
            {/* <Add></Add> */}
            <AddEditProduct getProductData={getProductData} editable={editable} onHide={onHide} productRowData={productRowData} />
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
                        <DataTable globalFilter={globalFilter} rows={5} paginator responsiveLayout="scroll" value={productData}>
                         {/* loading={loading}  */}
                         
                            <Column field="_id" header="Product ID"  sortable/>
                            <Column field="name"  header="Product Name" sortable/>
                            <Column body={CategoryTemplete}  header="Category" sortable />
                            <Column body={SubCategoryTemplete}  header="Sub-Category" sortable />
                            <Column body={priceTemplete}  header="Price" sortable />
                            <Column body={actionTemplate} header="Action"/>
                        </DataTable>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProductManagement;
