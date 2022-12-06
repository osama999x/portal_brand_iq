import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { Avatar } from 'primereact/avatar';

export const AppTopbar = (props) => {
    const handleLogout = async () => {
        // const res = await dispatch(handlePostRequest({ token }, "logout", true, true));

        // if (res?.responsecode === 1) {
            // props.onMobileSubTopbarMenuClick
            localStorage.clear();
            window.location.reload();
    
        // }
        
    };
    return (
        <div className="layout-topbar">
            <Link to="/" className="layout-topbar-logo">
                {/* <img src={props.layoutColorMode === 'light' ? 'assets/layout/images/logo-dark.svg' : 'assets/layout/images/logo-white.svg'} alt="logo" /> */}
                <img src={props.layoutColorMode === 'light' ? 'assets/layout/images/logo-wt.svg' : 'assets/layout/images/logo-wt.svg'} alt="logo" />

                <span>Z-Store</span>
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
                <li>
                    <button className="p-link layout-topbar-button" 
                    onClick={ handleLogout
                        
                        // localStorage.setItem("login", false)
                        // props.onMobileSubTopbarMenuClick
                        
                        }>
                        <span>Logout</span>
                        <i className="pi pi-power-off" />

                    </button>
                </li>

            </ul>
        </div>
    );
}
