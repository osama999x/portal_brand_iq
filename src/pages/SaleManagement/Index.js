import React from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import CategoryManagement from './CategoryManagement/CategoryManagement';
//import SubCategoryManagement from './subCategoryManagement/subCategoryManagement';
import ProductManagement from './ProductManagement/ProductManagement';
const Index = () => {
    return (
        <div>
            <div className="grid">
                <div className="col-12 md:col-12 lg:col-12 xs:col-12">

                    <TabView >
                        <TabPanel header="Category Management" className="categoryIcon">
                            <CategoryManagement />
                        </TabPanel>
                        <TabPanel header="Product Management" className="productIcon">
                            <ProductManagement />
                        </TabPanel>

                        {/* <TabPanel header="Sub-Category Management" className="subCategoryIcon">
                            <SubCategoryManagement />
                        </TabPanel> */}

                    </TabView>
                </div>

            </div>
        </div>
    );
}

export default Index;
