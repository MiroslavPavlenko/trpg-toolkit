import { useState } from "react";
import { uploadImage } from "../services/vttStorage";

function ImageUploader() {
  const [bucket, setBucket] = useState<"maps" | "tokens">("maps");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      await uploadImage(bucket, file);
      setFile(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h2>Image Uploader</h2>

      <label htmlFor="bucket-picker">Bucket: </label>
      <select
        id="bucket-picker"
        value={bucket}
        onChange={(e) => setBucket(e.target.value as "maps" | "tokens")}
        disabled={uploading}
      >
        <option value="maps">Maps</option>
        <option value="tokens">Tokens</option>
      </select>

      <div style={{ marginTop: "12px" }}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          disabled={uploading}
        />
      </div>

      {file && (
        <p style={{ marginTop: "8px" }}>
          Selected: {file.name} ({Math.round(file.size / 1024)} KB)
        </p>
      )}

      <button
        onClick={() => {
          void handleUpload();
        }}
        disabled={!file || uploading}
        style={{ marginTop: "8px" }}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {error && <p style={{ color: "red", marginTop: "8px" }}>{error}</p>}
    </div>
  );
}

export default ImageUploader;
