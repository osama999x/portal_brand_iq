import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import classNames from 'classnames';
import { Avatar } from 'primereact/avatar';
import logo from "./assets/Logo.svg";
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
        let handler = (e) => {
            if (!menuRef.current.contains(e.target)) {
                setOpen(false);
                //console.log(menuRef.current);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => {
            document.removeEventListener("mousedown", handler);
        }

    });

    return (


        <div className="layout-topbar">
            <Link to="/" className="layout-topbar-logo">
            <img src={props.layoutColorMode === 'light' ? logo : logo} alt="logo" />
            </Link>

            <button type="button" className="p-link  layout-menu-button layout-topbar-button" onClick={props.onToggleMenuClick}>
                <i className="pi pi-bars" />
            </button>

            <button type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={props.onMobileTopbarMenuClick}>
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
                <div className='menu-container' ref={menuRef}>
                    <div className='menu-trigger' onClick={() => { setOpen(!open) }}>
                        <div className='flex align-items-center'>
                            {/* <h5 className='mb-0 mr-2'>Admin</h5> */}
                            {/* <Avatar image="images/avatar/amyelsner.png" size="large" className="p-mr-2 mr-2" shape="circle" style={{position: "unset"}}/> */}
                            <i className='pi pi-angle-down'></i>
                        </div>
                    </div>

                    <div className={`dropdown-menu ${open ? 'active' : 'inactive'}`} >
                        <ul>
                            <li className='dropdownItem' onClick={handleLogout}>

                                <a className="color"> <b className='pi pi-sign-out mr-3'></b><b>Logout</b> </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </ul>

        </div>
    );
}
