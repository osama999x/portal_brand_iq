import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { confirmDialog } from 'primereact/confirmdialog';
import { handleGetRequest } from '../../service/GetTemplate';
import { handleDeleteRequest } from '../../service/DeleteTemplete';
import { useDispatch } from 'react-redux';
//import { baseURL } from '../../utilities/Config';
import AddPromotion from './AddPromotion';
import { useHistory, useParams } from "react-router-dom";
import Edit from '../../assets/ICONS/icon_edit.png';
import Delete from '../../assets/ICONS/icon_delete.png';
const PromotionManagement = () => {

    const [displayBasic, setDisplayBasic] = useState(false);
    const [promotiondata, setPromotiondata] = useState([]);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [addEditPromotion, setAddEditPromotion] = useState(null);
    const [promotionRowData, setPromotionRowData] = useState("");
    const [visibleDelete, setVisibleDelete] = useState(false);
    const [selectedDeleteId, setSelectedDeleteId] = useState('')
    const history = useHistory();

    const dispatch = useDispatch();
    const params = useParams();
    const { id } = params;


    const getPromotiondata = async () => {
        const res = await handleGetRequest(`api/v1/promotion/getOne?campaignId=${id}`, false);


        if (res) {
            setPromotiondata(res);
        }
    };
    useEffect(() => {
        getPromotiondata();
    }, []);

    useEffect(() => {
        if (visibleDelete === true) {

            deletePromotion();
        }
    }, [visibleDelete]);

    const onHide = () => {
        setDisplayBasic(false);
        setAddEditPromotion(false);
    }
    const actionTemplate = (rowData) => {
        return (
            <div className="Edit_Icon">
                <Button tooltip="Edit" tooltipOptions={{ position: "top" }} className="edit p-mr-2" onClick={() => editpromotion(rowData)} >
                    <img src={Edit} />
                </Button>
                <Button tooltip="Delete" tooltipOptions={{ position: "top" }} className="delete p-mr-2 p-ml-3" onClick={() => { confirm2(rowData) }} >
                    <img src={Delete} />
                </Button>
            </div>
        );
    };

    //================= Table body data=========//
    const deletePromotion = async () => {
        const data = {};
        data["promotionId"] = selectedDeleteId;

        const res = await dispatch(handleDeleteRequest(data, `api/v1/promotion/deletePromotion?promotionId=${selectedDeleteId}`, true, true));
        if (res?.status === 200) {
            getPromotiondata();
            setVisibleDelete(false)
        }
        setSelectedDeleteId('')

    }



    const editpromotion = (rowData) => {
        setDisplayBasic(true);
        setAddEditPromotion(true);
        setPromotionRowData(rowData._id);

    };
    const confirm2 = (rowData) => {

        //setPromotionRowData(rowData._id);
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
        // RequestResetPassword();
        setVisibleDelete(true);
    }

    const reject = () => {
        setVisibleDelete(false);
    }
    // const statusTemplate = (rowData) => {
    //     return <div className={rowData?.isActive === true ? "green" : "red"}>{rowData?.isActive === true ? "Active" : "InActive"}</div>;
    // };

    // const expireDateTemplete = (rowData) => {
    //     return (
    //         <React.Fragment>
    //             {moment(rowData?.expireDate).format("YYYY-MM-DD")}
    //         </React.Fragment>
    //     );
    // };
    const expireDateTemplete = (rowData) => {
        return (
            <React.Fragment>
                {rowData?.expireDate?.split('T')[0]}
            </React.Fragment>
        );
    };

    const subcategoryTemplate = (rowData) => {

        return (
            <>
                <React.Fragment>
                    {`${rowData?.subcategory?.name}`}

                </React.Fragment>
            </>
        );
    };
    const productTemplate = (rowData) => {

        return (
            <>
                <React.Fragment>

                    {`${rowData?.product[0]?.name}`}
                </React.Fragment>
            </>
        );
    };


    return (
        <>
            {/* <Toast ref={toast} /> */}
            <Dialog header={addEditPromotion ? "Edit" : "Create Promotion"} visible={displayBasic} style={{ width: '40vw' }} onHide={onHide}>
                <AddPromotion
                    onHide={onHide}
                    getPromotiondata={getPromotiondata}
                    addEditPromotion={addEditPromotion}
                    promotionRowData={promotionRowData}
                    rowDataId={id}
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
                        <DataTable
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Records"
                            globalFilter={globalFilter}
                            rows={7}
                            paginator
                            responsiveLayout="scroll"
                            value={promotiondata}

                        >
                            <Column body={subcategoryTemplate} header="Sub-Category" />
                            <Column body={productTemplate} header="Product" />
                            <Column field="status" header="Status" />
                            <Column body={expireDateTemplete} header="Expire Date" />
                            <Column field="discount" header="Discount" />
                            <Column body={actionTemplate} header="Action" />
                        </DataTable>
                    </div>
                </div>
            </div>

        </>

    );

}
export default PromotionManagement;
