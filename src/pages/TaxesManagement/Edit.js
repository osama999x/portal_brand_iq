// import React, { useState } from 'react';
// import { InputText } from 'primereact/inputtext';
// import { Dropdown } from 'primereact/dropdown';

// const Edit = () => {
//     const [selectedTax, setSelectedTax] = useState();
//     const tax = [
//         { name: 'Fedral' },
//         { name: 'Provincial' },
//     ];
//     const onTaxChange = (e) => {
//         setSelectedTax(e.value);
//     }
//     return (
//         <div>
//             <div className="grid p-p-3">
//                 <div className="col-12 md:col-12 lg:col-12 xs:col-12">
//                     <div className="flex flex-column">
//                         <label className="mb-2">Tax Type</label>
//                         <Dropdown className="w-full md:w-10 inputClass" value={selectedTax} options={tax} onChange={onTaxChange} optionLabel="name" placeholder="Select" />

//                     </div>
//                 </div>
//                 <div className="col-12 md:col-12 lg:col-12 xs:col-12">
//                     <div className="flex flex-column">
//                         <label className="mb-2">Tax Head</label>
//                         <InputText type="text" placeholder="Enter" className="w-full md:w-10 inputClass" />
//                     </div>
//                 </div>
//                 <div className="col-12 md:col-12 lg:col-12 xs:col-12">
//                     <div className="flex flex-column">
//                         <label className="mb-2">Description</label>
//                         <InputText type="text" placeholder="Enter" className="w-full md:w-10 inputClass" />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Edit;
