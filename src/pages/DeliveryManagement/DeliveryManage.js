import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { confirmDialog } from 'primereact/confirmdialog';
 import { Toast } from 'primereact/toast';
// import { useHistory } from 'react-router-dom';
import AddEditDelivery from './DeliverySubmenu/AddEditDelivery';
import { Dialog } from 'primereact/dialog';
import { handleGetRequest } from '../../service/GetTemplate';
import { useDispatch } from 'react-redux';
import { handleDeleteRequest } from '../../service/DeleteTemplete';

const DeliveryManage = () => {


    const dispatch = useDispatch();
    const [displayBasic, setDisplayBasic] = useState(false);
    const [editable, setEditable] = useState(false);
    const [deliveryData, setDeliveryData] = useState([]);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [deliveryRowData, setDeliveryRowData] = useState("");
    const [visibleDelete, setVisibleDelete] = useState(false);

    const onHide = () => {
        setDisplayBasic(false);
        setEditable(false);
        // setVisibleEdit(false);
    }
    const actionTemplate = (rowData) => {
        return (
            <div className="Edit_Icon">
                <Button tooltip="Edit" icon="pi pi-pencil" tooltipOptions={{ position: "top" }} className="edit p-mr-2" onClick={() => edituser(rowData)} />
                <Button tooltip="Delete" icon="pi pi-trash" tooltipOptions={{ position: "top" }} className="delete p-mr-2 p-ml-3" onClick={confirm2} />
            </div>
        );
    };
    const edituser = (rowData) => {
        setDisplayBasic(true);
        setEditable(true);
        setDeliveryRowData(rowData._id);

    };
    const confirm2 = () => {
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
        //     toast.current.show({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
    }

    const reject = () => {
        setVisibleDelete(false);
        //     toast.current.show({ severity: 'info', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
    }
    // const toast = useRef(null);

    // const history = useHistory();
    // const Edit = useHistory();

    const getDeliveryData = async () => {
        //  setloading(true);
        const res = await handleGetRequest("api/v1/deliverypartner/all", false);
      if (res) {
            setDeliveryData(res);
        }
    };
    useEffect(() => {
        ; getDeliveryData();
    }, []);

    const DeleteData = async () => {
        //  setloading(true);
        const data = {};
        data["deliveryPartnerId"] = deliveryRowData;

        const res = await dispatch(handleDeleteRequest(data, `api/v1/deliverypartner`, false, false));
        // setloading(false);
        if (res.status === 200) {
            getDeliveryData();
        }

    }
    useEffect(() => {
        if (visibleDelete === true) {
            DeleteData();
        }

    }, [visibleDelete]);

    // const user = [

    //     { PartnerID: "111", PartnerName: "Awan Zubair", ContactNumber: "0300xxxxxx", }
    // ]    


    const organizationNameTemplate = (rowData) => {

        return <div>{rowData.organization.organizationName}</div>;

    }

    const contactNumberTemplate = (rowData) => {
        return <div>{rowData.organization.contactNumber}</div>
    }

    const cityTemplate = (rowData) => {
        return <div>{rowData.organization.city}</div>
    }
  
    const mailingadresTemplate = (rowData) => {
        return <div>{rowData.organization.mailingAdress}</div>
    }
    const websiteTemplate = (rowData) => {
        return <div>{rowData.organization.website}</div>
    }
    const OrderTrackingTemplate = (rowData) => {
        return <div>{rowData.organization.orderTrackingLink}</div>
    }

    const nameTemplate = (rowData) => {
        return <div>{rowData.organizationHead.name}</div>
    }

    const fatherNameTemplate = (rowData) => {
        return <div>{rowData.organizationHead.fatherName}</div>
    }
    const cnicTemplate = (rowData) => {
        return <div>{rowData.organizationHead.cnic}</div>
    }
    const HeadContantTemplate = (rowData) => {
        return <div>{rowData.organizationHead.contactNumber}</div>
    }
    const imageTemplate = (rowData) => {
        return <div><img className="Delivery_imgtbl"  src={`http://20.212.227.60:3007/${rowData.organizationHead.image}`} alt="" /></div>
    }
    const representativeNameTemplate = (rowData) => {
        return <div>{rowData.organizationRepresentative.name}</div>
    }
    const representativefNameTemplate = (rowData) => {
        return <div>{rowData.organizationRepresentative.fatherName}</div>
    }
    const representativeCnicTemplate = (rowData) => {
        return <div>{rowData.organizationRepresentative.cnic}</div>
    }
    const representativeContantTemplate = (rowData) => {
        return <div>{rowData.organizationRepresentative.contactNumber}</div>
    }
    const representativeimageTemplate = (rowData) => {
        return <div><img className="Delivery_imgtbl" src={`http://20.212.227.60:3007/${rowData.organizationRepresentative.image}`} alt="" /></div>
    }

    const toast = useRef(null);
    return (
        <>
             <Toast ref={toast} /> 
            <Dialog header={editable ? "EDIT" : "CREATE NEW DELIVERY PARTNER"} visible={displayBasic} style={{ width: '80vw' }} 
                onHide={onHide}
            // onHide={() => onHide('displayBasic')}
            >
                <AddEditDelivery
                    onHide={onHide}
                    getDeliveryData={getDeliveryData}
                    editable={editable}
                    deliveryRowData={deliveryRowData}
                />
            </Dialog>

            <div className="grid">
                <div className="col-12 md:col-12 lg:col-12 xs:col-12">
                    <div className="text-right">
                        <span class="p-input-icon-right mr-3">
                            <input type="text" placeholder="Search" onInput={(e) => setGlobalFilter(e.target.value)} class="p-inputtext p-component p-filled" />
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
                        <DataTable rows={5} paginator responsiveLayout="scroll" value={deliveryData} globalFilter={globalFilter}>
                            {/* <Column field="_id" header="Organization ID" /> */}
                            <Column body={organizationNameTemplate} header="Organization Name" />
                            <Column body={cityTemplate} header="City" />
                            <Column body={mailingadresTemplate} header="Mailing Address" />
                            <Column field={contactNumberTemplate} header="Contact Number" />
                            <Column field={websiteTemplate} header="Website" />
                            <Column field={OrderTrackingTemplate} header="Order Tracking Link" />
                            <Column field={nameTemplate} header="Head Name" />
                            <Column field={fatherNameTemplate} header="Head SO/WO/DO" />
                            <Column field={cnicTemplate} header="Head CNIC" />
                            <Column field={HeadContantTemplate} header="Head Mobile Number" />
                            <Column field={imageTemplate} header="Head Picture" />
                            <Column field={representativeNameTemplate} header="Representative Name" />
                            <Column field={representativefNameTemplate} header="Representatives SO/WO/DO" />
                            <Column field={representativeCnicTemplate} header="Representatives CNIC" />
                            <Column field={representativeContantTemplate} header="Representatives Mobile Number" />
                            <Column field={representativeimageTemplate} header="Representatives Picture" />
                            <Column body={actionTemplate} header="Action" />
                        </DataTable>
                    </div>
                </div>
            </div>
        </>
    );
}


export default DeliveryManage;

