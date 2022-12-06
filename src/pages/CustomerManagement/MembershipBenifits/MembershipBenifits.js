import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import AddEdit from './AddEdit';
import { useDispatch } from 'react-redux';
import { handleGetRequest } from '../../../service/GetTemplate';
import { handleDeleteRequest } from '../../../service/DeleteTemplete';

const MembershipBenifits = () => {
    const [displayBasic, setDisplayBasic] = useState(false);
    const [addeditable, setAddEditable] = useState(false);
    const [benifitRowData, setBenifitRowData] = useState('center');
    const [globalFilter, setGlobalFilter] = useState(null);
    const [memberbenifitdata, setMemberBenifitdata] = useState([]);
    const [visibleDelete, setVisibleDelete] = useState(false);

    const dispatch = useDispatch();

    const getMemberBenifitdata = async () => {
        const res = await handleGetRequest("api/v1/membershipBenifit/all", false);
        if (res) {
            setMemberBenifitdata(res);
        }
    };
    useEffect(() => {
        getMemberBenifitdata();
    }, []);

    const onHide = () => {
        setDisplayBasic(false);
        setAddEditable(false);
    }
    //================= Table body data=========//

    const actionTemplate = (rowData) => {
        return (
            <div className="Edit_Icon">
                <Button tooltip="Edit" icon="pi pi-pencil" tooltipOptions={{ position: "top" }} className="edit p-mr-2" onClick={() => editpoints(rowData)} />
                <Button tooltip="Delete" icon="pi pi-trash" tooltipOptions={{ position: "top" }} className="delete p-mr-2 p-ml-3" onClick={() => { confirm2(rowData) }} />
            </div>
        );
    };


    const editpoints = (rowData) => {
        setDisplayBasic(true);
        setAddEditable(true);
        setBenifitRowData(rowData._id);
    };
    const RequestResetPassword = async () => {
        const data = {};
        data["membershipBenifitId"] = benifitRowData;
        const res = await dispatch(handleDeleteRequest(data, `api/v1/membershipBenifit`, true, true));
        if (res?.status === 200) {
            getMemberBenifitdata();
        }
    }
    useEffect(() => {
        RequestResetPassword();
        if (visibleDelete === true) {
            RequestResetPassword();
        }
    }, [visibleDelete]);

    const confirm2 = (rowData) => {
        setBenifitRowData(rowData._id);
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
    }

    const reject = () => {
        setVisibleDelete(false);
    }
    const membCategoryTemplate = (rowData) => {
        return (<div>{rowData?.membershipCategory?.membershipCategory}</div>)
    }
    const imageTemplate = (rowData) => {
        return (
            <React.Fragment>
                {/* {rowData?.image} */}
                <img className='tbl__coupanImage' src={`http://20.212.227.60:3007/${rowData.image}`} alt="" />
            </React.Fragment>
        );
    };

    const expireDateTemplate = (rowData) => {
        return (
            <React.Fragment>
                {rowData?.expireDate?.split('T')[0]}
            </React.Fragment>
        );
    };

    const toast = useRef(null);



    return (
        <>
            <Toast ref={toast} />
            <Dialog header={addeditable ? "EDIT" : "CREATE NEW BENIFITS"} visible={displayBasic} style={{ width: '40vw' }} onHide={onHide}>
                <AddEdit
                    onHide={onHide}
                    getMemberBenifitdata={getMemberBenifitdata}
                    addeditable={addeditable}
                    benifitRowData={benifitRowData}
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
                            value={memberbenifitdata}>
                            <Column body={imageTemplate} header="Image" />
                            <Column body={membCategoryTemplate} header="Membership Category" />
                            <Column field="label" header="Discount On Category" />
                            <Column body={expireDateTemplate} header="Expire Date" />
                            <Column field="description" header="Description" />
                            <Column body={actionTemplate} header="Action" />
                        </DataTable>
                    </div>
                </div>
            </div>
        </>
    );
}
export default MembershipBenifits;
