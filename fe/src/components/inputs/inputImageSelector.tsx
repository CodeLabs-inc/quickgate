import React from "react";
import styles from "./input.module.css";
import { PhotoIcon } from "@heroicons/react/24/outline";

interface InputSelectProps {
  label?: string;
  image?: string; //if the image is already uploaded is gonna be passed as a url string here
  onUpload: (file: File) => any;
}

function InputImage({ label, image, onUpload }: InputSelectProps) {
  //states
  const [file, setFile] = React.useState<File | null>(null);

  //handlers
  const handleSelectFile = () => {
    const input = document.createElement("input");
    input.type = "file";
    //only accept png
    input.accept = ".png";
    input.click();

    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        setFile(files[0]);
      }
    };
  };

  return (
    <div className={styles.imageComponent}>
      {label && <p>{label}</p>}
      <div onClick={handleSelectFile} className={styles.containerImage}>
        <div className={styles.text}>Select picture</div>
        <PhotoIcon style={{ width: "20px", color: "rgba(255, 255, 255, 0.55)" }} />
      </div>

      <div className={styles.previewContainer}>

        {
          !file &&
          image && 
          image != "" ?
          <img
            src={image}
            className={styles.imagePreview}
            alt="Preview"
          /> 
          :
          !file ? (
            <p>Preview</p>
          ) : (
            <img
              src={URL.createObjectURL(file)}
              className={styles.imagePreview}
              alt="Preview"
            />
          )
        }
        {
          file && 
          <div 
            onClick={()=> {
              if (file) {
                const call = onUpload(file);
                if (call){
                  setFile(null);
                }
              }
            }} 
            className={styles.buttonUpload}
          >
            Upload
          </div>
        }
      </div>
    </div>
  );
}

export default InputImage;
