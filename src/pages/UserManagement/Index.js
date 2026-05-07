import React, { useState, useEffect } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { useLocation, useHistory } from 'react-router-dom';
import Users from './Users';
import Roles from './Roles';
import AddEditAssign from './AddEditAssign';

const USER_MGMT_PATHS = ['/createuser', '/createrole', '/createrolepermission'];

function Index() {
    const location = useLocation();
    const history = useHistory();
    const pathToIndex = (path) => {
        if (!path) return 0;
        if (path.includes('createrolepermission')) return 2;
        if (path.includes('createrole')) return 1;
        if (path.includes('createuser')) return 0;
        return 0;
    };
    const [activeIndex, setActiveIndex] = useState(pathToIndex(location.pathname));

    useEffect(() => {
        setActiveIndex(pathToIndex(location.pathname));
    }, [location.pathname]);

    const onTabChange = (e) => {
        const newIndex = e.index;
        setActiveIndex(newIndex);
        const newPath = USER_MGMT_PATHS[newIndex];
        if (newPath && location.pathname !== newPath) {
            history.replace(newPath);
        }
    };

    return (
        <>
            <div className="grid">
                <div className="col-12 md:col-12 xs:col-12 lg:col-12">
                    <TabView activeIndex={activeIndex} onTabChange={onTabChange}>
                        <TabPanel header="Create User" className="createusersIcon">
                            <Users />
                        </TabPanel>
                        <TabPanel header="Roles and Rights Management" className="rolesIcon">
                            <Roles />
                        </TabPanel>
                        <TabPanel header="Assign Permissions" className="assignIcon">
                            <AddEditAssign />
                        </TabPanel>
                    </TabView>
                </div>
            </div>
        </>
    );
}

export default Index;
