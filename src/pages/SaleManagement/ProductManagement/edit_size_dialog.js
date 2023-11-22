import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext'
import React, { useState } from 'react'
import { toast } from 'react-toastify';

export default function EditSizeDialog({ onHide, setSizes, index, size, sizes, setVariants, isFromColumn, colorName }) {
    const [addSize, setAddSize] = useState(size);
    const onSizeFieldsChange = (iden, val) => {
        if (val.length > 0 && (iden === 'actualPrice' || iden === 'discountedPrice' || iden === 'quantity')) {
            val = stringToAbsString(val);
        }
        setAddSize((prev) => {
            prev[iden] = val;
            return { ...prev }
        })

    }

    const stringToAbsString = (value) => {
        return Math.abs(parseInt(value.toString())).toString();


    }

    const handleAddSizeSubmit = (e) => {

        e.preventDefault();

        let values = Object.values(addSize);
        if (values.filter((item) => item.toString().length === 0).length > 0) {
            toast.warn("Please enter all the values");
            return;
        }

        let name = addSize.name;

        if (sizes.filter((item) => item.name === name).length >= 0 && name !== size.name) {
            toast.warn("Please choose another size name");
            return;
        }



        // let addSizeVal = { ...addSize }
        if (isFromColumn === false) {
            setSizes((prev) => {
                prev[index] = addSize;
                return [...prev];
            });
        } else {
            setVariants((prev) => {

                let variantIndex = prev.findIndex((item) => item.colorName === colorName);
                prev[variantIndex].size[index] = addSize;
                return [...prev]
            });
        }


        onHide();

    }

    return (
        <>
            <div id="add-variant-form" >
                <div className="grid">
                    <div className="col-12 md:col-6 lg:col-6 xl:col-6">
                        <div className="flex flex-column">
                            <label className="mb-2">Name</label>
                            <InputText placeholder="Name" value={addSize.name} onChange={(e) => onSizeFieldsChange('name', e.target.value)} className="w-full md:w-10 inputClass" />
                        </div>
                    </div>
                    <div className="col-12 md:col-6 lg:col-6 xl:col-6">
                        <div className="flex flex-column">
                            <label className="mb-2">Actual Price</label>
                            <InputText placeholder="Color name" min="1" value={addSize.actualPrice} onChange={(e) => onSizeFieldsChange('actualPrice', e.target.value)} className="w-full md:w-10 inputClass" />
                        </div>
                    </div>
                    <div className="col-12 md:col-6 lg:col-6 xl:col-6">
                        <div className="flex flex-column">
                            <label className="mb-2">Discounted Price</label>
                            <InputText placeholder="Dicounted Price" min='0' value={addSize.discountedPrice} onChange={(e) => onSizeFieldsChange('discountedPrice', e.target.value)} className="w-full md:w-10 inputClass" />
                        </div>
                    </div>
                    <div className="col-12 md:col-6 lg:col-6 xl:col-6">
                        <div className="flex flex-column">
                            <label className="mb-2">Quantity</label>
                            <InputText placeholder="Quantity" min="0" value={addSize.quantity} onChange={(e) => onSizeFieldsChange('quantity', e.target.value)} className="w-full md:w-10 inputClass" />
                        </div>
                    </div>


                    <div className="col-12 text-right">
                        <Button onClick={handleAddSizeSubmit} iconPos="right" label={"Update"} className=" p-mr-3" />

                    </div>

                </div>
            </div>


        </>
    )
}
