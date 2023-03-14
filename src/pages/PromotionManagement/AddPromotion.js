
import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import * as Yup from "yup";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { handleGetRequest } from '../../service/GetTemplate';
import { handlePatchRequest } from '../../service/PatchTemplete';
import { classNames } from 'primereact/utils';
import { Button } from 'primereact/button';
import { handlePostRequest } from '../../service/PostTemplate';
import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from "primereact/dropdown";


const AddPromotion = ({ onHide, getPromotiondata, addEditPromotion, promotionRowData, rowDataId  }) => {

    const [loading, setloading] = useState(false);
    const [subCategories, setSubCategories] = useState();
    const [products, setProducts] = useState([]);

    
    
    const dispatch = useDispatch();
    
    
    const validationSchema = Yup.object().shape({
        // subcategory:Yup.string().required("This field is required"),
        // product: Yup.mixed().required("This field is required."),
        // status: Yup.string().required("This field is required"),
        // expireDate: Yup.mixed().required("This field is required."),



    });
    const formik = useFormik({
        validationSchema: validationSchema,
        initialValues: {
            subcategory: "",
            product: "",
            status: "",
            expireDate: "",
            discount: "",
            

            
        },
        onSubmit: async (data) => {
            if (addEditPromotion === true) {
                data["campaignId"] = rowDataId;
                data["promotionId"] = promotionRowData
                const res = await dispatch(handlePatchRequest(data, "api/v1/promotion/updatePromotion", true, true));
                
                if (res.status === 200) {
                    await getPromotiondata();
                    formik.resetForm();
                    onHide();
                }

            } else {
            
                data["campaignId"] = rowDataId;
               // data["expireDate"] = moment().format("MM/DD/YYYY")
                
                const res = await dispatch(handlePostRequest(data, "api/v1/promotion/addPromotion", true, true));
                if (res?.status === 200 || res?.status === 201) {
                    await getPromotiondata();
                    formik.resetForm();
                    onHide();
                }

            }
        },
    });
    const getAllSubCategories = async () => {
        const response = await handleGetRequest("api/v1/subcategory/all", false);
        console.log("Sub",response)
        
        if (response) {
            setSubCategories(response);
        }
    };
    useEffect(() => {
        getAllSubCategories();
    
    }, []);
    const getAllProducts = async () => {
        const response = await handleGetRequest(`api/v1/products/all`, false);
        if (response) {
            setProducts(response);
        }
    };

    useEffect(() => {
    
        getAllProducts();
    }, []);
    
    useEffect(() => {
        if (formik.values.subcategory.length > 0) {
            getAllProducts();
        }

    }, [formik.values.subcategory]);


    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };
    useEffect(() => {
        if (promotionRowData !== undefined && promotionRowData !== null && addEditPromotion === true) {
            getPromotionByID();
        };
        
    }, []);
    
    
    const statusOption = [
        { name: 'Active', status: "active" },
        { name: 'InActive', status: "inactive" },
    ];
    
    const getPromotionByID = async () => {
        const res = await handleGetRequest(`api/v1/promotion/getOnePromotion?promotionId=${promotionRowData}`, true);
        
        
      
        setloading(false);
        if (res) {
            const keyData = res;
            
            Object.keys(keyData).forEach((key) => {
                if (formik.initialValues.hasOwnProperty(key)) {
                    formik.setFieldValue(key, keyData[key]);
                }
              
            });
             
            formik.setFieldValue("product", [keyData["product"][0]["_id"]] );
            console.log(formik.setFieldValue("product", [keyData["product"][0]["_id"]] ));
             formik.setFieldValue("subcategory", keyData["subcategory"]["_id"]);
           
            
        }
    }

    return (
        <div>

            <form onSubmit={formik.handleSubmit}>
                <div className="grid">
                    <div className="col-12 md:col-12 lg:col-12 xs:col-12">
                        <div className="flex flex-column">
                            <label className="mb-2">Select Sub-Category</label>
                            <Dropdown
                                name='subcategory'
                                id='subcategory'
                                className={classNames({ "p-invalid": isFormFieldValid("subcategory") }, "w-full md:w-10 inputClass")}
                                value={formik?.values?.subcategory}
                                onChange={formik.handleChange}
                                 placeholder="Sub Category"
                                optionLabel="name"
                                optionValue="_id"
                                options={subCategories}
                                                       />
                        </div>
                        {getFormErrorMessage("subcategory")}
                    </div>
                    <div className="col-12 md:col-12 xl:col-12 lg:col-12">
                        <div className="flex flex-column">
                            <label className="mb-2">Select Product</label>
                            <MultiSelect
                                // disabled={isDisable}
                                filter
                                display="chip"
                                placeholder="Select Product"
                                className="w-full md:w-10 inputClass"
                                name="product"
                                id="product"
                                htmlFor="product"
                                options={products}
                                value={formik?.values?.product}
                                optionLabel="name"
                                optionValue="_id"
                                onChange={formik.handleChange}
                            />
                            {getFormErrorMessage("product")}
                        </div>
                    </div>
                    
                    <div className="col-12 md:col-12 lg:col-12 xs:col-12">
                        <div className="flex flex-column">
                            <label className="mb-2">Status</label>
                            <Dropdown
                                id="status"
                                name="status"
                                value={formik.values.status}
                                onChange={formik.handleChange}
                                className={classNames({ "p-invalid": isFormFieldValid("status") }, "w-full md:w-10 inputClass")}
                                options={statusOption}
                                optionLabel="name"
                                optionValue="status"
                            />
                            {getFormErrorMessage("status")}
                        </div>

                    </div>
                    <div className="col-12 md:col-12 lg:col-12 xs:col-12">
                        <div className="flex flex-column">
                            <label htmlFor="fromDate">Expire Date</label>
                            <InputText
                                id="expireDate"
                                name="expireDate"
                                //value={moment(formik.values.expireDate).format("YYYY-MM-DD")}
                                value={formik.values.expireDate.split('T')[0]}
                                onChange={formik.handleChange}
                                className={classNames({ "p-invalid": isFormFieldValid("expireDate") }, "w-full md:w-10 inputClass")}
                                optionlabel="name"
                                type="date"
                            />
                        </div>
                        {getFormErrorMessage("expireDate")}
                    </div>
                    <div className="col-12 md:col-12 xl:col-12 lg:col-12">
                        <div className="flex flex-column">
                            <label className="mb-2">Discount %</label>
                            <InputText
                                type="number"
                                name="discount"
                                id="discount"
                                value={formik.values.discount}
                                onChange={formik.handleChange}
                                className={classNames({ "p-invalid": isFormFieldValid("discount") }, "w-full md:w-10 inputClass")} />
                            {getFormErrorMessage("discount")}
                        </div>
                    </div>

                  
                    <div className="col-12 md:col-12 xl:col-12 lg:col-12 text-center">
                        <Button
                            label="Cancel"
                            onClick={onHide}
                            type="button"
                            className="Cancelbtn p-mr-3"
                        />
                        <Button
                            // autoFocus
                            className="Savebtn"
                            label={addEditPromotion ? "Update" : "Save"}
                            disabled={loading}
                            type="submit"
                        />
                    </div>
                </div>

            </form>


        </div>
    );
}

export default AddPromotion;
