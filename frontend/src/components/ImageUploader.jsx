// ImageUploader.jsx
// Pick a bucket (maps or tokens) and upload an image. That's it.
// General-purpose — reusable for any feature that needs image uploads.

import { useState } from "react";
import { uploadImage } from "../services/vttStorage";   // CHANGED: dropped getSignedUrl import

// CHANGED: no more onSetBackground prop — that's the picker's job
function ImageUploader() {
    const [bucket, setBucket] = useState("maps");
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");

    // REMOVED: lastUpload state — uploader doesn't need to remember what it uploaded

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        setError("");
        try {
            await uploadImage(bucket, file);    // CHANGED: don't capture the returned path anymore
            setFile(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    // REMOVED: handleSetBackground handler — moved out of this component

    return (
        <div>
            <h2>Image Uploader</h2>

            <label htmlFor="bucket-picker">Bucket: </label>
            <select
                id="bucket-picker"
                value={bucket}
                onChange={(e) => setBucket(e.target.value)}
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
                onClick={handleUpload}
                disabled={!file || uploading}
                style={{ marginTop: "8px" }}
            >
                {uploading ? "Uploading..." : "Upload"}
            </button>

            {/* REMOVED: the "Set as background" button block */}

            {error && (
                <p style={{ color: "red", marginTop: "8px" }}>
                    {error}
                </p>
            )}
        </div>
    );
}

export default ImageUploader;