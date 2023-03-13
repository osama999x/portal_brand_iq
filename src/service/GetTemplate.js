import { baseURL } from "../utilities/Config";
import axios from "axios";
import { toast } from "react-toastify";
import { Toast } from 'primereact/toast';
const clearWaitingQueue = () => {
    // Easy, right 😎
    toast.clearWaitingQueue();
}
export const handleGetRequest = async (url, isShowToast) => {
    try {
        const response = await axios.get(`${baseURL + url}`, {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                //Authorization: localStorage.getItem("token"),
            },
        });
        if (isShowToast) toast.success(response?.data?.msg, { autoClose: 1500 });
        return response?.status === 200 || response?.status === 201 ? (response?.data?.data) : [];
    } catch (error) {
        // const id = toast.loading("Please wait...");
        // if (error?.response?.status === 404) 
        // {
        toast.clearWaitingQueue();
        toast.warn(error?.response?.data?.msg, { isLoading: true, autoClose: 1500 } || "Something went wrong !!", { isLoading: false, autoClose: 1500 });
        // };
        // else 
        // {
        //     toast.clearWaitingQueue(); 
        //     toast.warn(id, { render: error?.response?.data?.msg,type: "error" ,isLoading: false, autoClose: 1500|| "Something went wrong !!", type: "warn", isLoading: false, autoClose: 1500 });
        // }
    }
};
