import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
// import FeedbackModal from './FeedbackSubmenu/FeedbackModal';
import { handleGetRequest } from '../../service/GetTemplate';
import { Rating } from 'primereact/rating';

const Index = () => {
    const [globalFilter, setGlobalFilter] = useState(null);
    const [feedback, setFeedback] = useState([]);
    //const [loading, setloading] = useState(false);
    const [visibleEdit, setVisibleEdit] = useState(false);
    //const [editable, setEditable] = useState(false);
    //const [customerRowData, setCustomerRowData] = useState("");
    const data = [
        { channel: 0 },
        { channel: 1 },
    ];
    const renderChannel = (rowData) => {
        const channelValue = rowData.channel;

        if (channelValue === 0) {
            return 'WEBSITE';
        } else if (channelValue === 1) {
            return 'ANDROID APP';
        } else {
            return null; // Handle other cases if needed
        }
    };


    const renderFooter = (name, canDel) => {
        return (
            <div className="grid">
                <div className="col-12 text-center">
                    {/* <Button label="Cancel" onClick={() => onHide(name)} className="Cancelbtn p-mr-3" /> */}
                    <Button label="Cancel" onClick={() => onHide(name)} autoFocus className="Savebtn" />

                </div>
            </div>
        );
    };
    const getFeedbackData = async () => {
        //  setloading(true);
        const res = await handleGetRequest("api/v1/feedback/all", false);

        if (res) {
            setFeedback(res);


        }
        //setloading(false);
    };
    useEffect(() => {
        getFeedbackData();
    }, []);

    // const actionTemplate = (rowData) => {
    //     return (
    //         <div className="Edit_Icon">
    //             <Button tooltip="Details" icon="pi pi-eye" tooltipOptions={{ position: "top" }} className="edit p-mr-2" onClick={() => editUsers(rowData)} />
    //         </div>
    //     );
    // };
    // const editUsers = (rowData) => {
    //     setVisibleEdit(true);
    //   //  setEditable(true);
    //     setCustomerRowData(rowData.customerId._id);
    // };
    const onHide = () => {
        //setEditable(false);
        setVisibleEdit(false);
    }
    const customerNameTemplete = (rowData) => {
        let customerName = "";
        if (rowData?.customerId?.firstName) {
            customerName = rowData?.customerId?.firstName + " " + rowData?.customerId?.lastName;
            return (
                <span>{customerName}</span>
            )
        }
    };
    const contactTemplate = (rowData) => {
        let customerContact = "";
        if (rowData?.customerId?.contact) {
            customerContact = rowData?.customerId?.contact;
            return (
                <span>{customerContact}</span>
            )
        }
    };
    const ratingTemplate = (rowData) => {
        return <div><Rating value={rowData?.rating} readOnly stars={5} cancel={false} /></div>;
    }


    return (
        <div>
            <Dialog header="Details" visible={visibleEdit} style={{ width: '40vw' }} footer={renderFooter('visibleEdit')} onHide={onHide}>
                {/* <FeedbackModal editable={editable} onHide={onHide} categoryRowData={customerRowData} getFeedbackData={getFeedbackData}/> */}
            </Dialog>

            <div className="grid">
                <div className="col-12">
                    <div className="text-right flex float_right">
                        <div className="">
                            <span class="p-input-icon-right mr-3">
                                <input type="text" placeholder="Search" class="p-inputtext p-component p-filled" onInput={(e) => setGlobalFilter(e.target.value)} />
                                <i class="pi pi-search"></i>
                            </span>
                        </div>

                    </div>
                </div>
                <div className="col-12">
                    <div className="innr-Body">
                        <DataTable
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Records"
                            globalFilter={globalFilter}
                            rows={7}
                            paginator
                            responsiveLayout="scroll"
                            value={feedback}
                        >
                            <Column body={customerNameTemplete} header="Customer's Name" />
                            {/* <Column field="MembershipCategory" header="Membership Category" /> */}
                            <Column body={contactTemplate} header="Contact Number" />
                            <Column field="channel" header="Channel" body={renderChannel} />
                            <Column field="comments" header="Comments" />
                            <Column body={ratingTemplate} header="Rating" />
                            {/* <Column body={actionTemplate} header="Action" /> */}
                        </DataTable>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Index

