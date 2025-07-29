import React, { useState } from 'react';
import axios from 'axios';

function ImageUploader() {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0] || null);
        setResult(null);
        setError(null);
    };

    const handleUpload = async () => {
        if (!file) {
            setError('Please select an image first.');
            return;
        }

        setUploading(true);
        setError(null);
        setResult(null);

        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await axios.post(
                'http://localhost:5000/v1/upload/image/local',
                formData,
                {
                    headers: {
                        'x_z_token': 'test',
                    }
                }
            );

            console.log('response : ', response.data);

            setResult(response.data);
        } catch (err) {
            // err.response?.data อาจเก็บข้อมูล error จาก backend
            console.error(err);
            const message =
                err.response?.data?.message || err.message || 'Something went wrong';
            setError(message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: '0 auto' }}>
            <h2>Upload Image</h2>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <br />
            <button onClick={handleUpload} disabled={uploading || !file}>
                {uploading ? 'Uploading...' : 'Upload'}
            </button>

            {error && <p style={{ color: 'red' }}>❌ {error}</p>}

            {result && (
                <div style={{ marginTop: 20 }}>
                    <p>✅ Upload successful!</p>
                    <p><strong>File name:</strong> {result.data.name}</p>
                    <p><strong>Path:</strong> {result.data.path}</p>
                    {/* ถ้า server เปิดให้เข้าถึงไฟล์ได้ */}
                    <img
                        src={`http://localhost:5000${result.data.path}`}
                        alt="Uploaded"
                        style={{ maxWidth: '100%', marginTop: 10 }}
                    />
                </div>
            )}
        </div>
    );
}

export default ImageUploader;