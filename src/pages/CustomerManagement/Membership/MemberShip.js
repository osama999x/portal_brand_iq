import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { confirmDialog } from 'primereact/confirmdialog';
// import { Toast } from 'primereact/toast';
import AddEdit from './addedit';
import { handleGetRequest } from '../../../service/GetTemplate';
import { handleDeleteRequest } from '../../../service/DeleteTemplete';
import { useDispatch } from 'react-redux';

const MemberShip = () => {
  const dispatch = useDispatch();
  const [displayBasic, setDisplayBasic] = useState(false);
  const [membershipdata, setMembershipdata] = useState([]);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [addEditMember, setaddEditMember] = useState(null);
  const [MemberRowData, setMemberRowData] = useState("");
  const [visibleDelete, setVisibleDelete] = useState(false);
  var selectedDeleteId;
  const onHide = (name) => {
    setDisplayBasic(false);
  }
  //================= Table body data=========//

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
    setaddEditMember(true);
    setMemberRowData(rowData._id);
  };

  const getMembershipData = async () => {
    const res = await handleGetRequest("api/v1/membership/all", false);
    if (res) {
      setMembershipdata(res);
    }
  };
  useEffect(() => {
    getMembershipData();
  }, []);

  const RequestToDel = async () => {
    const data = {};
    data["membershipId"] = selectedDeleteId;

    const res = await dispatch(handleDeleteRequest(data, `api/v1/membership/`, false, false));
    if (res.status === 200) {
      getMembershipData();
    }

  }
  // useEffect(() => {
  //   if (visibleDelete === true) {
  //     RequestToDel();
  //   }

  // }, [visibleDelete]);

  const confirm2 = (rowData) => {
    // setMemberRowData(rowData._id);
    selectedDeleteId = rowData._id;
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
    RequestToDel();
    setVisibleDelete(true);
    // toast.current.show({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
  }

  const reject = () => {
    setVisibleDelete(false);
    // toast.current.show({ severity: 'info', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
  }
  return (
    <>
      <Dialog header={addEditMember ? "EDIT" : "ADD NEW MEMBERSHIP"} visible={displayBasic} style={{ width: '40vw' }} onHide={onHide}>
        <AddEdit
          onHide={onHide}
          getMembershipData={getMembershipData}
          addEditMember={addEditMember}
          MemberRowData={MemberRowData} />
      </Dialog>
      <div className="grid">
        <div className="col-12 md:col-12 lg:col-12 xs:col-12">
          <div className="text-right">
            <span class="p-input-icon-right mr-3">
              <input type="text" placeholder="Search" class="p-inputtext p-component p-filled" onInput={(e) => setGlobalFilter(e.target.value)} />
              <i class="pi pi-search"></i>
            </span>
            <button className="p-button p-button-primary p-component" onClick={() => {setDisplayBasic(true)
            setaddEditMember(false);
            }}>
              <span className="p-button-icon p-c p-button-icon-left pi pi-plus"></span>
              <span className="p-button-label p-c">Add New</span>
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
              value={membershipdata}>
              <Column field="membershipCategory" header="Membership Category" />
              <Column field="thresholdFrom" header="Threshold From" />
              <Column field="thresholdTo" header="Threshold To" />
              <Column body={actionTemplate} header="Action" />
            </DataTable>
          </div>
        </div>
      </div>
    </>
  );
}
export default MemberShip;
