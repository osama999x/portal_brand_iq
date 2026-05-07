import React, { useState, useEffect } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { useLocation, useHistory } from 'react-router-dom';
import MemberShip from './Membership/MemberShip';
import PointsManagement from './PointsSubmenu/PointsManagement';
import CoupanPolicy from './CoupanSubmenu/CoupanPolicy';
import MembershipBenifits from './MembershipBenifits/MembershipBenifits';

const CUSTOMER_PATHS = ['/customermanagement', '/pointmanagement', '/couponmanagement', null]; // tab 3 has no dedicated route

const Index = () => {
    const location = useLocation();
    const history = useHistory();
    const pathToIndex = (path) => {
        if (!path) return 0;
        if (path.includes('couponmanagement')) return 2;
        if (path.includes('pointmanagement')) return 1;
        if (path.includes('customermanagement')) return 0;
        return 0;
    };
    const [activeIndex, setActiveIndex] = useState(pathToIndex(location.pathname));

    useEffect(() => {
        setActiveIndex(pathToIndex(location.pathname));
    }, [location.pathname]);

    const onTabChange = (e) => {
        const newIndex = e.index;
        setActiveIndex(newIndex);
        const newPath = CUSTOMER_PATHS[newIndex];
        if (newPath && location.pathname !== newPath) {
            history.replace(newPath);
        }
    };

    return (
        <div>
            <div className="grid">
                <div className="col-12 md:col-12 lg:col-12 xs:col-12">
                    <TabView activeIndex={activeIndex} onTabChange={onTabChange}>
                        <TabPanel header="Membership Management" className="membershipManagement">
                            <MemberShip />
                        </TabPanel>
                        <TabPanel header="Points Management" className="pointManagement">
                            <PointsManagement />
                        </TabPanel>
                        <TabPanel header="Coupon Policy Management" className="coupanManagement">
                            <CoupanPolicy />
                        </TabPanel>
                        <TabPanel header="Membership Benefit Management" className="membershipManagement">
                            <MembershipBenifits />
                        </TabPanel>
                    </TabView>
                </div>
            </div>
        </div>
    );
}

export default Index;
