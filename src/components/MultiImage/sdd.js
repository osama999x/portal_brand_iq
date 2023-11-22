
const fileList = event.target.files;
    const newImages = [];
    for(let i=0; i < fileList.length; i++){
        const filereader = new FileReader();
        filereader.readAsDataURL(fileList[i]);
        filereader.onload = (e) => {
            const img = new Image();
        img.src = e.target.result;

        img.onload = () => {
            if( ( img.width > 1500 && img.width < 1950 )  && (img.height > 480 && img.height < 752)){
                    newImages.push({
                        name: fileList[i].name,
                src: e.target.result,
                    });
            }else{
                alert(
                    `The image ${fileList[i].name} does not have the required resolution of 488x523. Please select a different image.`
                  );
            }
            setImages([...images, ...newImages]);
        };
        };
    };
