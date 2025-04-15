"use client";
import { useState, useRef, useEffect } from "react";
import { UseFormSetValue } from "react-hook-form";
import { OfferFormData } from "@/types";

interface ImagesElementProps {
    setValue: UseFormSetValue<OfferFormData>;
  }

export default function InputFiles({
    setValue
  }: ImagesElementProps) {
  const [files, setFiles] = useState<File[]>([]);  
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    setValue("images", files);
  }, [files, setValue]);

  const handleFilesHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);

      setFiles((prevFiles) => [...prevFiles, ...newFiles]);

      const previews = newFiles.map((file) => {
        const reader = new FileReader();
        return new Promise<string>((resolve, reject) => {
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file); 
        });
      });

      Promise.all(previews)
        .then((results) => setImagePreviews(results))
        .catch((err) => console.error("Błąd przy odczycie plików", err));
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    const updatedFiles = files.filter((_, i) => i !== index);

    setImagePreviews(updatedPreviews); 
    setFiles(updatedFiles);

    if (fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      updatedFiles.forEach((file) => dataTransfer.items.add(file));
      fileInputRef.current.files = dataTransfer.files;
    }
  };

  return (
    <div className="images">
      <input
        type="file"
        name="images"
        accept="image/*"
        multiple
        onChange={handleFilesHandler}
        ref={fileInputRef}
      />

      <ul>
        {imagePreviews.map((preview, index) => (
          <li key={index}>
            <img
              src={preview}
              alt={`Podgląd obrazu ${index + 1}`}
              style={{ width: "100px", height: "100px" }}
            />
            <button onClick={() => handleRemoveImage(index)}>Usuń</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
