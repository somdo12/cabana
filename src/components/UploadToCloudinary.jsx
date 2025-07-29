// components/UploadToCloudinary.jsx
import React, { useState } from "react";
import axios from "axios";
import Cloudinaries from "./cloudinary";

const UploadToCloudinary = () => {
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState("");

    const handleUpload = async () => {
        if (!image) return alert("กรุณาเลือกรูปภาพ");

        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", "unsigned_menu"); // ต้องตั้ง upload preset ชื่อนี้ใน Cloudinary
        formData.append("folder", "menu"); // 👉 บอก Cloudinary ให้อัปโหลดไปที่โฟลเดอร์ menu
        const rawName = image.name.split(".")[0]; // เอาเฉพาะชื่อ ไม่เอานามสกุล
        formData.append("public_id", `${rawName}`);

        console.log(image);
        try {
            const res = await axios.post(
                "https://api.cloudinary.com/v1_1/dfxtpej7u/image/upload",
                formData
            );
            console.log("✅ Uploaded image:", res.data.secure_url);
            setImageUrl(res.data.secure_url);
        } catch (err) {
            console.error("❌ Upload failed:", err);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
            <button onClick={handleUpload}>📤 อัปโหลด</button>
            {imageUrl && (
                <div>
                    <p>🌐 รูปอัปโหลดแล้ว:</p>
                    <img src={imageUrl} alt="uploaded" width="200" />
                    <p>{imageUrl}</p>
                </div>
            )}
            <Cloudinaries imagename="menu/menu/955" />

        </div>
    );
};

export default UploadToCloudinary;
