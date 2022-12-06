import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from "primereact/checkbox";
import { RadioButton } from 'primereact/radiobutton';

const Create = () => {
    const [selectedCategory, setSelectedCategory] = useState();
    const [selectedThreshold, setselectedThreshold] = useState();
    const [checked1, setChecked1] = useState();
    const [city, setCity] = useState(null);


    const category = [
        { name: 'Silver' },
        { name: 'Gold' },
    ];
    const onCategoryChange = (e) => {
        setSelectedCategory(e.value);
    }
    const threshold = [
        { name: 'Daily' },
        { name: 'Weekly' },
        { name: 'Monthly' },
    ];
    const onThresholdChange = (e) => {
        setSelectedCategory(e.value);
    }


    return (
        <div>

            <div className="grid">
                <div className="col-12 md:col-12 lg:col-12 xs:col-12">
                    <div className="flex flex-column">
                        <label className="mb-2">Membership Category</label>
                        <Dropdown className="w-full md:w-10 inputClass" value={selectedCategory} options={category} onChange={onCategoryChange} optionLabel="name" placeholder="Select" />
                    </div>
                </div>
                <div className="col-12 md:col-12 lg:col-12 xs:col-12">
                    <div className="flex flex-column">
                        <label className=""><b>Slab</b></label>
                    </div>
                </div>
                <div className="col-12 md:col-12 lg:col-12 xs:col-12 flex innr_padding">
                    <div className="grid">
                        <div className="col-12 md:col-12 lg:col-12 xs:col-12">
                            <div className="flex flex-column">
                                <label className="mb-2">From Amount </label>
                                <InputText type="text" placeholder="Enter" className="w-full md:w-10 inputClass" />
                            </div>
                        </div>
                        <div className="col-12 md:col-12 lg:col-12 xs:col-12">
                            <div className="flex flex-column">
                                <label className="mb-2">To Amount </label>
                                <InputText type="text" placeholder="Enter" className="w-full md:w-10 inputClass" />
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}

export default Create;
