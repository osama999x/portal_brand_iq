import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Badge } from "primereact/badge";
import { Panel } from "primereact/panel";
import "./ImageUpload.css";

function ImagesUpload({ handleImages }) {
    const toastBC = React.useRef(null);
    const upload = React.useRef(null);
    const [files, setfiles] = useState([]);
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
                ></Button>
                {/* &nbsp;
                <Button
                    onClick={(e) => {
                        e.preventDefault();
                        handleClear();
                    }}
                    label="Clear"
                ></Button> */}
            </>
        );
    };

    const onFileChange = async (e) => {
        e.preventDefault();
        setloading(true);
        await getBase64(e.target.files[0]);
        setloading(false);
    };

    async function getBase64(file) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            if (!files.some((file) => file?.fileBase64 === reader.result)) {
                let newfiles = JSON.parse(JSON.stringify(files));
                const filetype = file.type.split("/");
                newfiles.push({ fileBase64: reader.result, fileName: file.name, fileSize: file.size, fileExtension: `.${filetype[1]}` });
                setImgBase64(reader.result)
                // newfiles.push({ fileBase64: reader.result});
                setfiles(newfiles);
            }
        };
    }

    const handleRemove = (b64) => {
        let newArr = files.filter((file) => JSON.stringify(file?.fileBase64) !== JSON.stringify(b64));
        setfiles(newArr);
    };

    // const handleChange = (b64, desc) => {
    //     let idx = files.findIndex((file) => JSON.stringify(file?.fileBase64) === JSON.stringify(b64));
    //     let newArr = JSON.parse(JSON.stringify(files));
    //     newArr[idx].filedescr = desc;
    //     setfiles(newArr);
    // };

    const handleClear = () => {
        setfiles([]);
    };

    useEffect(() => {
        handleImages(imgBase64);
    }, [files, handleImages]);

    return (
        <Panel  header={header}>
            <Toast ref={toastBC} position="bottom-center" />

            <div className="formgrid grid ">
                {files.length ? (
                    files.map((file,i) => (
                        <React.Fragment key={i}>
                            <div className="field col-12 md:col-3" key={file?.fileBase64}>
                                {file?.fileExtension === ".png" || file?.fileExtension === ".jpeg" ? (
                                    <img src={file?.fileBase64} width="60px" alt="img" />
                                ) : (
                                    <Button
                                        icon={file?.fileExtension === ".pdf" ? "pi pi-file-pdf" : "pi pi-file-excel"}
                                        onClick={(e) => {
                                            e.preventDefault();
                                        }}
                                        tooltip={file?.fileExtension === ".pdf" ? "PDF file" : "EXCEL file"}
                                    />
                                )}
                            </div>
                            {/* <div className="field col-12 md:col-5 mt-2">
                                <p>{file?.fileName}</p>
                            </div> */}
                            <div className="field col-12 md:col-3 mt-2 d-flex justify-content-end">
                                <Badge value={(file?.fileSize / (1024 * 1024)).toFixed(2) + " MB"} />
                            </div>
                            <div className="field col-12 md:col-1">
                                <Button
                                    className="p-button-danger p-button-outlined p-button-sm"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleRemove(file?.fileBase64);
                                    }}
                                >
                                    <i className="pi pi-trash "></i>
                                </Button>
                            </div>

                            {/* <InputTextarea value={file?.filedescr} placeholder="Description" onChange={(e) => handleChange(file?.fileBase64, e.target.value)} /> */}
                            </React.Fragment>
                    ))
                ) : (
                    <center style={{ height: "3vh" }}>{/* <h6 className="image-placeholder">Please Upload Images</h6> */}</center>
                )}
                {loading && <h5>Loading</h5>}
            </div>
        </Panel>
    );
}

export default ImagesUpload;
