import React, { useState, useEffect } from 'react';
// import { Menu } from 'primereact/menu';
// import { ProductService } from '../service/ProductService';
import { FaShippingFast } from "react-icons/fa";
import { Chart } from 'primereact/chart';
import { handleGetRequest } from '../service/GetTemplate';
import moment from 'moment';



const Dashboard = (props) => {
    // const [products, setProducts] = useState(null);
    // const menu1 = useRef(null);
    // const menu2 = useRef(null);
    const [lineData, setLineData] = useState(null);
    const [orderData, setOrderData] = useState([]);
    const [deliverddata, setDeliverdData] = useState(null);
    // const [selectedYear2, setSelectedYear2] = useState();
    // const [selectedWeekly, setSelectedWeekly] = useState();
    // const [month,setMonth] = useState([]);
    // const [selectedMonth,setSelectedMonth] = useState();
    const [selectedYear, setSelectedYear] = useState();
    const [newYear, setNewYear] = useState([]);


    const [date, setDate] = useState();
    const [selectedDate, setSelectedDate] = useState();



    const getlinedata = async () => {
        try {
            const res = await handleGetRequest("api/v1/order/hotSellingProducts", false, true);
            // API returns { success: false, message: "..." } when none found, or array of { productName, count }
            if (Array.isArray(res) && res.length > 0) {
                const labels = res.map((item) => `${item.productName || ''}`);
                const values = res.map((item) => item.count ?? 0);
                setLineData({
                    labels,
                    datasets: [{ label: 'Sold', data: values, fill: false, borderColor: '#4f6ef7', backgroundColor: 'rgba(79,110,247,0.1)', tension: 0.4 }]
                });
                setDate(res);
            } else {
                setLineData({ labels: [], datasets: [{ label: 'Sold', data: [], fill: false, borderColor: '#4f6ef7', backgroundColor: 'rgba(79,110,247,0.1)', tension: 0.4 }] });
            }
        } catch (e) {
            setLineData({ labels: [], datasets: [{ label: 'Sold', data: [], fill: false, borderColor: '#4f6ef7', backgroundColor: 'rgba(79,110,247,0.1)', tension: 0.4 }] });
        }
    };
    useEffect(() => {
        getlinedata();
    }, []);



    // GET /api/v1/order/dashboard returns data: [{ status, order }, ..., { totalOrder }]
    const getOrderData = async () => {
        try {
            const res = await handleGetRequest("api/v1/order/dashboard", false, true);
            setOrderData(Array.isArray(res) ? res : []);
        } catch (e) {
            setOrderData([]);
        }
    };
    useEffect(() => {
        getOrderData();

    }, []);


    function getMonthName(monthNumber) {
        const date = new Date();
        date.setMonth(monthNumber - 1);

        return date.toLocaleString('en-US', { month: 'long' });
    }
    // GET /api/v1/order/orderReport returns data: [{ status, total }, ..., { totalOrder }]
    const getDeliverdData = async () => {
        try {
            const res = await handleGetRequest("api/v1/order/orderReport", false, true);
            setNewYear(Array.isArray(res) ? res : []);
            if (!Array.isArray(res) || res.length === 0) {
                setDeliverdData({ labels: [], datasets: [{ label: 'Orders', backgroundColor: '#4f6ef7', borderRadius: 6, data: [] }] });
                return;
            }
            const labels = res.map((item) => (item.status != null ? item.status : 'Total Order'));
            const values = res.map((item) => item.total != null ? item.total : item.totalOrder ?? 0);
            setDeliverdData({
                labels,
                datasets: [{ label: 'Orders', backgroundColor: '#4f6ef7', borderRadius: 6, data: values }]
            });
        } catch (e) {
            setDeliverdData({ labels: [], datasets: [{ label: 'Orders', backgroundColor: '#4f6ef7', borderRadius: 6, data: [] }] });
        }
    };
    useEffect(() => {
        getDeliverdData();

    }, []);




    const onDateChange = (e) => {
        const value = e.value;
        setSelectedDate(value);
        //console.log(e.value);
        //console.log("checking state value", selectedDate);

        let dateArr = Object.entries(value);
        const dateVal = value.dateofMonth;
        // console.log("Date Value",dateVal)
        dateArr.map(each => {
            if (each[1] === dateVal) {
                //console.log("getting date value from dateArr", each[1]);
                setLineData(
                    {
                        labels: "",
                        datasets: [
                            {
                                label: 'value',
                                data: dateArr,
                                fill: false,
                                borderColor: '#42A5F5',
                                tension: .4
                            }
                        ]
                    }
                );
                //console.log("date Array", dateArr)
            }
        })


    }




    // const onMonthChange  = (e) => {
    //     setSelectedMonth(e.value)
    // }
    const onYearChange = (e) => {
        const value = e.value;
        setSelectedYear(value);
        let yearArr = Object.entries(value);
        const yearVal = value.year;
        let totalDeliver = yearArr[3];
        yearArr.map(each => {
            if (each[1] === yearVal) {
                setDeliverdData(
                    {
                        labels: "",
                        datasets: [
                            {
                                label: 'Total Delivered',
                                backgroundColor: '#42A5F5',
                                data: totalDeliver,
                            },
                        ]
                    }
                );
            }
        })
    }


    return (
        <>


            <div className="grid">
                {orderData && orderData.map((item, index) => (
                    <div key={item?.status ?? `total-${index}`} className="col-12 lg:col-6 xl:col-3">
                        <div className={`card mb-0 tab_${item?.status ?? 'total'} m_height rounded-2xl transition-shadow duration-300 hover:shadow-lg`}>
                            <div className="flex justify-content-between mb-3">
                                <div>
                                    <span className="block text-500 font-medium mb-3 tab_text tracking-wider">{item?.status != null ? item.status : "Total Order"}</span>
                                    <div className="text-900 font-medium text-xl numbr_size font-bold">{item?.order != null ? item.order : item?.totalOrder ?? 0}</div>
                                </div>
                                <div className={`flex align-items-center justify-content-center border-round icon_style_${item?.status ?? 'total'} icon_size`}>
                                    <i className="pi pi-shopping-cart text-xl" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid mt-5">
                <div className="col-12 lg:col-6 xl:col-6">
                    <div className="card rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
                        <div className="mb-3">
                            <div className="grid">
                                <div className="col-12 md:col-7">
                                    <span className="block mb-3 mt-3 label_text text-base font-semibold">Orders</span>
                                </div>
                                <div className="col-12 md:col-5">
                                </div>
                            </div>
                        </div>
                        <Chart type="bar" data={deliverddata || { labels: [], datasets: [] }} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                </div>

                <div className="col-12 lg:col-6 xl:col-6">
                    <div className="card rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300">
                        <div className="mb-3">
                            <div className="grid">
                                <div className="col-12 md:col-7">
                                    <div>
                                        <span className="block mb-3 mt-3 label_text text-base font-semibold">Top Selling Products</span>
                                    </div>
                                </div>
                                <div className="col-12 md:col-5">
                                    <div className="flex align-items-center justify-content-center">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Chart type="line" data={lineData || { labels: [], datasets: [] }} options={{ responsive: true, maintainAspectRatio: false }} />
                    </div>
                </div>
            </div>
        </>

    );
}

export default React.memo(Dashboard);
