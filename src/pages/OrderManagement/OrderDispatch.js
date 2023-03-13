import React, { useState, useEffect } from "react";
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { handleGetRequest } from "../../service/GetTemplate";
// import { useLocation } from "react-router-dom";
import { Button } from "primereact/button";
import { handlePostRequest } from "../../service/PostTemplate";
import { useDispatch } from "react-redux";
import { useHistory, useLocation} from "react-router-dom";

const OrderDispatch = ({status,id}) => {

// const location = useLocation();

    const [selectedCateg, setSelectedCateg] = useState();
    const [selectedStatus, setSelectedStatus] = useState();
    const [selectedCities1, setSelectedCities1] = useState(null);
    const [orderId, setOrderId] = useState(id);


    // useEffect(() => {
    //     if(selectedStatus === "") {
    //         setSelectedStatus(location?.state?.data?.status)
    //     }
    // }, [selectedStatus]);

    // const [orderId, setOrderId] = useState(props?.id ? props?.id:null);

    const [loading, setloading] = useState(false);
    // const [updatestatus, setUpdateStatus] = useState();
    const [deliveryPartner, setDeliveryPaetner] = useState();



    const dispatch = useDispatch();
    const history = useHistory();


    const handleDispatch = async () => {

        let data = {};
        data["deliveryPartnerId"] = selectedCateg;
        data["orderStatus"] = selectedStatus;
        data["orderId"] = orderId;
       
        
        const res = await dispatch(handlePostRequest(data, "api/v1/order/orderDispatch", false));
        
        if (res?.status === 200) {
            setOrderId(res);
        }
        setloading(false);
        history.push("./ordermanagement")
    };
    const getdeliverypartner = async () => {
        setloading(true);

        const res = await handleGetRequest("api/v1/deliverypartner/deliverPartnerList", false);

        if (res) {
            setDeliveryPaetner(res);
        }
        setloading(false);
    }
    useEffect(() => {
        getdeliverypartner();

    },
        []);



    const getAllStatus = async () => {
        setloading(true);
        const res = await handleGetRequest("api/v1/orderStatus/all", false);
        
        if (res) {
            let selectedId=res.find((item)=>item.orderStatusName===status)?._id;
            setSelectedStatus(selectedId);
            setSelectedCities1(res);

        }
        setloading(false);
    };
    useEffect(() => {
        getAllStatus();
        // getOrderId();
    }, []);

    const onCategChange = (e) => {
        setSelectedCateg(e.value);
    }
    const onCategChangeStatus = (e) => {
        setSelectedStatus(e.value);
    }
    return (
        <div>
            <div className="grid p-p-3">
                <div className="col-12 md:col-12 lg:col-12 xl:col-12">
                    <div className="flex flex-column">
                        <label className="mb-2">Delivery Partner</label>
                        <Dropdown
                            //disabled={isDisable}
                            placeholder="Select Partner"
                            className="w-full md:w-10 inputClass"
                            name="orderStatusName"
                            id="orderStatusName"
                            htmlFor="partner"
                            //onBlur={(e) => CheckValidations(e, i)}
                            options={deliveryPartner}
                            value={selectedCateg}
                            optionLabel="organizationName"
                            optionValue="_id"
                            onChange={onCategChange}
                        />
                    </div>
                </div>
                <div className="col-12 md:col-12 lg:col-12 xl:col-12">
                    <div className="flex flex-column">
                        <label className="mb-2">Order Status</label>

                        <Dropdown
                            //disabled={isDisable}
                            placeholder="Select Order"
                            className="w-full md:w-10 inputClass"
                            name="orderStatus"
                            id="orderStatus"
                            htmlFor="order"
                            //onBlur={(e) => CheckValidations(e, i)}
                            options={selectedCities1}
                            value={selectedStatus}
                            optionLabel="orderStatusName"
                            optionValue="_id"
                            onChange={onCategChangeStatus}
                        />

                    </div>
                </div>
                <div className="col-12 md:col-12 lg:col-12 xl:col-12">
                    <div className="flex flex-column">
                        <label className="mb-2">Ordered ID </label>
                        <InputText type="text" placeholder="Enter" className="w-full md:w-10 inputClass" value={orderId} />
                    </div>
                </div>
                <div className="col-12 text-center">

                    <Button disabled={loading} iconPos="right" label={"Submit"} autoFocus className="Savebtn p-mr-3"
                        onClick={() => handleDispatch()} />
                </div>
            </div>
        </div>
    );
}

export default OrderDispatch;
