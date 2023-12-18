import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { handleGetRequest } from "../../../service/GetTemplate";
import { handleDeleteRequest } from "../../../service/DeleteTemplete";
import { useDispatch } from "react-redux";
import AddEditCategory from "./AddEditCategory";
import { Image } from "primereact/image";
import AddEditSubCategory from "../subCategoryManagement/AddEditSubCategory";
import { baseURL } from "../../../utilities/Config";
import Edit from "../../../assets/ICONS/icon_edit.png";
import Delete from "../../../assets/ICONS/icon_delete.png";
// import { FileUpload } from 'primereact/fileupload';
// import AddEditUsers from './AddEditUsers';

const CategoryManagement = () => {
    const dispatch = useDispatch();
    const [visibleEdit, setVisibleEdit] = useState(false);
    const [subVisibleEdit, setSubVisibleEdit] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [visibleDelete, setVisibleDelete] = useState(false);
    const [editable, setEditable] = useState(false);
    const [subEditable, setSubEditable] = useState(false);
    const [expandedRows, setExpandedRows] = useState(null);
    const [categoryRowData, setCategoryRowData] = useState("");
    const [subCatRowData, setSubCatRowData] = useState("");
    const [data, setdata] = useState([]);
    const [expandedCatId, setExpandedCatId] = useState("");
    const [subcategorydata, setSubcategorydata] = useState([]);
    const [updatedData, setUpdatedData] = useState([]);

    useEffect(() => {
        getCategoryData();
    }, []);

    var selectedDeleteId;
    const onHide = () => {
        setEditable(false);
        setVisibleEdit(false);
        setSubEditable(false);
        setSubVisibleEdit(false);
    };
    // const onSubHide = () => {
    //     setSubEditable(false);
    //     setSubVisibleEdit(false);
    // }
    const getCategoryData = async () => {
        const res = await handleGetRequest("api/v1/category/all", false);

        if (res) {
            setdata(res);
        }
    };

    const getSubcategorydata = async () => {
        //setloading(true);
        const res = await handleGetRequest("api/v1/subcategory/all", false);

        if (res) {
            await setSubcategorydata(res);
        }
        //setloading(false);
    };
    useEffect(async () => {
        getSubcategorydata();
    }, []);

    const deleteCategory = async () => {
        const data = {};
        data["categoryId"] = selectedDeleteId;
        const res = await dispatch(handleDeleteRequest(data, `api/v1/category/`, true, true));

        // setloading(false);
        if (res?.status === 200) {
            getCategoryData();
            //window.location.reload();
        }
        //getcategorydata();
    };
    // useEffect(() => {
    //     if (visibleDelete === true) {
    //         RequestResetPassword();
    //     }
    // }, [visibleDelete]);

    const deleteSubCategory = async () => {
        const data = {};
        data["subcategoryId"] = selectedDeleteId;

        const res = await dispatch(handleDeleteRequest(data, `api/v1/subcategory/`, true, true));

        // setloading(false);
        if (res?.status === 200) {
            getSubcategorydata();
            //window.location.reload();
        }
        //getcategorydata();
    };
    // useEffect(() => {
    //     if (visibleDelete === true) {
    //         RequestResetPassword();
    //     }
    // }, [visibleDelete]);

    const editUsers = (rowData) => {
        setVisibleEdit(true);
        setEditable(true);
        setCategoryRowData(rowData._id);
    };

    const subEditUsers = (rowData) => {
        setSubEditable(true);
        setSubVisibleEdit(true);
        setSubCatRowData(rowData);
    };

    // Accept Reject Dialog

    // Subcategory
    var count = 0;

    const confirm2 = (rowData) => {
        count = count + 1;
        selectedDeleteId = rowData._id;
        confirmDialog({
            message: "Are you sure you want to delete this item?",
            header: "Delete Confirmation",
            icon: "pi pi-trash",
            acceptClassName: "Savebtn",
            rejectClassName: "Cancelbtn",
            accept,
            reject,
        });
    };

    //Category
    const confirm = (rowData) => {
        count = count + 2;
        selectedDeleteId = rowData._id;
        confirmDialog({
            message: "Are you sure you want to delete this category?",
            header: "Delete Confirmation",
            icon: "pi pi-trash",
            acceptClassName: "Savebtn",
            rejectClassName: "Cancelbtn",
            accept,
            reject,
        });
    };

    const accept = () => {
        if (count === 2) {
            deleteCategory();
            setVisibleDelete(true);
        } else if (count === 1) {
            // RequestResetPassword();
            deleteSubCategory();
            setVisibleDelete(true);
            // toast.current.show({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
        }
    };

    const reject = () => {
        if (count === 2) {
            setVisibleEdit(false);
            setSubVisibleEdit(false);
        } else if (count === 1) {
            setVisibleEdit(false);
            setSubVisibleEdit(false);
            // toast.current.show({ severity: 'info', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        }
    };
    const toast = useRef(null);

    // Expanded Data Table
    const getIdAndBoolean = (data) => {
        setUpdatedData(data);
        setSubVisibleEdit(true);
    };

    const actionTemplateCategory = (rowData) => {
        return (
            <div className="Edit_Icon">
                <Button tooltip="Edit" tooltipOptions={{ position: "top" }} className="edit p-mr-2" onClick={() => editUsers(rowData)}>
                    <img src={Edit} />
                </Button>
                <Button tooltip="Delete" tooltipOptions={{ position: "top" }} className="delete p-mr-2 p-ml-3" onClick={() => confirm(rowData)}>
                    <img src={Delete} />
                </Button>
            </div>
        );
    };

    const serialTemplate = (rowData, props) => {
        return <div>{props.rowIndex + 1}</div>;
    };
    const allowExpansion = (rowData) => {
        return <>{rowData.length > 0};</>;
    };

    const imageTemplate = (rowData) => {
        return (
            <React.Fragment>
                {/* {rowData?.image} */}
                {/* <img className='tbl__coupanImage' src={`http://20.212.227.60:3007/${rowData.image}`} alt="" /> */}
                <Image src={`${baseURL}${rowData.icon}`} zoomSrc={`http://20.212.227.60:3007/${rowData.icon}`} alt="Image" width="80" height="60" preview />
            </React.Fragment>
        );
    };
    const subImageTemplate = (rowData) => {
        return (
            <React.Fragment>
                {/* {rowData?.image} */}
                {/* <img className='tbl__coupanImage' src={`http://20.212.227.60:3007/${rowData.image}`} alt="" /> */}
                <Image src={`${baseURL}${rowData.icon}`} zoomSrc={`http://20.212.227.60:3007/${rowData.icon}`} alt="Image" width="80" height="60" preview />
            </React.Fragment>
        );
    };

    const actionTemplateSubcategory = (rowData) => {
        return (
            <div className="Edit_Icon">
                <Button tooltip="Edit" tooltipOptions={{ position: "top" }} className="edit p-mr-2" onClick={() => subEditUsers(rowData)}>
                    <img src={Edit} />
                </Button>
                <Button tooltip="Delete" tooltipOptions={{ position: "top" }} className="delete p-mr-2 p-ml-3" onClick={() => confirm2(rowData)}>
                    <img src={Delete} />
                </Button>
                {/* <Button tooltip="Delete" icon="pi pi-trash" tooltipOptions={{ position: "top" }} className="delete p-mr-2 p-ml-3" onClick={confirm2} /> */}
            </div>
        );
    };
    const rowExpansionTemplate = (data) => {
        return (
            <div className="grid">
                <div className="orders-subtable card col-12">
                    <h5>Sub-Categories for {data.name}</h5>
                    <div className="col-12  md:col-12 lg:col-12 xl:col-12">
                        <div className="text-right">
                            <span className="p-input-icon-right mr-3">
                                <input type="text" placeholder="Search" onInput={(e) => setGlobalFilter(e.target.value)} className="p-inputtext p-component p-filled" />
                                <i className="pi pi-search"></i>
                            </span>

                            <button className="p-button p-button-primary p-component ml-3" onClick={() => getIdAndBoolean(data)}>
                                <span className="p-button-icon p-c p-button-icon-left pi pi-plus"></span>
                                <span className="p-button-label p-c">Add New</span>
                                <span className="p-ink"></span>
                            </button>
                        </div>
                    </div>
                    <div className="col-12 md:col-12 lg:col-12 xl:col-12">
                        <div className="innr-Body">
                            <DataTable
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Records"
                                value={subcategorydata?.filter((item) => item.category?._id === data._id)}
                                responsiveLayout="scroll"
                            >
                                <Column
                                    body={(data, props) => {
                                        return <div>{props.rowIndex + 1}</div>;
                                    }}
                                    header="Serial"
                                />
                                <Column body={subImageTemplate} header="Image" />
                                <Column field="name" header="Sub-Category Name" sortable />
                                <Column field="description" header="Description" sortable style={{ width: "250px", height: "57px" }} />
                                <Column body={actionTemplateSubcategory} header="Action" />
                            </DataTable>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // const headerBtn = (
    //     <div className="table-header-container">
    //         <Button icon="pi pi-plus" label="Expand All" onClick={expandAll} className="mr-2" />
    //         <Button icon="pi pi-minus" label="Collapse All" onClick={collapseAll} />
    //     </div>
    // );

    const onRowExpand = (event) => {
        setExpandedCatId(event.data._id);
    };
    return (
        <>
            <Toast ref={toast} />
            <Dialog header={editable ? "Edit" : "Add New Category"} visible={visibleEdit} style={{ width: "40vw" }} onHide={onHide}>
                <AddEditCategory
                    getCategoryData={getCategoryData}
                    editable={editable}
                    onHide={() => {
                        onHide();
                    }}
                    categoryRowData={categoryRowData}
                />
            </Dialog>
            <Dialog header={subEditable ? "Edit" : "Add New Sub-Category"} visible={subVisibleEdit} style={{ width: "40vw" }} onHide={onHide}>
                <AddEditSubCategory
                    updatedData={updatedData}
                    getSubcategorydata={getSubcategorydata}
                    subEditable={subEditable}
                    onHide={() => {
                        onHide();
                    }}
                    subCatRowData={subCatRowData}
                />
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
                        {/* <button className="p-button p-button-primary p-component ml-3" onClick={() => setSubVisibleEdit(true)}>
                            <span className="p-button-icon p-c p-button-icon-left pi pi-plus"></span>
                            <span className="p-button-label p-c">Add Subcategory</span>
                            <span className="p-ink"></span>
                        </button> */}
                    </div>
                </div>
                <div className="col-12 md:col-12 lg:col-12 xl:col-12">
                    <div className="innr-Body">
                        <DataTable
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Records"
                            rows={7}
                            paginator
                            responsiveLayout="scroll"
                            onRowExpand={onRowExpand}
                            globalFilter={globalFilter}
                            value={data}
                            expandedRows={expandedRows}
                            onRowToggle={(e) => {
                                setExpandedRows(e.data);
                            }}
                            rowExpansionTemplate={rowExpansionTemplate}
                        >
                            <Column expander={allowExpansion} style={{ width: "3em" }} />
                            <Column body={serialTemplate} header="Serial no" />
                            <Column body={imageTemplate} header="Image" />
                            <Column field="name" header="Category Name" sortable />
                            <Column field="description" header="Description" style={{ width: "250px", height: "57px" }} />
                            <Column body={actionTemplateCategory} header="Action" />
                        </DataTable>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CategoryManagement;
