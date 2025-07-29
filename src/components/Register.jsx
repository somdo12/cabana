import React, { useState } from "react";
import Axios from "axios";
import { FaCoffee } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ENDPOINTS } from "../config"; // ✅ ใช้ ENDPOINTS
import { HOSTNAME } from "../config";

import "../css/register.css";

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        // password: "", ບ່ອນນີ້1
        secretword: ""
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
                store_code: "user_privacy",
                set: {
                    email: formData.email,
                    user_name: formData.name,
                    // secretword: formData.password,
                    secretword: formData.secretword,
                    user_role: "staff", // ให้ default เป็น staff
                },
            };
            // const result = await Axios.post(ENDPOINTS.CREATE, bodyData);
            const result = await Axios.post(`http://${HOSTNAME}:5000/v1/auth/sign-up`, bodyData);
            
            
            
            console.log("เพิ่มผู้ใช้สำเร็จ:", result.data);
            

            // ✅ บันทึก Log
            const logPayload = {
                db_type: "mysql",
                store_code: "user_activity_log",
                set: {
                    action: `ເພີ່ມຜູ້ໃຊ້: ${formData.name}`,
                    performed_by: currentUser?.name || "System",
                    performed_at: new Date().toISOString(),
                    performed_role: currentUser?.role,
                    target_user_id: currentUser?.id,
                },
            };
            await Axios.post(ENDPOINTS.CREATE, logPayload);
            



            alert("ລົງທະບຽນສຳເລັດແລ້ວ!");

            // setFormData({ name: "", email: "", password: "" });
            setFormData({ name: "", email: "", secretword: "" });
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
                    name="name"
                    placeholder="ຊື່-ນາມສະກຸນ"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />

                <input
                    type="email"
                    name="email"
                    placeholder="ອີເມວ"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <input
                    type="password"
                    // name="password" ບ່ອນ3
                    name="secretword"
                    placeholder="ລະຫັດຜ່ານ"
                    // value={formData.password} ບ່ອນ2
                    value={formData.secretword}
                    onChange={handleChange}
                    required
                />

                <button type="submit">ລົງທະບຽນ</button>
            </form>
        </div>
    );
};

export default RegisterForm;

// ໃຊ້ງານໄດ້ ມື້ຄືນີນີ້ 24/4/2025

//  import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { HOSTNAME } from "../config";


// // import "../css/RegisterForm.css"; 

// function Register() {
//     const [formData, setFormData] = useState({
//         user_name: "",
//         email: "",
//         secretword: ""
//     });

//     const navigate = useNavigate();

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const payload = {
//                 db_type: "mysql",
//                 store_code: "user_privacy",
//                 set: formData
//             };

//             await axios.post(`http://${HOSTNAME}:5000/v1/auth/sign-up`, payload);

//             alert("✅ เพิ่มผู้ใช้สำเร็จ");
//             navigate("/admin/users"); 

//         } catch (error) {
//             console.error("❌ เพิ่มผู้ใช้ล้มเหลว:", error);
//         }
//     };

//     return (
//         <div className="register-container">
//             <h2>📝 ລົງທະບຽນຜູ້ໃຊ້ໃໝ່</h2>
//             <form onSubmit={handleSubmit} className="register-form">
//                 <label>ຊື່ຜູ້ໃຊ້</label>
//                 <input
//                     type="text"
//                     name="user_name"
//                     value={formData.user_name}
//                     onChange={handleChange}
//                     required
//                 />
//                 <label>ອີເມວ</label>
//                 <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     required
//                 />
//                 <label>ລະຫັດຜ່ານ</label>
//                 <input
//                     type="password"
//                     name="secretword"
//                     value={formData.secretword}
//                     onChange={handleChange}
//                     required
//                 />
//                 <button type="submit">✅ ບັນທຶກ</button>
//             </form>
//         </div>
//     );
// }

// export default Register;  