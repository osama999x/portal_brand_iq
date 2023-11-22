import React, { useState, useEffect, useRef } from 'react';
import { Rating } from 'primereact/rating';
import { handleGetRequest } from '../../../service/GetTemplate';

const FeedbackModal = ({ onHide, editable, categoryRowData }) => {
    const [loading, setloading] = useState(false);

    const [rating, setRating] = useState(null);
    const [feedbackDetail, setFeedbackDetail] = useState([]);

    const getFeedbackData = async () => {
        setloading(true);
        const res = await handleGetRequest(``, false);

        if (res) {
            setFeedbackDetail(res);


        }
        setloading(false);
    };
    useEffect(() => {
        getFeedbackData();
    }, []);

    return (
        <div>
            <h4 className="Feedback">CUSTOMER FEEDBACK</h4>
            <p>{feedbackDetail?.comments}</p>
            <Rating stars={6} value={4} onChange={(e) => setRating(e.value)} disabled={true} />
        </div>
    )
}

export default FeedbackModal
