import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import classNames from 'classnames';
import { Avatar } from 'primereact/avatar';
import { BRAND_LOGO_URL } from './constants/brandLogo';
export const AppTopbar = (props) => {
    const handleLogout = async () => {
        // const res = await dispatch(handlePostRequest({ token }, "logout", true, true));

        // if (res?.responsecode === 1) {
        // props.onMobileSubTopbarMenuClick
        localStorage.clear();
        window.location.reload();

        // }

    };
    const handleModuleClick = () => {
        setShowTopBar(true);
    };
    const [showTopBar, setShowTopBar] = useState(false);
    //Custom Dropdown
    const [open, setOpen] = useState(false);
    let menuRef = useRef();
    useEffect(() => {
        const handler = (e) => {
            if (!menuRef.current?.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (


        <div className="layout-topbar">
            <div className="layout-topbar-start">
                <div className="layout-topbar-brand">
                    <Link to="/" className="layout-topbar-logo">
                        <img src={BRAND_LOGO_URL} alt="BrandIQ logo" className="layout-topbar-logo__img" />
                    </Link>
                </div>

                <button type="button" className="p-link layout-menu-button layout-topbar-button" onClick={props.onToggleMenuClick} aria-label="Toggle menu">
                    <i className="pi pi-bars" />
                </button>
            </div>

            <button type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={props.onMobileTopbarMenuClick} aria-label="Open menu">
                <i className="pi pi-ellipsis-v" />
            </button>

            <ul className={classNames("layout-topbar-menu lg:flex origin-top", { 'layout-topbar-menu-mobile-active': props.mobileTopbarMenuActive })}>
                {/* <li>
                    <Avatar image="images/avatar/amyelsner.png" size="large" className="p-mr-2" shape="circle" />
                </li>
                <li>
                    <button className="p-link layout-topbar-button" onClick={props.onMobileSubTopbarMenuClick}>
                        <i className="pi pi-bell" />
                        <span>Profile</span>
                    </button>
                </li> */}
                <li className="layout-topbar-user-menu">
                    <div className="menu-container" ref={menuRef}>
                        <button
                            type="button"
                            className="menu-trigger"
                            aria-label="Account menu"
                            aria-expanded={open}
                            onClick={() => setOpen((prev) => !prev)}
                        >
                            <i className="pi pi-angle-down" />
                        </button>

                        <div className={`dropdown-menu ${open ? 'active' : 'inactive'}`}>
                            <ul>
                                <li className="dropdownItem">
                                    <button type="button" className="dropdownItem__btn" onClick={handleLogout}>
                                        <i className="pi pi-sign-out" />
                                        <span>Logout</span>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </li>
            </ul>

        </div>
    );
}
