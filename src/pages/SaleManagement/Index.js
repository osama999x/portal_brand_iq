import React, { useState, useEffect } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { useLocation, useHistory } from 'react-router-dom';
import CategoryManagement from './CategoryManagement/CategoryManagement';
import ProductManagement from './ProductManagement/ProductManagement';

const SALE_PATHS = ['/categorymanagement', '/productmanagement'];

const Index = () => {
    const location = useLocation();
    const history = useHistory();
    const pathToIndex = (path) => {
        if (!path) return 0;
        if (path.includes('productmanagement')) return 1;
        // Category Management tab also hosts Sub-Category management
        if (path.includes('categorymanagement') || path.includes('subcategory')) return 0;
        return 0;
    };
    const [activeIndex, setActiveIndex] = useState(pathToIndex(location.pathname));

    useEffect(() => {
        setActiveIndex(pathToIndex(location.pathname));
    }, [location.pathname]);

    const onTabChange = (e) => {
        const newIndex = e.index;
        setActiveIndex(newIndex);
        const newPath = SALE_PATHS[newIndex];
        if (newPath && location.pathname !== newPath) {
            history.replace(newPath);
        }
    };

    return (
        <div>
            <div className="grid">
                <div className="col-12 md:col-12 lg:col-12 xs:col-12">
                    <TabView activeIndex={activeIndex} onTabChange={onTabChange}>
                        <TabPanel header="Category Management" className="categoryIcon">
                            <CategoryManagement />
                        </TabPanel>
                        <TabPanel header="Product Management" className="productIcon">
                            <ProductManagement />
                        </TabPanel>
                    </TabView>
                </div>
            </div>
        </div>
    );
}

export default Index;
