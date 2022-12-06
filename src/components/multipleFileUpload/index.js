import React, { useRef, useState, useEffect } from "react";
import { Toast } from "primereact/toast";
import { FileUpload } from "primereact/fileupload";

const MultipleFileUpload = ({handleImages, isMulti, heading, isConvert64}) => {
    const [allFiles, setAllFiles] = useState([]);
    const toast = useRef(null);
    const [imgBase64, setImgBase64] = useState([]);
    const onUpload = async ({ files }) => {

        if(isConvert64) {
            files.forEach(async (file) => {
                await getBase64(file);
                // getBase64(file).then((data) => {
                //     setAllFiles([...allFiles, data]);
                // });
            });
        } 
        // else {
        //     setAllFiles(files);
        // }
    };

    const getBase64 = (file) => {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            // if (!allFiles.some((file) => file?.fileBase64 === reader.result)) {
                let newfiles = JSON.parse(JSON.stringify(allFiles));
                const filetype = file.type.split("/");
                newfiles.push({ fileBase64: reader.result});

                // newfiles.push({ fileBase64: reader.result, fileName: file.name, fileSize: file.size, fileExtension: `.${filetype[1]}` });
                setImgBase64(reader.result)
                // newfiles.push({ fileBase64: reader.result});
                setAllFiles(newfiles);
            // }
        };
       
       
        // return new Promise((resolve, reject) => {
        //     const reader = new FileReader();
        //     reader.readAsDataURL(file);
        //     reader.onload = () => resolve(reader.result);
        //     reader.onerror = (error) => reject(error);
        // });
    };

    useEffect(() => {
        handleImages(allFiles);
    }, [allFiles,handleImages]);

    const handleChange = async (e) => {
        await getBase64(e.target.files[0]);
        // handleImages(allFiles);
       
    }
    return (
        <div>
            <Toast ref={toast}></Toast>

            {/* <div className="card"> */}
                {/* <h5>{heading}</h5> */}
                <FileUpload
                    auto
                    id="image"
                    name="images"
                    multiple
                    accept="image/*"
                    maxFileSize={1000000}
                    emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>}
                    customUpload={true}
                    // onSelect={(e)=>handleChange(e)}
                    uploadHandler={onUpload}
                    chooseLabel="Select Files"
                    mode={isMulti ? "advanced" : "basic"}
                />
            {/* </div> */}
        </div>
    );
};

export default MultipleFileUpload;
