import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { handleGetRequest } from '../../service/GetTemplate';
// import { handlePostRequest } from '../../service/PostTemplate';
import { handleDeleteRequest } from '../../service/DeleteTemplete';
// import { handlePostRequest } from '../../service/DeleteTemplete';
import { useDispatch } from "react-redux";
import AddEditDeal from './AddEditDeal';
// import { toast } from "react-toastify";

const Tab1 = () => {
  const dispatch = useDispatch();
  const [visibleEdit, setVisibleEdit] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [editable, setEditable] = useState(false);
  const [usersRowData, setUsersRowData] = useState("");
  const [userData, setUserData] = useState([]);

  const onHide = () => {
    setEditable(false);
    setVisibleEdit(false);
  }
 
  const getUserData = async () => {
    // setloading(true);
    const res = await handleGetRequest("api/v1/dealsProduct/all", false);
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
    data["dealsId"] = usersRowData;

    const res = await dispatch(handleDeleteRequest(data, `api/v1/dealsProduct/`, false, false));
    // setloading(false);
    if (res?.status === 200) {
      getUserData();
    }
    else {

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
    setUsersRowData(rowData._id);
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

  const fromDateTemplate = (rowData) => {
    return (
      <React.Fragment>
        {rowData?.dealFrom?.split('T')[0]}
      </React.Fragment>
    );
  };
  const toDateTemplate = (rowData) => {
    return (
      <React.Fragment>
        {rowData?.dealTo?.split('T')[0]}
      </React.Fragment>
    );
  };

  const toast = useRef(null);
  return (
    <>
      <Toast ref={toast} />
      <Dialog header={editable ? "EDIT" : "ADD NEW DEAL"} visible={visibleEdit} style={{ width: '40vw' }} onHide={() => onHide('displayBasic')}>
        <AddEditDeal getUserData={getUserData} editable={editable} onHide={onHide} UsersRowData={usersRowData} />
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
            <DataTable globalFilter={globalFilter} rows={7} paginator responsiveLayout="scroll" value={userData}>
              <Column field="dealTitle" header="Deal Title" />
              <Column field="dealType" header="Deal Type" />
              <Column field="dealDescription" header="Description" />
              <Column field="buyDeal" header="Buy Deal" />
              <Column field="getDeal" header="Get Deal" />
              <Column body={fromDateTemplate} header="Deal From" />
              <Column body={toDateTemplate} header="Deal To" />
              <Column field="discount" header="Discount" />
              <Column body={actionTemplate} header="Action" />
            </DataTable>
          </div>
        </div>
      </div>
    </>
  );
}

export default Tab1;
