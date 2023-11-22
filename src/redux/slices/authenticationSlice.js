import { createSlice } from "@reduxjs/toolkit";
const slice = createSlice({
    name: "authenticationSlice",
    initialState: {
        loginData: "",
        token: localStorage.getItem("token"),
        nav: localStorage.getItem("nav"),
        loggedIn: localStorage.getItem("loggedIn") || false,
        role: localStorage.getItem("userRole"),
        isActive: localStorage.getItem("isActive"),
        permissions: ""
    },
    reducers: {
        LOGIN_SUCCESS: (state, action) => {
            console.log('actions here', action)
            console.log("state", state)
            return {
                ...state,
                loginData: action.payload,
                token: localStorage.getItem("token"),
                nav: localStorage.getItem("nav"),
                loggedIn: action?.payload?.login || localStorage.getItem("login"),
                role: localStorage.getItem("userRole"),
                isActive: localStorage.getItem("isActive"),
                permissions: action?.payload?.permissions || localStorage.getItem("permissions")
            };
        },
        LOGIN_ERROR: (state) => {
            return {
                ...state,
                loginData: "",
                token: "",
                nav: "",
                loggedIn: false,
                role: "",
                permissions: ''
            };
        },
    },
});

export const { LOGIN_SUCCESS, LOGIN_ERROR } = slice.actions;
export default slice.reducer;
