import { login } from "../../service/Auth";
import { LOGIN_SUCCESS, LOGIN_ERROR } from "../slices/authenticationSlice";
export const loginAction = (authData) => async (dispatch) => {
    const res = await login(authData);
    if (res?.data?.login === true) {
        localStorage.setItem("login", true);
        localStorage.setItem("token", res?.data?.token);
        localStorage.setItem("nav", JSON.stringify(res?.data?.menu));
        localStorage.setItem("userName", res?.data?.tblUser?.userName);
        localStorage.setItem("userEmail", res?.data?.tblUser?.email);
        localStorage.setItem("isActive", res?.data?.tblUser?.isActive);
        localStorage.setItem("userRole", res?.data?.tblUser?.roleId);
        localStorage.setItem("userId", res?.data?.tblUser?.userId);
        dispatch(LOGIN_SUCCESS(res?.data));
        return res;
    } else {
        dispatch(LOGIN_ERROR("Error"));
        return res;
    }
};
