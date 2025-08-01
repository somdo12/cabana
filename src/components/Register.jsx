import React, { useState } from "react";
import Axios from "axios";
import { FaCoffee } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ENDPOINTS } from "../config"; // ✅ ใช้ ENDPOINTS
import { HOSTNAME } from "../config";

import "../css/register.css";

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        user_name: "",
        user_email: "",
        user_password: ""
    });

    const currentUser = JSON.parse(localStorage.getItem("user")); // แอดมิน/สตาฟที่ล็อกอิน
    const navigate = useNavigate();
    console.log("currentUser:", currentUser);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // ✅ เพิ่มผู้ใช้
            const bodyData = {
                db_type: "mysql",
                store_code: "user_auth",
                set: {
                    user_email: formData.user_email,
                    user_name: formData.user_name,
                
                    user_password: formData.user_password,
                    user_role: "staff",
                },
            };
            const result = await Axios.post(`http://${HOSTNAME}:5000/v1/auth/sign-up`, bodyData);
            console.log("เพิ่มผู้ใช้สำเร็จ:", result.data);
            
            const logPayload = {
                db_type: "mysql",
                store_code: "user_activity_log",
                set: {
                    action: `ເພີ່ມຜູ້ໃຊ້: ${formData.user_name}`,
                    performed_by: currentUser?.user_name || "System",
                    performed_at: new Date().toISOString(),
                    performed_role: currentUser?.role,
                    target_user_id: currentUser?.id,
                },
            };
            await Axios.post(ENDPOINTS.CREATE, logPayload);         
            alert("ລົງທະບຽນສຳເລັດແລ້ວ!");
            setFormData({ name: "", email: "", user_password: "" });
            navigate("/admin/users");
        } catch (error) {
            console.error("Error :", error);
            alert("❌ ບໍ່ສາມາດເພີ່ມຜູ້ໃຊ້ໄດ້");
        }
    };

    return (
        <div className="register-wrapper">
            <form onSubmit={handleSubmit} className="form-container">
                <FaCoffee />
                <h2>ລົງທະບຽນ</h2>
                <p>ລົງທະບຽນເພື່ອໃຊ້ບໍລິການກັບຮ້ານຂອງພວກເຮົາ</p>

                <input
                    type="text"
                    name="user_name"
                    placeholder="ຊື່-ນາມສະກຸນ"
                    value={formData.user_name}
                    onChange={handleChange}
                    required
                />

                <input
                    type="email"
                    name="user_email"
                    placeholder="ອີເມວ"
                    value={formData.user_email}
                    onChange={handleChange}
                    required
                />

                <input
                    type="password"
                
                    name="user_password"
                    placeholder="ລະຫັດຜ່ານ"            
                    value={formData.user_password}
                    onChange={handleChange}
                    required
                />

                <button type="submit">ລົງທະບຽນ</button>
            </form>
        </div>
    );
};

export default RegisterForm;

