import { baseURL } from "../utilities/Config";
import axios from "axios";
import { toast } from "react-toastify";
import { trim } from "lodash";

export const handlePutRequest = async (data, url) => {
    const id = toast.loading("Please wait...");
    Object.keys(data).forEach((item) => {
        if (!Array.isArray(data[item])) data[item] = trim(data[item]);
    });
    try {
        const response = await axios({
            method: "put",
            url: `${baseURL + url}`,
            data: data,
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.getItem("token"),
            },
        });
        toast.update(id, { render: response.data.messages, type: "success", isLoading: false, autoClose: 3000 });
        return response.data;
    } catch (error) {
        if (error.response.status === 500) toast.update(id, { render: error.response.data.messages || "Something went wrong !!", type: "error", isLoading: false, autoClose: 3000 });
        else if (error.response.status === 400) toast.update(id, { render: error?.response?.data?.[0]?.toastError || "Something went wrong !!", type: "error", isLoading: false, autoClose: 3000 });
        else toast.update(id, { render: error.response.data.message || "Something went wrong !!", type: "warn", isLoading: false, autoClose: 3000 });

        return error.response;
    }
};
