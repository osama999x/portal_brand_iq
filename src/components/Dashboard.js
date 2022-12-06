import React, { useState, useEffect } from 'react';
// import { Menu } from 'primereact/menu';
// import { ProductService } from '../service/ProductService';
import { FaShippingFast } from "react-icons/fa";
import { Chart } from 'primereact/chart';
// import { Dropdown } from 'primereact/dropdown';
import { handleGetRequest } from '../service/GetTemplate';



const Dashboard = (props) => {
    // const [products, setProducts] = useState(null);
    // const menu1 = useRef(null);
    // const menu2 = useRef(null);
    const [lineData, setLineData] = useState(null);
    const [orderData, setOrderData] = useState([]);
    const [deliverddata, setDeliverdData] = useState(null);
    // const [selectedYear, setSelectedYear] = useState();
    // const [selectedYear2, setSelectedYear2] = useState();
    // const [selectedWeekly, setSelectedWeekly] = useState();



    const getlinedata = async () => {

        const res = await handleGetRequest("api/v1/webLog/all", true, true)
            .then(res => {
                let lables = res.map((item) => `${item.dateofMonth}/${item.month}`);
                let values = res.map((item) => item.noOfVisit);

                let data = {
                    labels:
                        lables,
                    datasets: [
                        {
                            label: 'Visits',
                            data:
                                values,
                            fill: false,
                            borderColor: '#42A5F5',
                            tension: .4
                        }
                    ]
                };
                setLineData(data);
            })

        if (res === 200) {
            setLineData(res?.data?.data);
        };
    }
    useEffect(() => {
        getlinedata();
    }, []);

    // Get Line chart Data

    const getOrderData = async () => {
        const res = await handleGetRequest("api/v1/order/dashboard", true, true);
        setOrderData(res);
        if (res?.status === 200) {
            setOrderData(res);
        }
    };
    useEffect(() => {
        getOrderData();

    }, []);

    // integrate delivered chart
    const getDeliverdData = async () => {
        const res = await handleGetRequest("api/v1/order/orderReport", true, true);

        let lable = res.map((item) => item.month);
        // /${item.year}`);
        let value = res.map((item) => item.totalDelivered);
        //let totaldiv = res.map((item) => item.totalDelivered); 
        let data = {
            labels: lable,
            datasets: [
                {
                    label: 'Total Delivered',
                    backgroundColor: '#42A5F5',
                    data: value,
                },
            ]
        };
        setDeliverdData(data);
    };
    useEffect(() => {
        getDeliverdData();

    }, [])



    return (
        <>
            <div className="grid">
                <div className="col-12 lg:col-6 xl:col-3">
                    <div className="card mb-0 tab_">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3 tab_text">Total Orders:</span>
                                <div className="text-900 font-medium text-xl numbr_size">{orderData[4]?.totalOrder}</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-blue-100 border-round icon_style icon_size">
                                <i className="pi pi-shopping-cart text-white-500 text-xl" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 lg:col-6 xl:col-3">
                    <div className="card mb-0 tab_1">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3 tab_text">Delivered:</span>
                                <div className="text-900 font-medium text-xl numbr_size">{orderData[1]?.order}</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-blue-100 border-round icon_size icon_style1">
                                {/* <i className="pi pi-car text-white-500 text-xl" /> */}
                                <FaShippingFast className=' text-white-500 text-xl' />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 lg:col-6 xl:col-3">
                    <div className="card mb-0 tab_2">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3 tab_text">Order Confrim :</span>
                                <div className="text-900 font-medium text-xl numbr_size">{orderData[0]?.order}</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-blue-100 border-round icon_size icon_style2">
                                <i className="pi pi-car text-white-500 text-xl" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 lg:col-6 xl:col-3">
                    <div className="card mb-0 tab_3">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3 tab_text">Rejected:</span>
                                <div className="text-900 font-medium text-xl numbr_size">{orderData[3]?.order}</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-blue-100 border-round icon_size icon_style3">
                                <i className="pi pi-map-marker text-white-500 text-xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid mt-5">
                <div className="col-12 lg:col-6 xl:col-6">
                    <div className="card">
                        <div className="mb-3">
                            <div className="grid">
                                <div className="col-12 md:col-7">
                                    <span className="block mb-3 mt-3 label_text">Orders</span>
                                </div>

                                {/* <div className="col-12 md:col-5">
                                    <Dropdown className="Dropdown_class" value={selectedYear} options={year} onChange={onYearChange} optionLabel="name" placeholder="Select Year" />
                                </div> */}
                            </div>
                        </div>
                        <Chart type="bar" data={deliverddata} options={deliverddata} />
                    </div>
                </div>

                <div className="col-12 lg:col-6 xl:col-6">
                    <div className="card">
                        <div className=" mb-3">
                            <div className="grid">

                                <div className="col-12 md:col-7">
                                    <div>
                                        <span className="block mb-3 mt-3 label_text">Top Selling Products</span>
                                    </div>
                                </div>

                                {/* <div className="col-12 md:col-5">
                                    <div className="flex align-items-center justify-content-center">
                                        <Dropdown className="Dropdown_class" value={selectedYear} options={years} onChange={onYearChange2} optionLabel="name" placeholder="Select Year" />
                                    </div>
                                </div> */}
                            </div>
                        </div>
                        <Chart type="line" data={lineData} options={lineData} />

                    </div>
                </div>
            </div>
        </>

    );
}

export default React.memo(Dashboard);
