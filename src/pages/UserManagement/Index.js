import React from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import Users from './Users';
import Roles from './Roles';
import AddEditAssign from './AddEditAssign'
import { Icons } from 'react-toastify';



function Index() {

    return (
        <>
            <div className="grid">

                <div className="col-12 md:col-12 xs:col-12 lg:col-12" >

                    <TabView >

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
