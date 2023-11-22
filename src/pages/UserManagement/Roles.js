import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { handleGetRequest } from '../../service/GetTemplate';
import { handleDeleteRequest } from '../../service/DeleteTemplete';
import { useDispatch } from "react-redux";
import AddEditRoles from './AddEditRoles';
import Edit from '../../assets/ICONS/icon_edit.png';
import Delete from '../../assets/ICONS/icon_delete.png';

const Roles = () => {
    const dispatch = useDispatch();
    const [visibleEdit, setVisibleEdit] = useState(false);
    const [visibleDelete, setVisibleDelete] = useState(false);
    const [editable, setEditable] = useState(false);
    const [usersRowData, setUsersRowData] = useState("");
    const [globalFilter, setGlobalFilter] = useState(null);
    const [displayBasic, setDisplayBasic] = useState(false);
    const [displayBasic2, setDisplayBasic2] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [position, setPosition] = useState('center');
    const [userData, setUserData] = useState([]);
    const [loading, setloading] = useState(false);
    var selectedDeleteId;
    const dialogFuncMap = {
        'displayBasic': setDisplayBasic,
        'displayBasic2': setDisplayBasic2,
        'deleteModal': setDeleteModal,
    }
    const onClick = (name, position) => {
        dialogFuncMap[`${name}`](true);

        if (position) {
            setPosition(position);
        }
    }

    const onHide = () => {
        setEditable(false);
        setVisibleEdit(false);
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
    const getRoleData = async () => {
        setloading(true);
        const res = await handleGetRequest("api/v1/role/all", false);
        if (res) {
            setUserData(res);
        }
        setloading(false);
    };

    useEffect(() => {
        getRoleData();
    }, []);

    const RequestResetPassword = async () => {
        // setloading(true);
        const data = {};
        data["roleId"] = selectedDeleteId;

        const res = await dispatch(handleDeleteRequest(data, `api/v1/role/`, true, true));
        if (res?.status === 200) {
            getRoleData();
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
                <Button tooltip="Edit" tooltipOptions={{ position: "top" }} className="edit p-mr-2" onClick={() => editUsers(rowData)} >
                    <img src={Edit} />
                </Button>
                <Button tooltip="Delete" tooltipOptions={{ position: "top" }} className="delete p-mr-2 p-ml-3" onClick={() => confirm2(rowData)} >
                    <img src={Delete} />
                </Button>
            </div>
        );
    };
    // const PermissionsTemplate = (rowData) => {
    //     const roles = rowData?.permissions;
    //     const rolesName = roles.map((name) => name?.name).toString();
    //     return <React.Fragment>{rolesName.replace(/,/g, ', ')}</React.Fragment>;

    // }

    const editUsers = (rowData) => {
        setVisibleEdit(true);
        setEditable(true);
        setUsersRowData(rowData._id);
    };
    const confirm2 = (rowData) => {
        selectedDeleteId = rowData._id;
        //setUsersRowData(rowData._id);
        confirmDialog({
            message: 'Are you sure you want to delete this item?',
            header: 'Delete Confirmation',
            icon: 'pi pi-trash',
            acceptClassName: 'Savebtn',
            rejectClassName: 'Cancelbtn',
            accept: () => RequestResetPassword(selectedDeleteId),
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

    }
    const toast = useRef(null);
    return (
        <>
            <Toast ref={toast} />
            <Dialog header={editable ? "Edit" : "Add New Role"} visible={visibleEdit} style={{ width: '40vw' }} onHide={() => onHide('displayBasic')}>
                <AddEditRoles getRoleData={getRoleData} editable={editable} onHide={onHide} UsersRowData={usersRowData} />

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
                        <DataTable
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Records"
                            globalFilter={globalFilter} rows={7} paginator responsiveLayout="scroll" value={userData}>
                            <Column field="name" header="User Role" />
                            <Column field="description" header="Description" style={{ width: '250px', height: '57px' }} />
                            <Column body={actionTemplate} header="Action" />
                        </DataTable>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Roles;
