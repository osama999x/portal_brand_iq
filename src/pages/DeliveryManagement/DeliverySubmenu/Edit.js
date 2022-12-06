// import React, { useState } from 'react';
// import { InputText } from 'primereact/inputtext';
// import { Dropdown } from 'primereact/dropdown';
// import { MultiSelect } from 'primereact/multiselect';
// import { Button } from 'primereact/button';

// const Edit = () => {
//     const [selectedCity, setSelectedCity] = useState();
//     const [selectedCategory, setSelectedCategory] = useState();
//     const [selectedSubCategory, setSelectedSubCategory] = useState();
//     const [selectedProduct, setSelectedProduct] = useState(null);

//     const city = [
//         { name: 'Islamabad' },
//         { name: 'Lahore' },
//     ];
//     const onCityChange = (e) => {
//         setSelectedCity(e.value);
//     }


//     const category = [
//         { name: 'Abdullah' },
//         { name: 'Umar' },
//     ];
//     const onCategoryChange = (e) => {
//         setSelectedCategory(e.value);
//     }

//     const subCategory = [
//         { name: 'tax-head1' },
//         { name: 'tax-head2' },
//     ];
//     const onSubCategoryChange = (e) => {
//         setSelectedSubCategory(e.value);
//     }

//     const product = [
//         { name: 'All' },
//         { name: 'Cosmetics' },
//         { name: 'Mobile Charger' },
//         { name: 'Batteries' },
//         { name: 'Perfumes' },
//         { name: 'EarPhones' }
//     ];

//     return (
//         <div>
//             <div className="card headr_bg">
//                 <div className="card-header">
//                     <label>EDIT</label>
//                 </div>
//                 <div className="card-body">
//                     <div className="grid">
//                         <div className="col-12 xl:col-4 md:col-4 lg:col-4">
//                             <div className="flex flex-column">
//                                 <label className="mb-2">Organization's Name</label>
//                                 <InputText type="text" placeholder="Enter" className="w-full md:w-10 inputClass" />
//                             </div>
//                         </div>
//                         <div className="col-12 xl:col-4 md:col-4 lg:col-4">
//                             <div className="flex flex-column">
//                                 <label className="mb-2">City</label>
//                                 <Dropdown className="w-full md:w-10 inputClass" value={selectedCity} options={city} onChange={onCityChange} optionLabel="name" />
//                             </div>
//                         </div>
//                         <div className="col-12 xl:col-4 md:col-4 lg:col-4">
//                             <div className="flex flex-column">
//                                 <label className="mb-2">Mailing Address</label>
//                                 <InputText type="text" placeholder="Enter" className="w-full md:w-10 inputClass" />
//                             </div>
//                         </div>
//                         <div className="col-12 xl:col-4 md:col-4 lg:col-4">
//                             <div className="flex flex-column">
//                                 <label className="mb-2">Contact Number</label>
//                                 <InputText type="text" placeholder="Enter" className="w-full md:w-10 inputClass" />
//                             </div>
//                         </div>
//                         <div className="col-12 xl:col-4 md:col-4 lg:col-4">
//                             <div className="flex flex-column">
//                                 <label className="mb-2">Website</label>
//                                 <InputText type="text" placeholder="Enter" className="w-full md:w-10 inputClass" />
//                             </div>
//                         </div>
//                         <div className="col-12 xl:col-4 md:col-4 lg:col-4">
//                             <div className="flex flex-column">
//                                 <label className="mb-2">Order Tracking Link</label>
//                                 <InputText type="text" placeholder="Enter" className="w-full md:w-10 inputClass" />
//                             </div>
//                         </div>
//                         <div className="col-12 md:col-12 xl:col-12 lg:col-12 pt-3 pb-3">
//                             <label><span className="pr-5"><b>o</b></span>Particulars of Cheif Executive/Office Head</label>
//                         </div>
//                         <div className="col-12 flex innr_padding mt-3 mb-3">
//                             <div className="grid">
//                                 <div className="col-12 xl:col-4 md:col-4 lg:col-4">
//                                     <div className="flex flex-column">
//                                         <label className="mb-2">Name</label>
//                                         <InputText type="text" placeholder="Enter" className="w-full md:w-10 inputClass" />
//                                     </div>
//                                 </div>
//                                 <div className="col-12 xl:col-4 md:col-4 lg:col-4">
//                                     <div className="flex flex-column">
//                                         <label className="mb-2">SO/WO/DO </label>
//                                         <Dropdown className="w-full md:w-10 inputClass" value={selectedCategory} options={category} onChange={onCategoryChange} optionLabel="name" placeholder="Select" />
//                                     </div>
//                                 </div>
//                                 <div className="col-12 xl:col-4 md:col-4 lg:col-4">
//                                     <div className="flex flex-column">
//                                         <label className="mb-2">CNIC</label>
//                                         <InputText type="text" className="w-full md:w-10 inputClass" placeholder="Enter" />
//                                     </div>
//                                 </div>
//                                 <div className="col-12 xl:col-4 md:col-4 lg:col-4">
//                                     <div className="flex flex-column">
//                                         <label className="mb-2">Mobile Number</label>
//                                         <InputText type="text" placeholder="Enter" className="w-full md:w-10 inputClass" />
//                                     </div>
//                                 </div>
//                                 <div className="col-12 xl:col-4 md:col-4 lg:col-4">
//                                     <div className="flex flex-column">
//                                         <label className="mb-2">Picture</label>
//                                         <InputText type="file" className="w-full md:w-10 inputClass" />
//                                     </div>
//                                 </div>

//                             </div>

//                         </div>

//                         {/* representatives */}


//                         <div className="col-12 pt-3 pb-3">
//                             <label><span className="pr-5"><b>o</b></span>Particulars of Cheif Representatives</label>
//                         </div>
//                         <div className="col-12 flex innr_padding mt-3 mb-3">
//                             <div className="grid">
//                                 <div className="col-12 xl:col-4 md:col-4 lg:col-4">
//                                     <div className="flex flex-column">
//                                         <label className="mb-2">Name</label>
//                                         <InputText type="text" placeholder="Enter" className="w-full md:w-10 inputClass" />
//                                     </div>
//                                 </div>
//                                 <div className="col-12 xl:col-4 md:col-4 lg:col-4">
//                                     <div className="flex flex-column">
//                                         <label className="mb-2">SO/WO/DO </label>
//                                         <Dropdown className="w-full md:w-10 inputClass" value={selectedCategory} options={category} onChange={onCategoryChange} optionLabel="name" placeholder="Select" />
//                                     </div>
//                                 </div>
//                                 <div className="col-12 xl:col-4 md:col-4 lg:col-4">
//                                     <div className="flex flex-column">
//                                         <label className="mb-2">CNIC</label>
//                                         <InputText type="text" className="w-full md:w-10 inputClass" placeholder="Enter" />
//                                     </div>
//                                 </div>
//                                 <div className="col-12 xl:col-4 md:col-4 lg:col-4">
//                                     <div className="flex flex-column">
//                                         <label className="mb-2">Mobile Number</label>
//                                         <InputText type="text" placeholder="Enter" className="w-full md:w-10 inputClass" />
//                                     </div>
//                                 </div>
//                                 <div className="col-12 xl:col-4 md:col-4 lg:col-4">
//                                     <div className="flex flex-column">
//                                         <label className="mb-2">Picture</label>
//                                         <InputText type="file" className="w-full md:w-10 inputClass" />
//                                     </div>
//                                 </div>

//                             </div>

//                         </div>


//                         {/* representatives */}

//                     </div>
//                     <div className="grid">
//                         <div className="col-12 md:col-12 xl:col-12 lg:col-12 text-right pt-4">
//                             <Button className="Cancelbtn mr-2" label="Cancel"></Button>
//                             <Button autoFocus className="Savebtn" label="Save"></Button>
//                         </div>
//                     </div>

//                 </div>

//             </div>

//         </div>
//     );
// }

// export default Edit;

