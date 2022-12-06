import React from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import FeeManagement from './FeeManagement';
import PolicyManagement from './PolicyManagement';
const Index = () => {
    return (
        <div>
            <div className="grid">
                <div className="col-12 md:col-12 lg:col-12 xs:col-12">

                    <TabView>
                        <TabPanel header="Fee Slab Management">
                            <FeeManagement />
                        </TabPanel>
                        <TabPanel header="Fee Policy Management">
                            <PolicyManagement />
                        </TabPanel>
                    </TabView>
                </div>

            </div >
        </div>
    );
}

export default Index;
