import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
// import { Badge } from "primereact/badge";
import { Panel } from "primereact/panel";
import "./ImageUpload.css";
import { baseURL } from "../../utilities/Config";
import { toast } from "react-toastify";

function AddEditImage({ handleImages, editable, EditIconImage }) {
    // const picture = EditIconImage;
    const toastBC = React.useRef(null);
    const upload = React.useRef(null);
    const [files, setfiles] = useState();
    const [icon, setIcon] = useState(editable);
    const [imgBase64, setImgBase64] = useState("");
    const [loading, setloading] = useState(false);
    // console.log("image",EditIconImage, '    ',icon,'    ',files);
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
        for (var file of e.target.files) {
            if (!(file && file.type.match('image.*'))) {
                // Handle the selected image file
                console.log("Not image found");
                return;
            }
        }
        setloading(true);
        if (e.target.files[0]) await getBase64(e.target.files[0]);
        setloading(false);
    };

    async function getBase64(file) {
        var reader = new FileReader();
        reader.readAsDataURL(file);

        // const checkDimensions = (imgUrl, singleFile) => {

        //     const img = new Image();
        //     img.src = imgUrl;
        //     img.onload = () => {

        //         const width = img.naturalWidth;
        //         const height = img.naturalHeight;
        //         if ((width > 300 && width < 700) && (height > 300 && height < 700)) {
        //             setfiles(singleFile, imgUrl);
        //         } else {
        //             toast.warn(
        //                 `The image does not have the required resolution of width 300 to 700  and height 300 to 700. Please select a different image.`
        //             );
        //         };
        //     };


        // };
        // const setfiles = (singleFile, imgUrl) => {
        //     // Implement your logic to handle the files and imgUrl here
        //     console.log('setfiles function called with singleFile:', singleFile);
        //     console.log('Image URL:', imgUrl);
        // };
        reader.onload = function () {
            const fileDataUrl = reader.result;
            // if (!files.some((file) => file?.fileBase64 === reader.result)) {
            // let newfiles = JSON.parse(JSON.stringify(files));
            const filetype = file.type.split("/");
            let singleFile = ({ fileBase64: reader.result, fileName: file.name, fileSize: file.size, fileExtension: `.${filetype[1]}` });
            // newfiles.push({ fileBase64: reader.result, fileName: file.name, fileSize: file.size, fileExtension: `.${filetype[1]}` });
            setImgBase64(fileDataUrl)
            // newfiles.push({ fileBase64: reader.result});

            setfiles(singleFile, fileDataUrl);
            //checkDimensions(fileDataUrl, singleFile);
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
                                EditIconImage &&
                                <img src={`${baseURL}${EditIconImage}`} width="60px" alt="img" preview />
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
                                <img src={files?.fileBase64} width="60px" alt="img" preview />
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
