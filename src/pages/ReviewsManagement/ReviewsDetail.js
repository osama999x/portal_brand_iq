import React, { useState, useEffect, } from 'react';
import { handleGetRequest } from '../../service/GetTemplate';
import { useLocation } from "react-router-dom";
import { Rating } from 'primereact/rating';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { object } from 'yup';
import { baseURL } from '../../utilities/Config';
import { Image } from 'primereact/image';

const ReviewsDetail = () => {
    let { search, state } = useLocation();

    const query = new URLSearchParams(search);
    const reviewRowData = query.get("reviewId");
    const [visibleEdit, setVisibleEdit] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [reviewData, setReviewData] = useState([]);



    const getReviewsDetail = async () => {
        const res = await handleGetRequest(`api/v1/review/customerReviewDetails?reviewId=${reviewRowData}`, true);


        // var result = object.keys(obj).m

        const singleObj = [res]

        setReviewData(singleObj);

    };

    useEffect(() => {
        getReviewsDetail();

    }, []);
    const onHide = () => {
        //setEditable(false);
        setVisibleEdit(false);
    }

    const ratingTemplate = (rowData) => {
        return <div><Rating value={rowData?.rating} readOnly stars={5} cancel={false} /></div>;
    }
    const imageTemplate = (rowData) => {

        return (
            <React.Fragment>
                {/* {rowData?.image} */}
                {/* <img className='tbl__coupanImage' src={`http://20.212.227.60:3007/${rowData.image}`} alt="" /> */}
                <Image src={`${baseURL}${rowData.images}`} zoomSrc={`http://20.212.227.60:3007/${rowData.images}`} alt="Image" width="80" height="60" preview />
            </React.Fragment>
        );
    };

    return (
        <div>
            <Dialog header="Detail" visible={visibleEdit} style={{ width: '40vw' }}
                //  footer={renderFooter('visibleEdit')}
                onHide={onHide}>
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

                        <DataTable value={reviewData}>
                            <Column field="customerName" header="Customer Name"></Column>
                            <Column field="productName" header="Product Name"></Column>
                            <Column body={ratingTemplate} header="Rating"></Column>
                            <Column field="comment" header="Comment"></Column>
                            <Column body={imageTemplate} header="Images"></Column>

                        </DataTable>




                        {/* {
                            <DataTable
                                rows={7}
                                value={reviewData}
                            >

                                <Column field="productName" header="Product Name" />

                            </DataTable>} */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReviewsDetail;