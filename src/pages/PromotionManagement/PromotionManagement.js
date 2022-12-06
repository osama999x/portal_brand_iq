import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import Moment from "moment";
import { useDispatch } from "react-redux";
import AddEditPromtions from "./AddEditPromtion";
import { handleGetRequest } from "../../service/GetTemplate";
import { handleDeleteRequest } from "../../service/DeleteTemplete";
import { useHistory } from "react-router-dom";
import Edit from "../TaxesManagement/Edit";

const PromotionManagemant = () => {
    const dispatch = useDispatch();
    const [globalFilter, setGlobalFilter] = useState("");
    // const [loading, setLoading] = useState();
    // const [displayBasic, setDisplayBasic] = useState(false);
    const [promotions, setPromotions] = useState([]);
    const [displayBasic2, setDisplayBasic2] = useState(false);
    const [positionDetails, setPositionDetails] = useState();
    const [promotionRowData, setPromotionRowData] = useState();
    const dt = useRef(null);
    const history = useHistory();

    const dialogFuncMap = {
        // displayBasic: setDisplayBasic,
        displayBasic2: setDisplayBasic2,
    };


    const onHide = (name) => {
        dialogFuncMap[`${name}`](false);
    };
    const renderFooter = (name) => {
        return (
            <div className="grid">
                <div className="col-12 text-center">
                    <Button label="Cancel" onClick={() => onHide(name)} className="Cancelbtn p-mr-3" />
                    <Button label="Save" onClick={() => onHide(name)} autoFocus className="Savebtn" />
                </div>
            </div>
        );
    };

    // get all
    const getPromotions = async () => {
        // setLoading(true);
        const res = await handleGetRequest("api/v1/mpromotion/all", false);
        // console.log("Promotion Get ALL API",res);
        if (res) {
            setPromotions(res);
            setPositionDetails(res?.promotion);
        }
        // setLoading(false);
    };

    useEffect(() => {
        getPromotions();
        handleDeletePromtion();
    }, []);

    //================= get all data END=========//

    const actionTemplate = (rowData) => {
        return (
            <div className="Edit_Icon">
                <Button tooltip="Edit" icon="pi pi-pencil" tooltipOptions={{ position: "top" }} className="edit p-mr-2" onClick={() => history.push(`./promotiondetail?promotionid=${rowData._id}`)} />
                {/* <Button tooltip="Edit" icon="pi pi-pencil" tooltipOptions={{ position: "top" }} className="edit p-mr-2"  /> */}
                <Button
                    tooltip="Delete"
                    icon="pi pi-trash"
                    tooltipOptions={{ position: "top" }}
                    className="delete p-mr-2 p-ml-3"
                    onClick={() => {
                        setPromotionRowData(rowData._id);
                        confirm2(rowData._id);
                    }}
                />
            </div>
        );
    };
    let storedId = '';
    const confirm2 = (rowData) => {
        storedId = rowData;
        // setPromotionRowData(rowData?._id);
        confirmDialog({
            message: "Do you want to delete this record?",
            header: "DELETE",
            icon: "pi pi-trash",
            acceptClassName: "Savebtn",
            rejectClassName: "Cancelbtn",
            accept,
            reject,
        });
    };
    const accept = () => {
        handleDeletePromtion();
        // toast.current.show({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
    };

    const reject = () => {
        // toast.current.show({ severity: 'info', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
    };
    const toast = useRef(null);

    const handleDeletePromtion = async () => {
        // setLoading(true);
        const data = {};
        // console.log(promotionRowData);
        //data["promotionId"] = storedId;
        const res = await dispatch(handleDeleteRequest(data, `api/v1/mPromotion/`, true, true));
        // setLoading(false);
        if (res?.status === 200) {
            getPromotions();
            // setloading(false);
            // setSeverities("success")
            // setShowMessage('A password reset link has been sent to the user email address: "' + userEmailAddress+'"')
        } else {
            // setloading(false);
            // setSeverities("error")
            // setShowMessage('Please update user email address. "'+ userEmailAddress+'" is not registered ')
        }
    };
   

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    const promotionStartTemplete = (rowData) => {
        return (
            <>
                {(rowData?.promotion).map((promtion, i) => {
                    return (
                        <React.Fragment key={i}>
                            <div>{Moment(promtion?.launchDate).format("MMM DD, YYYY h:mm a")}</div>
                        </React.Fragment>
                    );
                })}
            </>
        );
    };
    const promtionEndTemplete = (rowData) => {
        return (
            <>
                {(rowData?.promotion).map((promtion, i) => {
                    return (
                        <React.Fragment key={i}>
                            <div>{Moment(promtion?.endDate).format("MMM DD, YYYY h:mm a")}</div>
                        </React.Fragment>
                    );
                })}
            </>
        );
    };
    const promtionStatusTemplete = (rowData) => {
        // return <div className={rowData?.promotion?.status === "active" ? "green" : "red"}>{rowData?.promotion?.status=== "active" ? "Active" : "InActive"}</div>;
        return (
            <>
                {(rowData?.promotion).map((promtion, i) => {
                    const status = capitalizeFirstLetter(promtion?.status);
                    return (
                        <React.Fragment key={i}>
                            <div className={`${status}`}>{status}</div>
                        </React.Fragment>
                    );
                })}
            </>
        );
    };
  
    const rowExpansionTemplate = (data) => {
        return <div className="orders-subtable">{/* <Comments commentsData={data?.commentsQueryResponses} /> */}</div>;
    };
    return (
        <>
            <Toast ref={toast} />

            <Dialog header={Edit ? "EDIT" : "ADD NEW PROMOTION"} visible={displayBasic2} style={{ width: "60vw" }} footer={renderFooter("displayBasic2")} onHide={() => onHide("displayBasic2")}>
                <AddEditPromtions  />
                {/* <Edit /> */}
            </Dialog>

            <div className="grid">
                <div className="col-12 md:col-12 lg:col-12 xl:col-12">
                    <div className="text-right">
                        <span className="p-input-icon-right mr-3">
                            <input type="text" placeholder="Search" onInput={(e) => setGlobalFilter(e.target.value)} className="p-inputtext p-component p-filled" />
                            <i className="pi pi-search"></i>
                        </span>
                        <button className="p-button p-button-primary p-component" onClick={() => history.push("/promotiondetail")}>
                            <span className="p-button-icon p-c p-button-icon-left pi pi-plus"></span>
                            <span className="p-button-label p-c">Create</span>
                            <span className="p-ink"></span>
                        </button>
                    </div>
                </div>
                <div className="col-12 md:col-12 lg:col-12 xl:col-12">
                    <div className="innr-Body">
                        <DataTable ref={dt} stripedRows rows={7} paginator responsiveLayout="scroll" value={promotions} globalFilter={globalFilter} rowExpansionTemplate={rowExpansionTemplate}>
                            {/* loading={loading} */}
                            <Column field="_id" header="Campaign ID" sortable />
                            <Column field="campaignName" header="Campaign Name" sortable />
                            <Column body={promotionStartTemplete} header="From Date" sortable />
                            <Column body={promtionEndTemplete} header="To Date" sortable />
                            <Column body={promtionStatusTemplete} header="Status" sortable />
                            <Column body={actionTemplate} header="Action" />
                        </DataTable>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PromotionManagemant;
