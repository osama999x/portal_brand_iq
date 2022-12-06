import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import { Route, useLocation, Switch, Redirect } from "react-router-dom";
import { CSSTransition } from "react-transition-group";
import { useSelector } from "react-redux";
import { AppTopbar } from "./AppTopbar";
import { AppMenu } from "./AppMenu";
import { AppConfig } from "./AppConfig";
// import Login from "./pages/Login/Login";
import Forget from './pages/Login/ForgetPassword';
import OTP from './pages/Login/OTPView';
import ResetPass from './pages/Login/ResetPass';
import Dashboard from "./components/Dashboard";
// import Login from "./pages/Login/Login";
import UserMangement from "./pages/UserManagement/Index";
import TaxesManagement from "./pages/TaxesManagement/ManageTax";
import SaleManagement from "./pages/SaleManagement/Index";
import DiscountManage from "./pages/DiscountManage/Index";
// import PromotionManagement from "./pages/PromotionManagement/Index";
import PromotionManagement from "./pages/PromotionManagement/PromotionManagement"
import AddEditPromtions from "./pages/PromotionManagement/AddEditPromtion";
import CustomerManagement from "./pages/CustomerManagement/Index";
import InventoryStatus from "./pages/InventoryStatus/Index";
import CustomerMangement from "./pages/RegisteredUsers/CustomerManagement";
import CustomerDetails from "./pages/RegisteredUsers/CustomerDetails";
import ReviewsManagement from "./pages/ReviewsManagement/index";
import Feedback from "./pages/Feedback/Index";
import ShipmentManagement from "./pages/ShipmentManagement/Index";
import DeliveryManagement from "./pages/DeliveryManagement/DeliveryManage";
import CreateDeliveryManagement from "./pages/DeliveryManagement/DeliverySubmenu/AddEditDelivery";
import EditDeliveryManagement from "./pages/DeliveryManagement/DeliverySubmenu/Edit";
import OrderManagement from "./pages/OrderManagement/OrderManagement";
import AddEditOrderManagement from "./pages/OrderManagement/AddEditOrderManagement";
import UploadBulkProducts from "./pages/UploadBulkProducts/UploadBulkProducts";
import "react-toastify/dist/ReactToastify.css";
import PrimeReact from "primereact/api";
import { Tooltip } from "primereact/tooltip";
// import { ToastContainer, toast } from "react-toastify";
//import GlobalLoader from "./utilities/loader";
// import LoadingOverlay from "react-loading-overlay";
// import { useSelector } from "react-redux";
import "primereact/resources/primereact.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "prismjs/themes/prism-coy.css";
import "./assets/demo/flags/flags.css";
import "./assets/demo/Demos.scss";
import "./assets/layout/layout.scss";
import "./App.scss";
import Login from "./pages/Login/Login";
// import Forgot from "./pages/ForgotPassword/ForgotPassword"
// import ResetPassword from "./pages/ResetPassword/ResetPassword"

const App = () => {
    const [storedEmail, setStoredEmail] = useState("");
    const [layoutMode, setLayoutMode] = useState("static");
    const [layoutColorMode, setLayoutColorMode] = useState("light");
    const [inputStyle, setInputStyle] = useState("outlined");
    const [ripple, setRipple] = useState(true);
    const [staticMenuInactive, setStaticMenuInactive] = useState(false);
    const [overlayMenuActive, setOverlayMenuActive] = useState(false);
    const [mobileMenuActive, setMobileMenuActive] = useState(false);
    const [mobileTopbarMenuActive, setMobileTopbarMenuActive] = useState(false);
    const auth = useSelector((state) => state?.authenticationSlice?.token);
    const nav = useSelector((state) => state?.authenticationSlice?.nav);
    const isLoading = useSelector((state) => state?.utilitySlice?.isLoading);
    const isActive = useSelector((state) => state?.authenticationSlice?.isActive);
    const copyTooltipRef = useRef();
    const location = useLocation();
    require("dotenv").config();
    PrimeReact.ripple = true;

    let menuClick = false;
    let mobileTopbarMenuClick = false;

    useEffect(() => {
        if (mobileMenuActive) {
            addClass(document.body, "body-overflow-hidden");
        } else {
            removeClass(document.body, "body-overflow-hidden");
        }
    }, [mobileMenuActive]);

    useEffect(() => {
        copyTooltipRef && copyTooltipRef.current && copyTooltipRef.current.updateTargetEvents();
    }, [location]);

    const onInputStyleChange = (inputStyle) => {
        setInputStyle(inputStyle);
    };

    const onRipple = (e) => {
        PrimeReact.ripple = e.value;
        setRipple(e.value);
    };

    const onLayoutModeChange = (mode) => {
        setLayoutMode(mode);
    };

    const onColorModeChange = (mode) => {
        setLayoutColorMode(mode);
    };

    const onWrapperClick = (event) => {
        if (!menuClick) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }

        if (!mobileTopbarMenuClick) {
            setMobileTopbarMenuActive(false);
        }

        mobileTopbarMenuClick = false;
        menuClick = false;
    };

    const onToggleMenuClick = (event) => {
        menuClick = true;

        if (isDesktop()) {
            if (layoutMode === "overlay") {
                if (mobileMenuActive === true) {
                    setOverlayMenuActive(true);
                }

                setOverlayMenuActive((prevState) => !prevState);
                setMobileMenuActive(false);
            } else if (layoutMode === "static") {
                setStaticMenuInactive((prevState) => !prevState);
            }
        } else {
            setMobileMenuActive((prevState) => !prevState);
        }

        event.preventDefault();
    };

    const onSidebarClick = () => {
        menuClick = true;
    };

    const onMobileTopbarMenuClick = (event) => {
        mobileTopbarMenuClick = true;

        setMobileTopbarMenuActive((prevState) => !prevState);
        event.preventDefault();
    };

    const onMobileSubTopbarMenuClick = (event) => {
        mobileTopbarMenuClick = true;

        event.preventDefault();
    };

    const onMenuItemClick = (event) => {
        if (!event.item.items) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }
    };
    const isDesktop = () => {
        return window.innerWidth >= 992;
    };

    const menu = [
        {
            items: [
                {
                    label: "Dashboard",
                        icon: "pi pi-fw pi-th-large",
                    to: "/",
                },
            ],
        },
        {
            items: [{ label: "User Management", icon: "pi pi-fw pi-user", to: "/usermangement" }],
        },
        {
            items: [{ label: "Taxes Management", icon: "pi pi-fw pi-id-card", to: "/taxesmanagement" }],
        },
        {
            items: [{ label: "Sale Items Management", icon: "pi pi-fw pi-shopping-bag", to: "/salemanagement" }],
        },
        // {
        //     items: [{ label: "Discounts Management", icon: "pi pi-fw pi-id-card", to: "/discountManage" }],
        // },
        {
            items: [{ label: "Promotions Management", icon: "pi pi-fw pi-volume-up", to: "/promotionmanagement" }],
        },
        {
            items: [{ label: "Customer Loyalty Program", icon: "pi pi-fw pi-id-card", to: "/customermanagement" }],
        },
        // {
        //     items: [{ label: "Shipment Free Management", icon: "pi pi-fw pi-id-card", to: "/shipmentmanagement" }],
        // },
        {
            items: [{ label: "Delivery Partners Management", icon: "pi pi-fw pi-id-card", to: "/deliverymanagement" }],
        },
        {
            items: [{ label: "Orders Management", icon: "pi pi-fw pi-shopping-cart", to: "/ordermanagement" }],
        },
        {
            items: [{ label: "Inventory Status", icon: "pi pi-fw pi-id-card", to: "/inventorystatus" }],
        },
        {
            items: [{ label: "Registered Users", icon: "pi pi-fw pi-id-card", to: "/registeredusers" }],
        },
        {
            items: [{ label: "Upload Products", icon: "pi pi-fw pi-upload", to: "/productsupload" }],
        },
        {
            items: [{ label: "Reviews Management", icon: "pi pi-fw pi-id-card", to: "/reviewsmanagement" }],
        },
         {
             items: [{ label: "Feedback", icon: "pi pi-fw pi-id-card", to: "/feedback" }],
         },
    ];

    const addClass = (element, className) => {
        if (element.classList) element.classList.add(className);
        else element.className += " " + className;
    };

    const removeClass = (element, className) => {
        if (element.classList) element.classList.remove(className);
        else element.className = element.className.replace(new RegExp("(^|\\b)" + className.split(" ").join("|") + "(\\b|$)", "gi"), " ");
    };

    const wrapperClass = classNames("layout-wrapper", {
        "layout-overlay": layoutMode === "overlay",
        "layout-static": layoutMode === "static",
        "layout-static-sidebar-inactive": staticMenuInactive && layoutMode === "static",
        "layout-overlay-sidebar-active": overlayMenuActive && layoutMode === "overlay",
        "layout-mobile-sidebar-active": mobileMenuActive,
        "p-input-filled": inputStyle === "filled",
        "p-ripple-disabled": ripple === false,
        "layout-theme-light": layoutColorMode === "light",
    });


    return (
        <div className={wrapperClass} onClick={onWrapperClick}>
            {/* <GlobalLoader isShow={isLoading} /> */}
            {/* <ToastContainer/> */}
            <Tooltip ref={copyTooltipRef} target=".block-action-copy" position="bottom" content="Copied to clipboard" event="focus" />
            {!localStorage.getItem("login") === true ? (
                <div>
                    {/* <Route path="/" component={Login} /> */}
                    <Switch>
                        <Route exact path="/" render={() => <Login />} />
                        <Route exact path="/forgetpassword" render={() => <Forget setStoredEmail={setStoredEmail} />} />
                        <Route exact path="/OTPView" render={() => <OTP storedEmail={storedEmail} />} />
                        <Route exact path="/resetpass" render={() => <ResetPass storedEmail={storedEmail} />} />
                        <Redirect to="/" />
                    </Switch>
                </div>
            ) : (
                <>
                    <AppTopbar onToggleMenuClick={onToggleMenuClick} layoutColorMode={layoutColorMode} mobileTopbarMenuActive={mobileTopbarMenuActive} onMobileTopbarMenuClick={onMobileTopbarMenuClick} onMobileSubTopbarMenuClick={onMobileSubTopbarMenuClick} />

                    <div className="layout-sidebar" onClick={onSidebarClick}>
                        <AppMenu model={menu} onMenuItemClick={onMenuItemClick} layoutColorMode={layoutColorMode} />
                    </div>

                    <div className="layout-main-container">
                        <div className="layout-main">
                            <Switch>
                                <Route exact path="/" render={() => <Dashboard />} />
                                {/* <Route exact path="/login" render={() => <Login />} /> */}
                                <Route exact path="/usermangement" render={() => <UserMangement />} />
                                <Route exact path="/taxesmanagement" render={() => <TaxesManagement />} />
                                <Route exact path="/salemanagement" render={() => <SaleManagement />} />
                                <Route exact path="/discountmanage" render={() => <DiscountManage />} />
                                <Route exact path="/promotionmanagement" render={() => <PromotionManagement />} />
                                <Route exact path="/promotiondetail" render={() => <AddEditPromtions />} />
                                <Route exact path="/customermanagement" render={() => <CustomerManagement />} />
                                <Route exact path="/customerdetails" render={() => <CustomerDetails />} />
                                <Route exact path="/shipmentmanagement" render={() => <ShipmentManagement />} />
                                <Route exact path="/deliverymanagement" render={() => <DeliveryManagement />} />
                                <Route exact path="/createdeliverymanagement" render={() => <CreateDeliveryManagement />} />
                                <Route exact path="/editdeliverymanagement" render={() => <EditDeliveryManagement />} />
                                <Route exact path="/ordermanagement" render={() => <OrderManagement />} />
                                <Route exact path="/detailordermanagement" render={() => <AddEditOrderManagement />} />
                                <Route exact path="/inventorystatus" render={() => <InventoryStatus />} />
                                <Route exact path="/registeredusers" render={() => <CustomerMangement />} />
                                <Route exact path="/reviewsmanagement" render={() => <ReviewsManagement />} />
                                <Route exact path="/productsupload" render={() => <UploadBulkProducts />} />
                                <Route exact path="/feedback" render={() => <Feedback />} />
                            </Switch>
                        </div>
                    </div>
                </>
            )}
            <AppConfig rippleEffect={ripple} onRippleEffect={onRipple} inputStyle={inputStyle} onInputStyleChange={onInputStyleChange} layoutMode={layoutMode} onLayoutModeChange={onLayoutModeChange} layoutColorMode={layoutColorMode} onColorModeChange={onColorModeChange} />

            <CSSTransition classNames="layout-mask" timeout={{ enter: 200, exit: 200 }} in={mobileMenuActive} unmountOnExit>
                <div className="layout-mask p-component-overlay"></div>
            </CSSTransition>
        </div>
    );
};

export default App;
