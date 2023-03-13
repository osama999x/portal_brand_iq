import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { confirmDialog } from 'primereact/confirmdialog';
import { handleGetRequest } from '../../service/GetTemplate';
import { handleDeleteRequest } from '../../service/DeleteTemplete';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { baseURL } from '../../utilities/Config';
import AddEditCampaign from './AddEditCampaign';
import { useHistory } from "react-router-dom";
//import AddPromotion from './AddPromotion';
import PromotionManagement from './PromotionManagement';
const CampaignManagement = () => {

  //  const [rowDataId, setRowDataId] = useState();
    //const [campaignId, setCampaignID] = useState("");
    const [displayBasic, setDisplayBasic] = useState(false);
    const [campigndata, setCampigndata] = useState([]);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [addEditCampign, setAddEditCampign] = useState(null);
    const [campignRowData, setCampignRowData] = useState("");
    const [visibleDelete, setVisibleDelete] = useState(false);
    const [selectedDeleteId, setSelectedDeleteId] = useState('')
    
    // const [promotionRowData, setPromotionRowData] = useState("");
    const history = useHistory();

    const dispatch = useDispatch();

    const getCampigndata = async () => {
        const res = await handleGetRequest("api/v1/promotion/all", false);
        
        if (res) {
            setCampigndata(res);
        }
    };
    useEffect(() => {
        getCampigndata();
    }, []);
    useEffect(() => {
        if (visibleDelete === true) {
            
            deleteCampaign();
        }
    }, [visibleDelete]);

    const onHide = () => {
        setDisplayBasic(false);
        setAddEditCampign(false);
    }
    const actionTemplate = (rowData) => {

        return (
            <div className="Edit_Icon">
                <Button tooltip="Edit" icon="pi pi-pencil" tooltipOptions={{ position: "top" }} className="edit p-mr-2" onClick={() => editcampign(rowData)} />
                <Button tooltip="Delete" icon="pi pi-trash" tooltipOptions={{ position: "top" }} className="delete p-mr-2 p-ml-3" onClick={() => { confirm2(rowData) }} />
                <Button
                    tooltip=" Add Promotion"
                    icon="pi pi-arrow-circle-right"
                    tooltipOptions={{ position: "top" }}
                    className="promotion-button p-mr-2 p-ml-3"
                    style={{ color: "#1cb4b5", fontSize: "1rem" }}
                    onClick={() => forwardId(rowData)}
                />
            </div>
        );
    };

    //const a = "";
    const forwardId = (rowData) => {
        
        history.push("/managepromotion/" + rowData._id)
    }

    //================= Table body data=========//
    const deleteCampaign = async () => {
        const data = {};
        data["promotionId"] = selectedDeleteId;
        const res = await dispatch(handleDeleteRequest(data, `api/v1/promotion?promotionId=${selectedDeleteId}`, true, true));
        if (res?.status === 200) {
            getCampigndata();
            setVisibleDelete(false)
        }
        setSelectedDeleteId('')


    }
    
    


    const editcampign = (rowData) => {

        setDisplayBasic(true);
        setAddEditCampign(true);
        setCampignRowData(rowData._id);

    };
    const confirm2 = (rowData) => {
        //setCampignRowData(rowData._id);

        setSelectedDeleteId(rowData._id)
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

        setVisibleDelete(true);
    }

    const reject = () => {
        setVisibleDelete(false);
    }
    // const statusTemplate = (rowData) => {
    //     return <div className={rowData?.isActive === true ? "green" : "red"}>{rowData?.isActive === true ? "Active" : "InActive"}</div>;
    // };

    const fromDateTemplate = (rowData) => {
        return (
            <React.Fragment>
                {moment(rowData?.activeFrom).format("YYYY-MM-DD")}
            </React.Fragment>
        );
    };
    const toDateTemplate = (rowData) => {
        return (
            <React.Fragment>
                {moment(rowData?.activeTo).format("YYYY-MM-DD")}
            </React.Fragment>
        );
    };

    const imageTemplate = (rowData) => {
        return (
            <React.Fragment>
                {/* {rowData?.image} */}
                <img className='tbl__coupanImage' src={`${baseURL}${rowData.banner}`} alt="" />
            </React.Fragment>
        );
    };
    return (
        <>
            {/* <Toast ref={toast} /> */}
            <Dialog header={addEditCampign ? "Edit" : "CREATE CAMPAIGN"} visible={displayBasic} style={{ width: '40vw' }} onHide={onHide}>
                <AddEditCampaign
                    onHide={onHide}
                    getCampigndata={getCampigndata}
                    addEditCampign={addEditCampign}
                    campignRowData={campignRowData}


                />
            </Dialog>
            <Dialog>
                <PromotionManagement
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
                            value={campigndata}
                        // campignAgeistData={campignAgeistData}
                        >

                            <Column field="campaignName" header="Campaign Name" />
                            <Column body={imageTemplate} header="Banner" />
                            <Column field="description" header="Description" />
                            <Column body={fromDateTemplate} header="Active From" />
                            <Column body={toDateTemplate} header="Active To" />
                            <Column body={actionTemplate} header="Action" />
                        </DataTable>
                    </div>
                </div>
            </div>
        </>
    );
}
export default CampaignManagement;
