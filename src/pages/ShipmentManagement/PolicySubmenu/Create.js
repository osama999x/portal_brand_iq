import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { RadioButton } from 'primereact/radiobutton';


const Create = () => {
    const [selectedCategory, setSelectedCategory] = useState();
    const [city, setCity] = useState(null);


    const category = [
        { name: 'Silver' },
        { name: 'Gold' },
    ];
    const onCategoryChange = (e) => {
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
                        <label className="mb-2">Slab</label>
                        <Dropdown className="w-full md:w-10 inputClass" value={selectedCategory} options={category} onChange={onCategoryChange} optionLabel="name" placeholder="Select" />
                    </div>
                </div>
                <div className="col-12 md:col-12 lg:col-12 xl:col-12 pt-4 pb-4">
                    <div className="mb-3"><label>Charges</label></div>
                    <div className="flex radio_button">
                        <RadioButton className="mr-2 ml-2" inputId="Practical" name="Practical" value="Practical" onChange={(e) => setCity(e.value)} checked={city === 'Percentage'} />
                        <label htmlFor="Practical">Percentage</label>
                        <RadioButton className="mr-2 ml-2" inputId="Theory" name="Theory" value="Theory" onChange={(e) => setCity(e.value)} checked={city === 'Amount'} />
                        <label htmlFor="Theory">Amount</label>
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
        </div >
    );
}

export default Create;
