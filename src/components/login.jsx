
// import React, { useState } from 'react';
// import '../css/login.css';
// import { useNavigate } from 'react-router-dom';
// import Axios from 'axios';

// const Login = () => {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [showPassword, setShowPassword] = useState(false);
//     const navigate = useNavigate();

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         await checkAccount();
//     };

//     const checkAccount = async () => {
//         try {
//             const uri = "http://localhost:5000/v1/auth/sign-in";
//             const bodyData = {
//                 db_type: "mysql",
//                 store_code: "user_privacy",
//                 where: {
//                     email,
//                     secretword: password
//                 }
//             };
//             const headers = { "Content-Type": "application/json" };

//             const result = await Axios.post(uri, bodyData, { headers });
//             const user = result.data?.data?.[0];

//             if (user) {
//                 const userData = {
//                     id: user.user_id,
//                     name: user.user_name,
//                     role: user.user_role,
//                     status: user.user_status_id
//                 };

//                 localStorage.setItem("user", JSON.stringify(userData));
//                 localStorage.setItem("userRole", user.user_role);
//                 localStorage.setItem("user_id", user.user_id);

//                 if (user.user_role === "admin" || user.user_role === "staff") {
//                     navigate("/admin/dashboard");
//                 } else {
//                     navigate("/menu");
//                 }
//             } else {
//                 alert("📛 ອີເມວ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ!");
//             }
//         } catch (error) {
//             console.error("Login Error:", error);
//             alert("❌ ລະບົບຂັດຂ້ອງ");
//         }
//     };

//     return (
//         <div className="login-container">
//             <form onSubmit={handleSubmit} className="login-form">
//                 <h2 className="login-title">ເຂົ້າລະບົບເຂົ້າສູ່ Cabana</h2>

//                 <label>ອີເມວ</label>
//                 <input
//                     type="email"
//                     placeholder="ໃສ່ອີເມວ"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                 />

//                 <label>ລະຫັດຜ່ານ</label>
//                 <div className="password-wrapper">
//                     <input
//                         type={showPassword ? "text" : "password"}
//                         placeholder="ໃສ່ລະຫັດຜ່ານ"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         required
//                     />
//                     <button
//                         type="button"
//                         className="toggle-button"
//                         onClick={() => setShowPassword(!showPassword)}
//                     >
//                         {showPassword ? "ເຊື່ອງລະຫັດ" : "ເບິ່ງລະຫັດ"}
//                     </button>
//                 </div>

//                 <button type="submit" className="login-btn">ເຂົ້າລະບົບ</button>
//             </form>
//         </div>
//     );
// };

// export default Login;

import React, { useState } from 'react';
import '../css/login.css';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';

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
            const uri = "http://localhost:5000/v1/auth/sign-in";
            const bodyData = {
                db_type: "mysql",
                store_code: "user_privacy",
                where: {
                    email,
                    secretword: password
                }
            };
            const headers = { "Content-Type": "application/json" };

            const result = await Axios.post(uri, bodyData, { headers });
            const user = result.data?.data?.[0];

            if (user) {
                const userData = {
                    id: user.user_id,
                    name: user.user_name,
                    role: user.user_role,
                    status: user.user_status_id
                };

                // เก็บข้อมูลผู้ใช้ลง localStorage
                localStorage.setItem("user", JSON.stringify(userData));
                localStorage.setItem("userRole", user.user_role);
                localStorage.setItem("user_id", user.user_id);

                // Redirect ตาม role
                if (user.user_role === "admin" || user.user_role === "staff") {
                    navigate("/admin/dashboard");
                } else {
                    navigate("/menu");
                }
            } else {
                alert("📛 ອີເມວ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ!");
            }
        } catch (error) {
            console.error("Login Error:", error);
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
