import { baseURL } from "../utilities/Config";
import axios from "axios";
import { toast } from "react-toastify";
import { trimData } from "../utilities/TrimPayloadData";
import { loadingAction } from "../redux/actions/loadingAction";

export const handlePatchRequest =
    (data, url, isShowLoad = false, isShowToast = true, isShowToastErr = false) =>
    async (dispatch) => {
        //   data = await trimData(data);
        try {
            if (isShowLoad) dispatch(loadingAction(true));
            const response = await axios({
                method: "patch",
                url: `${baseURL + url}`,
                data: data,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("token"),
                },
            });

            if (isShowToast) toast.success(response?.msg);
            console.log("result",response)
            if (isShowLoad) dispatch(loadingAction(false));
            return response;
        } catch (error) {
            if (isShowLoad) dispatch(loadingAction(false));
            if (error?.response?.status === 400) toast.warn(error?.response?.data?.msg || "Something went wrong !!");
            else if (error?.response?.status === 500) toast.error(error?.response?.data?.msg || "Something went wrong !!");
            else toast.warn(error?.response?.data?.msg || "Something went wrong !!");

            return error?.response;
        }
    };
