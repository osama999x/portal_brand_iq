import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';

const Edit = () => {

  const [selectedCateg, setSelectedCateg] = useState();
  const [selectedCities1, setSelectedCities1] = useState(null);
  const categ = [
    { name: 'Bloom' },
    { name: 'HeadPhone' },
  ];
  const onCategChange = (e) => {
    setSelectedCateg(e.value);
  }

  const cities = [
    { name: 'All' },
    { name: 'Cosmetics' },
    { name: 'Mobile Charger' },
    { name: 'Batteries' },
    { name: 'Perfumes' },
    { name: 'EarPhones' }
  ];

  return (
    <div>
      <div className="grid p-p-3">
        <div className="col-12 xl:col-6 lg:col-6 md:col-6">
          <div className="flex flex-column">
            <label className="mb-2">Select Category</label>
            <Dropdown className="w-full md:w-10 inputClass" value={selectedCateg} options={categ} onChange={onCategChange} optionLabel="name" placeholder="Select" />
          </div>
        </div>
        <div className="col-12 xl:col-6 lg:col-6 md:col-6">
          <div className="flex flex-column">
            <label className="mb-2">Select Sub-Category</label>
            <InputText type="text" placeholder="Enter" className="w-full md:w-10 inputClass" />
          </div>
        </div>
        <div className="col-12 xl:col-6 lg:col-6 md:col-6">
          <div className="flex flex-column">
            <label className="mb-2">Select Sub-Category</label>
            <MultiSelect className="w-full md:w-10 inputClass" value={selectedCities1} options={cities} onChange={(e) => setSelectedCities1(e.value)} optionLabel="name" placeholder="Select a City" maxSelectedLabels={3} />
          </div>
        </div>
        <div className="col-12 xl:col-6 lg:col-6 md:col-6">
          <div className="flex flex-column">
            <label className="mb-2">Discount</label>
            <InputText type="text" placeholder="Enter" className="w-full md:w-10 inputClass" />
          </div>
        </div>
        <div className="col-12 xl:col-6 lg:col-6 md:col-6">
          <div className="flex flex-column">
            <label className="mb-2">From Date</label>
            <InputText type="date" className="w-full md:w-10 inputClass" />
          </div>
        </div>
        <div className="col-12 xl:col-6 lg:col-6 md:col-6">
          <div className="flex flex-column">
            <label className="mb-2">Till Date</label>
            <InputText type="date" className="w-full md:w-10 inputClass" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Edit;

