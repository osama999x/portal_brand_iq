import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
// import { Badge } from "primereact/badge";
import { Panel } from "primereact/panel";
import { Image } from 'primereact/image';
import "./ImageUpload.css";

function AddEditImage({ handleImages, editable, EditIconImage }) {
    // const picture = EditIconImage;
    const toastBC = React.useRef(null);
    const upload = React.useRef(null);
    const [files, setfiles] = useState();
    const [icon, setIcon] = useState(editable);
    const [imgBase64, setImgBase64] = useState([]);
    const [loading, setloading] = useState(false);
    const header = () => {
        return (
            <>
                <input
                    type="file"
                    accept="image/png, image/gif, image/jpeg"
                    style={{ display: "none" }}
                    ref={upload}
                    onChange={(e) => onFileChange(e)}
                />
                <Button
                    onClick={(e) => {
                        e.preventDefault();
                        upload.current.click();
                    }}
                    label="Choose File"
                >
                </Button>
            </>
        );
    };

    const onFileChange = async (e) => {
        e.preventDefault();
        setloading(true);
        if (e.target.files[0]) await getBase64(e.target.files[0]);
        setloading(false);
    };

    async function getBase64(file) {
        var reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = function () {
            // if (!files.some((file) => file?.fileBase64 === reader.result)) {
            // let newfiles = JSON.parse(JSON.stringify(files));
            const filetype = file.type.split("/");
            let singleFile = ({ fileBase64: reader.result, fileName: file.name, fileSize: file.size, fileExtension: `.${filetype[1]}` });
            // newfiles.push({ fileBase64: reader.result, fileName: file.name, fileSize: file.size, fileExtension: `.${filetype[1]}` });
            setImgBase64(reader.result)
            // newfiles.push({ fileBase64: reader.result});
            setfiles(singleFile);
            // }
        };
    }

    const handleRemove = (b64) => {
        // let newArr = files.filter((file) => JSON.stringify(files?.fileBase64) !== JSON.stringify(b64));
        setfiles();
    };
    const handleIconRemove = () => {
        setIcon(false);
    };


    // const handleClear = () => {
    //     setIcon(false)
    //     setfiles();
    // };

    useEffect(() => {
        handleImages(imgBase64);
    }, [files, handleImages]);
    return (
        <Panel className="Custom__Panel" header={header}>
            <Toast ref={toastBC} position="bottom-center" />

            <div className="formgrid grid ">
                {icon && !files ? (

                    <>
                        <div className="field col-12 md:col-3" >
                            {
                                <Image src={`${process.env.REACT_APP_BASE_URL_LIVE}${EditIconImage}`} width="60px" alt="img" preview />
                            }
                        </div>
                        <div className="field col-12 md:col-5 mt-2">
                            <p>{icon}</p>
                        </div>
                        <div className="field col-12 md:col-1">
                            <Button
                                className="p-button-danger p-button-outlined p-button-sm"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleIconRemove();
                                }}
                            >
                                <i className="pi pi-trash "></i>
                            </Button>
                        </div>

                    </>

                ) : (
                    <center style={{ height: "3vh" }}>{/* <h6 className="image-placeholder">Please Upload Images</h6> */}</center>
                )}
                {files ? (

                    <>
                        <div className="field col-12 md:col-3">
                            {files?.fileExtension === ".png" || files?.fileExtension === ".jpeg" ? (
                                <Image src={files?.fileBase64} width="60px" alt="img" preview />
                            ) : null

                            }
                        </div>
                        <div className="field col-12 md:col-1">
                            <Button
                                className="p-button-danger p-button-outlined p-button-sm"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleRemove(files?.fileBase64);
                                }}
                            >
                                <i className="pi pi-trash "></i>
                            </Button>
                        </div>

                    </>

                ) : (
                    <center style={{ height: "3vh" }}>{/* <h6 className="image-placeholder">Please Upload Images</h6> */}</center>
                )}
                {loading && <h5>Loading</h5>}
            </div>
        </Panel>
    );
}

export default AddEditImage;
