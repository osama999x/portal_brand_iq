import React, { useState, useEffect} from 'react';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { confirmDialog } from 'primereact/confirmdialog';
import Addedit from './Addedit';
import { handleGetRequest } from '../../../service/GetTemplate';
import { handleDeleteRequest } from '../../../service/DeleteTemplete';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { baseURL } from '../../../utilities/Config';

const CoupanPolicy = () => {
  const [displayBasic, setDisplayBasic] = useState(false);
  const [coupandata, setCoupandata] = useState([]);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [addEditCoupan, setAddEditCoupan] = useState(null);
  const [coupanRowData, setCoupanRowData] = useState("");
  const [visibleDelete, setVisibleDelete] = useState(false);
  var selectedDeleteId;
  const dispatch = useDispatch();

  const getCoupandata = async () => {
    const res = await handleGetRequest("api/v1/coupon/all", false);
    
    if (res) {
      setCoupandata(res);
    }
  };
  useEffect(() => {
    getCoupandata();
  }, []);

  const onHide = () => {
    setDisplayBasic(false);
    setAddEditCoupan(false);
  }
  const actionTemplate = (rowData) => {
    return (
      <div className="Edit_Icon">
        <Button tooltip="Edit" icon="pi pi-pencil" tooltipOptions={{ position: "top" }} className="edit p-mr-2" onClick={() => editcoupan(rowData)} />
        <Button tooltip="Delete" icon="pi pi-trash" tooltipOptions={{ position: "top" }} className="delete p-mr-2 p-ml-3" onClick={() => { confirm2(rowData) }} />
      </div>
    );
  };

  //================= Table body data=========//
  const RequestResetPassword = async () => {
    const data = {};
    data["couponId"] = selectedDeleteId;
    const res = await dispatch(handleDeleteRequest(data, `api/v1/coupon`, true, true));
    if (res?.status === 200) {
     getCoupandata();
    }
    
  }
  // useEffect(() => {
  //   if (visibleDelete === true) {
  //     RequestResetPassword();
  //   }
  // }, [visibleDelete]);


  const editcoupan = (rowData) => {
    setDisplayBasic(true);
    setAddEditCoupan(true);
    setCoupanRowData(rowData._id);
    
  };
  const confirm2 = (rowData) => {
    // setCoupanRowData(rowData._id);
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
    RequestResetPassword();
    setVisibleDelete(true);
  }

  const reject = () => {
    setVisibleDelete(false);
  }
  const statusTemplate = (rowData) => { 
    return <div className={rowData?.isActive === true ? "green" : "red"}>{rowData?.isActive === true ? "Active" : "InActive"}</div>;
  };

  const fromDateTemplate = (rowData) => {
    return (
      <React.Fragment>
       {moment(rowData?.expireDate).format("YYYY-MM-DD")}
      </React.Fragment>
    );
  };
  
  const imageTemplate = (rowData) => {
    return (
      <React.Fragment>
        {/* {rowData?.image} */}
        <img className='tbl__coupanImage' src={`${baseURL}${rowData.image}`} alt="" />
      </React.Fragment>
    );
  };
  return (
    <>
      {/* <Toast ref={toast} /> */}
      <Dialog header={addEditCoupan ? "Edit" :  "Create Coupon Policy"} visible={displayBasic} style={{ width: '40vw' }} onHide={onHide}>
        <Addedit
          onHide={onHide}
          getCoupandata={getCoupandata}
          addEditCoupan={addEditCoupan}
          coupanRowData={coupanRowData}
        />
      </Dialog>

      <div className="grid">
        <div className="col-12 md:col-12 lg:col-12 xs:col-12">
          <div className="text-right">
            <span class="p-input-icon-right mr-3">
              <input type="text" placeholder="Search" class="p-inputtext p-component p-filled" onInput={(e) => setGlobalFilter(e.target.value)} />
              <i class="pi pi-search"></i>
            </span>
            <button className="p-button p-button-primary p-component" onClick={() => setDisplayBasic(true)}>
              <span className="p-button-icon p-c p-button-icon-left pi pi-plus"></span>
              <span className="p-button-label p-c">Create</span>
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
              value={coupandata}
            >
              <Column field="couponCode" header="Coupon Code" />
              <Column body={imageTemplate} header="Voucher" />
              <Column body={fromDateTemplate} header="Expire Data" />
              <Column field="orderPriceLimit" header="Order Price Limit"/>
              <Column field="couponValue" header="Coupon Value" />
              {/* <Column body={statusTemplate} header="Status" /> */}
              <Column body={actionTemplate} header="Action" />
            </DataTable>
          </div>
        </div>
      </div>
    </>
  );
}
export default CoupanPolicy;
