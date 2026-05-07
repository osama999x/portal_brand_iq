import React, { useState, useEffect } from 'react';
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
import { FilterMatchMode } from 'primereact/api';
import Edit from '../../../src/assets/ICONS/icon_edit.png'
import Delete from '../../../src/assets/ICONS/icon_delete.png'
// import { toast } from "react-toastify";

const Tab1 = () => {
    const dispatch = useDispatch();
    const [visibleEdit, setVisibleEdit] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [visibleDelete, setVisibleDelete] = useState(false);
    const [editable, setEditable] = useState(false);
    const [usersRowData, setUsersRowData] = useState("");
    const [userData, setUserData] = useState([]);
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

        const res = await dispatch(handleDeleteRequest(data, `api/v1/user/`, true, true));
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
                <Button tooltip="Edit" tooltipOptions={{ position: "top" }} className="edit" onClick={() => editUsers(rowData)}>
                    <img src={Edit} />
                </Button>
                <Button tooltip="Delete" tooltipOptions={{ position: "top" }} className="delete" onClick={() => confirm2(rowData)} >
                    <img src={Delete} />
                </Button>
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
        selectedDeleteId = rowData._id;
        confirmDialog({
            message: 'Are you sure you want to delete this user?',
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
            <Dialog header={editable ? "Edit" : "Add New User"} visible={visibleEdit} style={{ width: '40vw' }} onHide={() => onHide('displayBasic')}>
                <AddEditUsers getUserData={getUserData} editable={editable} onHide={onHide} UsersRowData={usersRowData} />
            </Dialog>

            <div className="grid">
                <div className="col-12  md:col-12 lg:col-12 xl:col-12">
                    <div className="user-mgmt-toolbar">
                        <div className="user-mgmt-toolbar__title">
                            <h4 className="m-0">Users</h4>
                            <small className="text-600">Create, edit, and manage admin users</small>
                        </div>

                        <div className="user-mgmt-toolbar__actions">
                            <span className="p-input-icon-right mr-3 user-mgmt-toolbar__search">
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    onChange={onGlobalFilterChange}
                                    value={globalFilterValue}
                                    className="p-inputtext p-component p-filled"
                                />
                                <i className="pi pi-search"></i>
                            </span>
                            <Button
                                type="button"
                                label="Add New"
                                icon="pi pi-plus"
                                className="Savebtn"
                                onClick={() => setVisibleEdit(true)}
                            />
                        </div>
                    </div>
                </div>
                <div className="col-12 md:col-12 lg:col-12 xl:col-12">
                    <div className="innr-Body">
                        <DataTable
                            globalFilter={globalFilter}
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Records"
                            rows={7}
                            paginator
                            //rowsPerPageOptions={[10, 25, 50, 100]}
                            responsiveLayout="scroll"

                            value={userData}
                            filters={filters}
                            globalFilterFields={["role.name", "name"]}>
                            <Column field="name" header="Name" />
                            <Column body={RolesTemplate} field="role.name" header="User Role" />
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
