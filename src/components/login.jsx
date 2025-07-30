

import React, { useState } from 'react';
import '../css/login.css';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
// import { API_BASE_URL } from '../config';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await checkAccount();
    };
    const checkAccount = async () => {
        try {
            const uri = `http://${window.location.hostname}:5000/v1/auth/sign-in`;

            const bodyData = {
                db_type: "mysql",
                store_code: "user_auth", // ⚠️ ตรวจอีกทีว่าตรงกับ backend จริงหรือเปล่า
                where: {
                    user_email: email,
                    user_password: password
                }
            };

            const headers = { "Content-Type": "application/json" };

            // 🔍 DEBUG: ดูค่าที่จะส่งไป
            console.log("🚀 Sending Login Request");
            console.log("URI:", uri);
            console.log("Body Data:", bodyData);

            // 🔥 ส่ง request
            const result = await Axios.post(uri, bodyData, { headers });

            // 🔍 DEBUG: ดูผลลัพธ์ที่ได้จาก backend
            console.log("✅ Response from API:", result);

            const user = result.data.data;
            console.log("👤 Extracted User:", user);

            if (user) {
                const userData = {
                    id: user.user_id,
                    name: user.user_name,
                    role: user.user_role,
                    // status: user.user_status_id
                };

                // 🗃️ บันทึกลง localStorage
                localStorage.setItem("user", JSON.stringify(userData));
                localStorage.setItem("userRole", user.user_role);
                localStorage.setItem("user_id", user.user_id);

                console.log("🎯 Logged in as:", user.user_role);

                // 🔀 เปลี่ยนหน้าตาม role
                if (user.user_role === "admin" || user.user_role === "staff") {
                    navigate("/admin/dashboard");
                } else {
                    navigate("/menu");
                }
            } else {
                console.warn("❌ User not found or invalid credentials.");
                alert("📛 ອີເມວ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ!");
            }
        } catch (error) {
            console.error("🔥 Login Error:", error);

            // ลอง log เพิ่มเติมจาก response ถ้ามี
            if (error.response) {
                console.error("🔎 API Response Error:", error.response.data);
            }

            alert("❌ ລະບົບຂັດຂ້ອງ");
        }
    };


    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2 className="login-title">ເຂົ້າລະບົບເຂົ້າສູ່ Cabana</h2>

                <label>ອີເມວ</label>
                <input
                    type="email"
                    placeholder="ໃສ່ອີເມວ"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <label>ລະຫັດຜ່ານ</label>
                <div className="password-wrapper">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="ໃສ່ລະຫັດຜ່ານ"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        className="toggle-button"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? "ເຊື່ອງລະຫັດ" : "ເບິ່ງລະຫັດ"}
                    </button>
                </div>

                <button type="submit" className="login-btn">ເຂົ້າລະບົບ</button>
            </form>
        </div>
    );
};

export default Login;
