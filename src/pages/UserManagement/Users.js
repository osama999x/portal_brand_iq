import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { confirmDialog } from 'primereact/confirmdialog';
//import { Toast } from 'primereact/toast';
import { handleGetRequest } from '../../service/GetTemplate';
// import { handlePostRequest } from '../../service/PostTemplate';
import { handleDeleteRequest } from '../../service/DeleteTemplete';
// import { handlePostRequest } from '../../service/DeleteTemplete';
import { useDispatch } from "react-redux";
import AddEditUsers from './AddEditUsers';
// import { toast } from "react-toastify";

const Tab1 = () => {
    const dispatch = useDispatch();
    const [visibleEdit, setVisibleEdit] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [visibleDelete, setVisibleDelete] = useState(false);
    const [editable, setEditable] = useState(false);
    const [usersRowData, setUsersRowData] = useState("");
    const [userData, setUserData] = useState([]);
    var selectedDeleteId;


    const onHide = () => {
        setEditable(false);
        setVisibleEdit(false);
    }
    const RolesTemplate = (rowData) => {
        const permissions = rowData?.role;
        return <React.Fragment>{permissions?.name}</React.Fragment>;

    }
    const getUserData = async () => {
        // setloading(true);
        const res = await handleGetRequest("api/v1/user/all", false);
        if (res) {
            setUserData(res);
        }
        // setloading(false);
    };
    useEffect(() => {
        getUserData();
    }, []);

    const RequestResetPassword = async () => {
        //  setloading(true);
        const data = {};
        data["userId"] = selectedDeleteId;

        const res = await dispatch(handleDeleteRequest(data, `api/v1/user/`, false, false));
        // setloading(false);
        if (res?.status === 200) {
            getUserData();
        }
        else {
           
        }

    }
    // useEffect(() => {
    //     if (visibleDelete === true) {
    //         RequestResetPassword();
    //     }

    // }, [visibleDelete]);


    const actionTemplate = (rowData) => {
        return (
            <div className="Edit_Icon">
                <Button tooltip="Edit" icon="pi pi-pencil" tooltipOptions={{ position: "top" }} className="edit p-mr-2" onClick={() => editUsers(rowData)} />
                <Button tooltip="Delete" icon="pi pi-trash" tooltipOptions={{ position: "top" }} className="delete p-mr-2 p-ml-3" onClick={() => confirm2(rowData)} />
                {/* <Button tooltip="Delete" icon="pi pi-trash" tooltipOptions={{ position: "top" }} className="delete p-mr-2 p-ml-3" onClick={confirm2} /> */}
            </div>
        );
    };
    
    const editUsers = (rowData) => {
        setVisibleEdit(true);
        setEditable(true);
        setUsersRowData(rowData._id);
    };
    const confirm2 = (rowData) => {
        // setUsersRowData(rowData._id);
        selectedDeleteId=rowData._id;
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
        RequestResetPassword();
        setVisibleDelete(true);
        // toast.current.show({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
    }

    const reject = () => {
        setVisibleDelete(false);
        // toast.current.show({ severity: 'info', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
    }
    //const toast = useRef(null);
    return (
        <>
            {/* <Toast ref={toast} /> */}
            <Dialog header={editable ? "EDIT" : "ADD NEW USER"} visible={visibleEdit} style={{ width: '40vw' }} onHide={() => onHide('displayBasic')}>
                <AddEditUsers getUserData={getUserData} editable={editable} onHide={onHide} UsersRowData={usersRowData} />
            </Dialog>

            <div className="grid">
                <div className="col-12  md:col-12 lg:col-12 xl:col-12">
                    <div className="text-right">
                        <span className="p-input-icon-right mr-3">
                            <input type="text" placeholder="Search" onInput={(e) => setGlobalFilter(e.target.value)} className="p-inputtext p-component p-filled    " />
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
                        <DataTable globalFilter={globalFilter} rows={7} paginator responsiveLayout="scroll" value={userData}>
                            <Column field="name" header="Name" />
                            <Column body={RolesTemplate} header="Role" />
                            <Column field="email" header="Email" />
                            <Column field="contact" header="Contact Number" />
                            <Column body={actionTemplate} header="Action" />
                        </DataTable>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Tab1;
