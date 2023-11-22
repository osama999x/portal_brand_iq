import React, { useState, useEffect, useRef } from 'react';
import { Dropdown } from 'primereact/dropdown';
import * as Yup from "yup";
import { useFormik } from "formik";
import classNames from "classnames";
import { Button } from 'primereact/button';
//import { handleEncryptData } from '../../services/Encrypt';
//import { handlePostRequest } from '../../services/PostTemplate';
//import { handleGetRequest } from '../../services/GetTemplate';
// import { handleGetRequest } from '../../service/GetTemplate';
//import { handleDecryptData } from '../../services/Decrypt';
import { useDispatch } from 'react-redux';
import { TreeSelect } from 'primereact/treeselect';
import { handlePostRequest } from '../../service/PostTemplate';
import Roles from './Roles';
import { handleGetRequest } from '../../service/GetTemplate';
import { handlePatchRequest } from '../../service/PatchTemplete';
//import { handleGetRequest } from '../../service/GetTemplate';
//import { handleGetRequestTest } from '../../services/GetTemplateTest';

const AssignRole = ({ UsersRowData, editable, getPremissionData, handleSelectedUserType }) => {

    const dispatch = useDispatch();
    const [userRoles, setUserRoles] = useState([]);
    const [premissionid, SetPremissionId] = useState();
    const [module, setModule] = useState([]);

    const [userList, setUserList] = useState([]);
    const [roleType, setRoleType] = useState([]);
    const [rolePermission, setRolePermission] = useState([]);
    const [treeOptions, setTreeOptions] = useState([]);
    const [treeData, setTreeData] = useState(null);
    const [selectedRolePermissions, setSelectedRolePermissions] = useState();
    const [permissionExist, setPermissionExist] = useState(false);

    const [rolePermissions, setRolePermissions] = useState({
        role: "",
        history: "",
        modules: [
            {
                module: "",
                isSubmodule: false,
                permissions: [""],
                sub_Modules: [
                    {
                        subModule: [""],
                        permissions: [""],
                    },
                ],
            },
        ],
    });


    const validationSchema = Yup.object().shape({

        roleId: Yup.string()?.required("This field is required"),


    });
    // console.log("selectedRolePermissions", selectedRolePermissions)

    const formik = useFormik({
        validationSchema: validationSchema,
        initialValues: {
            roleId: "",
            history: "",
            modules: [{
                module: "",
                isSubmodule: true,
                permissions: ""
            }]


        },

        enableReinitialize: true,


        onSubmit: async (data) => {

            let module = []
            rolePermission.forEach(element => {
                // console.log("selectedRolePermissions: ", selectedRolePermissions)

                if (selectedRolePermissions && selectedRolePermissions.hasOwnProperty(element._id)) {

                    // console.log("tree element: ", element)

                    let data = {
                        module: element._id,
                        isSubmodule: element.isSubModule,
                    }

                    let subData = [];

                    if (element.isSubModule === false) {
                        element.permissions.forEach((ch) => {
                            if (selectedRolePermissions.hasOwnProperty(`s${ch._id}`)) {
                                subData.push(ch._id);
                                data['permissions'] = subData;
                            }
                        })
                    }

                    else {

                        element.sub_modules.forEach((ch) => {
                            if (selectedRolePermissions.hasOwnProperty(`s${ch._id}`)) {
                                subData.push(ch._id);
                                data['subModule'] = subData;
                                data['permissions'] = [];
                                const myArray = [
                                    {
                                        subModule: subData,
                                        permissions: []
                                    }
                                ];
                                // console.log("myArray", myArray)
                            }
                        })

                    }
                    module.push(data)

                }
                formik.resetForm();
            });

            const body = {
                role: formik.values.roleId,
                history: JSON.stringify(selectedRolePermissions),
                modules: module
            }

            // console.log("module", module)
            // console.log("body", body)

            if (!permissionExist) {
                const res = await dispatch(handlePostRequest(body, "api/v1/rolePermission/", true, true));
                // console.log("Result for Post", res)

                if (res?.status === 201 || res?.status === 200) {
                    await getPremissionData();
                }
                setSelectedRolePermissions(null)
                formik.setFieldValue("roleId", "")
                formik.resetForm()
            }
            else {
                // body["role_permissionId"] = formik.values.roleId;
                // body["role"] = formik.values.role.name;
                const obj = {
                    role: formik.values.roleId,
                    history: JSON.stringify(selectedRolePermissions),
                    modules: module,
                    role_permissionId: premissionid
                }
                console.log("obj", obj)
                const res = await dispatch(handlePatchRequest(obj, "api/v1/rolePermission/", true, true));
                // console.log("Result for patch", res)

                if (res?.status === 201 || res?.status === 200) {
                    await getPremissionData();
                }
                setSelectedRolePermissions(null)
                formik.setFieldValue("role", "")
                formik.resetForm()
            }

        }

    }
    );


    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };


    const getUsersRole = async () => {
        const res = await handleGetRequest("api/v1/role/all", false);
        if (res) {
            setUserRoles(res);
            // console.log("response", res)
        }
    }
    const getModule = async () => {

        const res = await handleGetRequest("api/v1/module/all", false);
        //console.log("module", res)
        setRolePermission(res)

        // console.log("module", res)

        if (res) {
            setModule(res);
            let revamped = res.map((item, ind) => {
                return {
                    key: item._id,
                    label: item.label,
                    // permissions: item.permissions.name,
                    children: item.isSubModule ? item.sub_modules.map((item2) => {
                        return {
                            "key": `s${item2._id}`,
                            "label": item2.label,
                            // "permissions": item2.permissions
                        };
                    }) :
                        item.permissions.map((item3) => {
                            return {
                                "key": `s${item3._id}`,
                                "label": item3.name,
                                // "permissions": item2.permissions
                            };
                        })
                };
            });
            setTreeOptions(revamped);
        }
    };

    // console.log("treeOptions", treeOptions)


    useEffect(() => {
        if (UsersRowData !== undefined && UsersRowData !== null && editable === true) {
            //getUsersByID();

        }
        getUsersRole();
        getModule();



    }, []);

    // useEffect(() => {
    //   if (formik.values.roleId.toString().length === 0) {
    //     return;
    //   }
    //   getPremissionData(formik.values.roleId);
    //   if (formik.values.roleId !== "") {
    //     setDisable(false)
    //   }
    // }, [formik.values.roleId]);
    // console.log("userRoles", userRoles)

    const getPremissionById = async () => {
        const res = await handleGetRequest(`api/v1/rolePermission/getById?role_permissionId=${formik.values.roleId}`, true)
        console.log("getPremissionById", res)
        console.log("res.daata._id", res?.data?._id)
        // if (res.data._id) {
        //     SetPremissionId(selectedRolePermissions);
        // }

    }

    useEffect(() => {

        if (formik.values.roleId !== "") {

            //getPremissionById()
        }

    }, [formik.values.roleId])

    console.log("per", premissionid)

    const getPremissionDataa = async (id) => {

        try {
            const res = await handleGetRequest(`api/v1/rolePermission/getByRole?roleId=${id}`, true);
            console.log("my res", res)
            if (!res?.modules?.length) {
                setPermissionExist(false)
            }
            else if (res?.modules?.length) {
                console.log("res.id", res?._id)
                SetPremissionId(res?._id)
                setPermissionExist(true)
            }

            const formattedObject = JSON.parse(res.history);
            setTreeData(formattedObject);
            setSelectedRolePermissions(formattedObject);
        } catch (error) {
            // console.error("Error fetching permission data:", error);
            // Handle the error state or show a notification to the user
        }
    };
    useEffect(() => {
        if (formik.values.roleId) {
            getPremissionDataa(formik.values.roleId);

        }
    }, [formik.values.roleId]);

    console.log("formik.values.roleId", formik.values.roleId)

    return (

        <form onSubmit={formik.handleSubmit}>
            <div className="card">

                <h5>Select  User Role and assign permissions</h5>
                <hr />

                <div className='mt-5'>

                    <div className="p-fluid formgrid grid">

                        <div className="col-4 md:col-4 lg:col-4 xl:col-4">
                            <div className="flex flex-column">
                                <label className="mb-2">Role</label>
                                <Dropdown
                                    id="roleId"
                                    placeholder="Select Role"
                                    options={userRoles}
                                    optionLabel="name"
                                    name="roleId"
                                    optionValue="_id"
                                    value={formik.values.roleId}
                                    onChange={formik.handleChange}
                                    //onChange={(e) => { formik.handleChange(e); handleSelectedUserType(e.target.value) }}
                                    className={classNames({ "p-invalid": isFormFieldValid("roleId") }, "w-full md:w-10 inputClass")}

                                />
                                {getFormErrorMessage("roleId")}
                            </div>
                        </div>





                        <div className="col-4 md:col-4 lg:col-4 xl:col-4">
                            <div className="flex flex-column">
                                <label className="mb-2">Role Permissions</label>
                            </div>
                            <div style={{ overflowY: 'scroll' }}>
                                <TreeSelect
                                    //value={selectedRolePermissions}
                                    value={selectedRolePermissions}
                                    options={treeOptions}
                                    selectionMode="checkbox"
                                    onChange={(e) => setSelectedRolePermissions(e.value)}
                                    //onChange={(e) => setTreeData(e.value)}
                                    display="chip" placeholder="Select Items"
                                    metaKeySelection={false}
                                    autoScrollToTopOnFilter={false}
                                />
                            </div>
                        </div>


                        <div className="field col-12 md:col-2 flex align-items-center mb-0">
                            <Button type='submit' label="Update" aria-label="Save" className="Save__Button" />
                        </div>

                    </div>

                </div>

            </div>
        </form>
    );
}
export default AssignRole;