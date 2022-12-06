import React from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import MemberShip from './Membership/MemberShip';
import PointsManagement from './PointsSubmenu/PointsManagement';
import CoupanPolicy from './CoupanSubmenu/CoupanPolicy';
import MembershipBenifits from './MembershipBenifits/MembershipBenifits';
const Index = () => {
    return (
        <div>
            <div className="grid">
                <div className="col-12 md:col-12 lg:col-12 xs:col-12">

                    <TabView>
                        <TabPanel header="Membership Management" className="membershipManagement">
                            <MemberShip />
                        </TabPanel>
                        <TabPanel header="Points Management" className="pointManagement">
                            <PointsManagement />
                        </TabPanel>
                        <TabPanel header="Coupan Policy Management" className="coupanManagement">
                            <CoupanPolicy />
                        </TabPanel>
                        <TabPanel header="Membership Benifit Management" className="membershipManagement">
                            <MembershipBenifits />
                        </TabPanel>
                    </TabView>
                </div>

            </div>
        </div>
    );
}

export default Index;
