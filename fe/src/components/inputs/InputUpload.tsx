import React, { use, useEffect } from "react";
import styles from "./input.module.css";
import UploadFile from "@/components/icons/UploadFile";
import { XMarkIcon } from "@heroicons/react/24/outline";


import toast from "react-hot-toast";
import { readPlate } from "@/services/api";
//import bytesToSizeConverter from "@/utils/bytesToSizeConverter";

interface IFile {
  onOutput: (licensePlate: string) => void;
}

function InputUpload({ onOutput }: IFile) {
  //States
  const [files, setFiles] = React.useState<any>([]);
  const [isDraggedOn, setIsDraggedOn] = React.useState(false);

  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);

  //Handlers
  const handleDragOver = (e: any) => {
    e.preventDefault();
    setIsDraggedOn(true);
  };
  const handleLeaveDragOver = (e: any) => {
    e.preventDefault();
    setIsDraggedOn(false);
  };
  const handleDrop = (event: any) => {
    event.preventDefault();
    setIsDraggedOn(false);
    //Only allow PDFS and DOCX
    const newFiles = Array.from(event.dataTransfer.files).filter(
      (file: any) =>
        file.type === "application/pdf" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    setFiles((prevFiles: any) => [...prevFiles, ...newFiles]);
  };
  const handleSelectFile = (event: any) => {
    //Open select dialog
    event.preventDefault();
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.docx,.doc,.jpg,.jpeg,.png";
    input.multiple = true;
    input.click();
    input.onchange = (e: any) => {
      const newFiles = Array.from(e.target.files).filter(
        (file: any) =>
          file.type === "application/pdf" ||
          file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
          file.type === "application/msword" ||
          file.type === "image/jpeg" ||
          file.type === "image/jpg"  ||
          file.type === "image/png"

      );
      setFiles((prevFiles: any) => [...prevFiles, ...newFiles]);
    };
  };
  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles: any) =>
      prevFiles.filter((_: any, i: any) => i !== index)
    );
  };
  const handleUploadFiles = async () => {
    setIsLoading(true);
    const loadToast = toast.loading("Carga del archivo en curso");
    const call = await readPlate(files);
    //console.log(call.results[0].plate);
    
    
    if (call.results.length > 0) {
      setIsLoaded(true);
      toast.dismiss(loadToast);
      toast.success("Archivo cargado correctamente");
      onOutput(call.results[0].plate);
    } else {
      toast.dismiss(loadToast);
      setIsLoaded(true);
      toast.error("Error al cargar el archivo");
    }
  };

  //Effects

  useEffect(() => {
    //console.log(files)
  }, [files]);

  return (
    <div className={styles.containerUpload}>
      <div className={styles.topContainer}>
        <p>Cargar foto parte trasera (placa) </p>
      </div>

      <div
        className={`${styles.uploadArea} ${
          isDraggedOn ? styles.uploadAreaDrag : ""
        }`}
        onDragOverCapture={handleDragOver}
        onDragLeaveCapture={handleLeaveDragOver}
        onDrop={handleDrop}
        onClick={handleSelectFile}
      >
        <UploadFile />
        {/* <p className={styles.textUpload}>
          Trascina oppure <span>seleziona un file</span> per caricarlo{" "}
        </p> */}
        <p className={styles.textUploadFormat}>
          Seleccionar foto carro/placa
        </p>
      </div>

      {files.length > 0 &&
        files.map((file: any, index: number) => (
          <CardFile
            key={index}
            data={file}
            isLoading={isLoading}
            isLoaded={isLoaded}
            handleRemove={() => {
              handleRemoveFile(index);
            }}
          />
        ))}

      <div className={styles.controllers}>
        {
          files.length > 0 ?
          <div onClick={handleUploadFiles} className={styles.button2}>
            Cargar
          </div> :
          <div className={styles.button2Disabled}>
            Cargar
          </div>
        }
      </div>
    </div>
  );
}

export default InputUpload;

function CardFile(props: {
  data: any;
  handleRemove: () => void;
  isLoading: boolean;
  isLoaded: boolean;
}) {

  console.log(props.data)
  return (
    <div className={styles.uploadedFile}>
      <div className={styles.data}>
        <div className={styles.info}>
          {/* {
            props.data.type === "application/pdf" ? 
            <img src="/images/pdf_logo.png" alt="" /> : 
            <img  src="/images/docx_logo.webp" alt="" />
          } */}
          
          <div className={styles.file}>
            <p>{props.data.name}</p>
            <div>
              <p>{/* bytesToSizeConverter(props.data.size) */}</p>-
              <p> size </p>
            </div>
          </div>
        </div>
        <XMarkIcon onClick={props.handleRemove} className={styles.x} />
      </div>
      {!props.isLoading && !props.isLoaded && (
        <div className={styles.loading}></div>
      )}
      {props.isLoading && !props.isLoaded && (
        <div className={styles.loader}>
          <div className={styles.loaderBar}></div>
        </div>
      )}
    </div>
  );
}
