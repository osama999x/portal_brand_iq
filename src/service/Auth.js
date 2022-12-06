import { baseURL } from ".././utilities/Config";
import axios from "axios";
import { toast } from "react-toastify";

export const login = async (data) => {
    const id = toast.loading("Please wait...");
    try {
        const response = await axios({
            method: "post",
            url: `${baseURL}login`,
            data: data,
            headers: {
                "Content-Type": "application/json",
                // Authorization: "Bearer oBMLUgzWWOl5xl4K0KZRZpBcQcJ3BxXHr972E28a8gjV1vqMOtBbA6EF1xr3gGvYIt1sPzIA5AVPA6/dHDiDroJ+UgKMgkk7aqkg4JjWeFV0wlMhamhKuHvoQ/9TNkHhNvzHdvhVehK32jAqtgzugoJ2+MZLriSnSO97Krj7m+5Ljs/OG3YqKQzozkvXOyEskmbkC13VzHY0+o1eH5AHe0HRBHb8/IjenJ5saJqRq24=",
            },
        });
        toast.update(id, { render: response.data.messages, type: "success", isLoading: false, autoClose: 3000 });
        return response.data;
    } catch (error) {
        if (error.response.status === 500) toast.update(id, { render: error.response.data.messages || "Something went wrong !!", type: "error", isLoading: false, autoClose: 3000 });
        else if (error.response.status === 400) toast.update(id, { render: error?.response?.data?.[0]?.toastError || "Something went wrong !!", type: "error", isLoading: false, autoClose: 3000 });
        else toast.update(id, { render: error.response.data.messages || "Something went wrong !!", type: "warn", isLoading: false, autoClose: 3000 });

        return error.response;
    }
};

export const refreshToken = async (data) => {
    let res;
    await axios({
        method: "get",
        url: `${baseURL}refreshToken`,
        data: data,
        headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
        },
    })
        .then((response) => {
            localStorage.setItem("token", response.data.data);
        })
        .catch((err) => {
            res = false;
            console.err(err);
        });
    return res;
};

export const updatePassword = async (password) => {
    let res;
    await axios({
        method: "post",
        url: `${baseURL}userManagement/changePassword`,
        data: { password },
        headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
        },
    })
        .then((response) => {
            toast.success(response.data.data);
            res = response?.data?.data;
        })
        .catch((err) => {
            toast.warn(err?.response?.data?.messages || "Something went wrong");
            res = false;
        });
    return res;
};
