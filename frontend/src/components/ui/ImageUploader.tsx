import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { API_CONFIG } from "../../config/api";
import styles from "./ImageUploader.module.css";

interface ImageUploaderProps {
  onUploadSuccess?: (images: UploadedImage[]) => void;
  onUploadError?: (error: string) => void;
  maxFiles?: number;
  accept?: string;
}

export interface UploadedImage {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export default function ImageUploader({
  onUploadSuccess,
  onUploadError,
  maxFiles = 5,
  accept = "image/jpeg,image/jpg,image/png,image/webp,image/gif",
}: ImageUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [debugInfo, setDebugInfo] = useState<string>("");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const remaining = maxFiles - files.length;
    const newFiles = acceptedFiles.slice(0, remaining);

    setFiles((prev) => [...prev, ...newFiles]);
    setPreviews((prev) => [
      ...prev,
      ...newFiles.map((file) => URL.createObjectURL(file)),
    ]);
  }, [files.length, maxFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept.split(",").reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxFiles,
    maxSize: 20 * 1024 * 1024,
  });

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      onUploadError?.("Please select at least one image.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      onUploadError?.("Please sign in to upload images.");
      return;
    }

    setUploading(true);
    setDebugInfo("");

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("images", file);
      });

      const url = `${API_CONFIG.BASE_URL}/uploads/multiple`;
      setDebugInfo(`🔍 URL: ${url}`);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const responseText = await response.text();
      setDebugInfo((prev) =>
        prev +
        `\n\nStatus: ${response.status}\n\nResponse:\n${responseText.slice(0, 500)}`
      );

      if (!response.ok) {
        throw new Error(responseText || "Upload failed.");
      }

      const data = JSON.parse(responseText);
      setUploadedImages(data.data);
      onUploadSuccess?.(data.data);

      setFiles([]);
      setPreviews((prev) => {
        prev.forEach((url) => URL.revokeObjectURL(url));
        return [];
      });
    } catch (error) {
      setDebugInfo((prev) =>
        prev +
        `\n\n❌ Error: ${error instanceof Error ? error.message : String(error)}`
      );
      onUploadError?.(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div {...getRootProps()} className={`${styles.dropzone} ${isDragActive ? styles.active : ""}`}>
        <input {...getInputProps()} />
        <div className={styles.dropzoneContent}>
          <span className={styles.icon}>📸</span>
          <p>{isDragActive ? "Drop your images here..." : "Drag & drop images here, or click to select"}</p>
          <span className={styles.hint}>Up to {maxFiles} images • Max 20MB each</span>
        </div>
      </div>

      {previews.length > 0 && (
        <div className={styles.previews}>
          <h4 className={styles.previewsTitle}>Selected Images ({previews.length})</h4>
          <div className={styles.previewGrid}>
            {previews.map((preview, index) => (
              <div key={index} className={styles.previewItem}>
                <img src={preview} alt={`Preview ${index + 1}`} />
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => removeFile(index)}
                  disabled={uploading}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            className={styles.uploadButton}
            onClick={handleUpload}
            disabled={uploading || files.length === 0}
          >
            {uploading ? "Uploading..." : `Upload ${files.length} Image${files.length > 1 ? "s" : ""}`}
          </button>
        </div>
      )}

      {debugInfo && (
        <div
          style={{
            marginTop: "20px",
            padding: "12px",
            background: "#f5f5f5",
            border: "1px solid #ddd",
            borderRadius: "8px",
            whiteSpace: "pre-wrap",
            fontFamily: "monospace",
            fontSize: "12px",
            color: "#222",
          }}
        >
          <strong>Debug Information</strong>
          <br />
          <br />
          {debugInfo}
        </div>
      )}

      {uploadedImages.length > 0 && (
        <div className={styles.success}>
          <p>✅ {uploadedImages.length} image{uploadedImages.length > 1 ? "s" : ""} uploaded successfully!</p>
        </div>
      )}
    </div>
  );
}