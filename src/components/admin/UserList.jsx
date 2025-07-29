
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { ENDPOINTS } from "../../config";
// import "../../css/UserList.css";

// function UserList() {
//     const [users, setUsers] = useState([]);
//     const navigate = useNavigate();
//     const currentUser = JSON.parse(localStorage.getItem("user")); // ຜູ້ໃຊ້ທີ່ລ໋ອກອິນຢູ່

//     // ໂຫລດຂໍ້ມູນຜູ້ໃຊ້
//     useEffect(() => {
//         fetchUsers();
//     }, []);

//     const fetchUsers = async () => {
//         try {
//             const bodyData = {
//                 db_type: "mysql",
//                 store_code: "user_privacy",
//                 field_list: "*",
//                 where: "*",
//             };
//             console.log("🔄 ກຳລັງດຶງລາຍຊື່ຜູ້ໃຊ້:", bodyData);
//             const result = await axios.post(ENDPOINTS.FETCH, bodyData);
//             console.log("✅ ດຶງຂໍ້ມູນສຳເລັດ:", result.data);
//             setUsers(result.data.data || []);
//         } catch (error) {
//             console.error("❌ ດຶງຂໍ້ມູນຜູ້ໃຊ້ຜິດພາດ:", error.response || error);
//         }
//     };

//     // ປ່ຽນບົດບາດ
//     const toggleRole = async (user) => {
//         const newRole = user.user_role === "admin" ? "staff" : "admin";
//         if (!window.confirm(`ຢືນຢັນການປ່ຽນບົດບາດຂອງ ${user.user_name} ເປັນ ${newRole}?`)) return;

//         try {
//             const payload = {
//                 db_type: "mysql",
//                 store_code: "user_privacy",
//                 where: { user_id: user.user_id },
//                 set: { user_role: newRole },
//             };

//             console.log("🚀 ສົ່ງ payload ໄປ /edit:", payload);
//             const response = await axios.post(ENDPOINTS.EDIT, payload);
//             console.log("📥 ຕອບກັບຈາກ API /edit:", response.data);

//             if (
//                 response.data?.affectedRows > 0 ||
//                 (response.data?.message && response.data.message.toLowerCase().includes("edited"))
//             ) {
//                 alert(`✅ ປ່ຽນບົດບາດຂອງ ${user.user_name} ເປັນ ${newRole} ສຳເລັດ`);
//                 fetchUsers();
//             } else {
//                 alert("⚠️ ບໍ່ສາມາດປ່ຽນບົດບາດໄດ້: " + JSON.stringify(response.data));
//             }
//         } catch (error) {
//             console.error("❌ ຜິດພາດໃນການປ່ຽນບົດບາດ:", error.response || error);
//             alert("❌ ເກີດຜິດພາດ: " + (error.response?.data?.message || error.message));
//         }
//     };

//     // ລົບຜູ້ໃຊ້
//     const deleteUser = async (user) => {
//         console.log("Current Admin Data:", currentUser);
//         if (!window.confirm(`ຢືນຢັນການລົບຜູ້ໃຊ້ ${user.user_name}?`)) return;

//         try {
//             const payload = {
//                 db_type: "mysql",
//                 store_code: "user_privacy",
//                 where: { user_id: user.user_id },
//             };

//             console.log("🚀 ສົ່ງ payload ໄປ /delete:", payload);
//             const response = await axios.post(ENDPOINTS.DELETE, payload);
//             console.log("📥 ຕອບກັບຈາກ API /delete:", response.data);

//             if (
//                 response.data?.affectedRows > 0 ||
//                 (response.data?.message && response.data.message.toLowerCase().includes("deleted"))
//             ) {
            
//                 const formatDate = (date) => date.toISOString().slice(0, 19).replace('T', ' ');

//                 const logPayload = {
//                     db_type: "mysql",
//                     store_code: "user_activity_log",
//                     set: {
//                         action: `ລົບຜູ້ໃຊ້: ${user.user_name}`,
//                         performed_by: currentUser?.user_name || "Unknown",
//                         performed_role: currentUser?.user_role || "admin",  // เพิ่ม role
//                         target_user_id: user.user_id,  // ID ของ user ที่ถูกลบ
//                         performed_at: formatDate(new Date()),  // ฟอร์แมตเป็น DATETIME
//                     },
//                 };

//                 await axios.post(ENDPOINTS.CREATE, logPayload);


//                 alert(`🗑️ ລົບຜູ້ໃຊ້ ${user.user_name} ສຳເລັດ`);
//                 fetchUsers();
//             } else {
//                 alert("⚠️ ບໍ່ສາມາດລົບຜູ້ໃຊ້ໄດ້: " + JSON.stringify(response.data));
//             }
//         } catch (error) {
//             console.error("❌ ຜິດພາດໃນການລົບຜູ້ໃຊ້:", error.response || error);
//             alert("❌ ເກີດຜິດພາດ: " + (error.response?.data?.message || error.message));
//         }
//     };

//     return (
//         <div className="user-list-container noto-sans-lao">
//             <h2>📋 ລາຍຊື່ຜູ້ໃຊ້ງານ</h2>
//             <button
//                 className="add-user-btn"
//                 onClick={() => navigate("/admin/register")}
//             >
//                 ➕ ເພີ່ມຜູ້ໃຊ້ໃໝ່
//             </button>
//             <table className="user-table">
//                 <thead>
//                     <tr>
//                         <th>ລະຫັດ</th>
//                         <th>ຊື່ຜູ້ໃຊ້</th>
//                         <th>ອີເມວ</th>
//                         <th>ບົດບາດ</th>
//                         <th>ເຄື່ອງມື</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {users.map((u, idx) => (
//                         <tr key={idx}>
//                             <td>{u.user_id}</td>
//                             <td>{u.user_name}</td>
//                             <td>{u.email}</td>
//                             <td>{u.user_role}</td>
//                             <td>
//                                 {u.user_id !== currentUser?.id && (
//                                     <>
//                                         <button
//                                             className="role-btn"
//                                             onClick={() => toggleRole(u)}
//                                         >
//                                             🔄 ປ່ຽນບົດບາດ
//                                         </button>
//                                         <button
//                                             className="delete-btn"
//                                             onClick={() => deleteUser(u)}
//                                         >
//                                             🗑️ ລົບ
//                                         </button>
//                                     </>
//                                 )}
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// }

// export default UserList;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ENDPOINTS } from "../../config";
import "../../css/UserList.css";

function UserList() {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem("user")); // ຜູ້ໃຊ້ທີ່ລ໋ອກອິນຢູ່

    useEffect(() => {
        fetchUsers();
    }, []);

    // ดึงข้อมูลผู้ใช้งาน
    const fetchUsers = async () => {
        try {
            const bodyData = {
                db_type: "mysql",
                store_code: "user_privacy",
                field_list: "*",
                where: "*",
            };
            console.log("🔄 ກຳລັງດຶງລາຍຊື່ຜູ້ໃຊ້:", bodyData);
            const result = await axios.post(ENDPOINTS.FETCH, bodyData);
            console.log("✅ ດຶງຂໍ້ມູນສຳເລັດ:", result.data);
            setUsers(result.data.data || []);
        } catch (error) {
            console.error("❌ ດຶງຂໍ້ມູນຜູ້ໃຊ້ຜິດພາດ:", error.response || error);
        }
    };

    // ฟังก์ชันฟอร์แมตเวลาเป็น YYYY-MM-DD HH:mm:ss
    const formatDate = (date) => {
        const pad = (n) => (n < 10 ? "0" + n : n);
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    };

    // เปลี่ยนบทบาทผู้ใช้งาน
    const toggleRole = async (user) => {
        const newRole = user.user_role === "admin" ? "staff" : "admin";
        if (!window.confirm(`ຢືນຢັນການປ່ຽນບົດບາດຂອງ ${user.user_name} ເປັນ ${newRole}?`)) return;

        try {
            const payload = {
                db_type: "mysql",
                store_code: "user_privacy",
                where: { user_id: user.user_id },
                set: { user_role: newRole },
            };

            console.log("🚀 ສົ່ງ payload ໄປ /edit:", payload);
            const response = await axios.post(ENDPOINTS.EDIT, payload);
            console.log("📥 ຕອບກັບຈາກ API /edit:", response.data);

            if (
                response.data?.affectedRows > 0 ||
                (response.data?.message && response.data.message.toLowerCase().includes("edited"))
            ) {
                alert(`✅ ປ່ຽນບົດບາດຂອງ ${user.user_name} ເປັນ ${newRole} ສຳເລັດ`);
                fetchUsers();
            } else {
                alert("⚠️ ບໍ່ສາມາດປ່ຽນບົດບາດໄດ້: " + JSON.stringify(response.data));
            }
        } catch (error) {
            console.error("❌ ຜິດພາດໃນການປ່ຽນບົດບາດ:", error.response || error);
            alert("❌ ເກີດຜິດພາດ: " + (error.response?.data?.message || error.message));
        }
    };

    // ลบผู้ใช้งาน
    const deleteUser = async (user) => {
        console.log("Current Admin Data:", currentUser);
        if (!window.confirm(`ຢືນຢັນການລົບຜູ້ໃຊ້ ${user.user_name}?`)) return;

        try {
            const payload = {
                db_type: "mysql",
                store_code: "user_privacy",
                where: { user_id: user.user_id },
            };

            console.log("🚀 ສົ່ງ payload ໄປ /delete:", payload);
            const response = await axios.post(ENDPOINTS.DELETE, payload);
            console.log("📥 ຕອບກັບຈາກ API /delete:", response.data);

            if (
                response.data?.affectedRows > 0 ||
                (response.data?.message && response.data.message.toLowerCase().includes("deleted"))
            ) {
                // Log การลบ
                const logPayload = {
                    db_type: "mysql",
                    store_code: "user_activity_log",
                    set: {
                        action: `ລົບຜູ້ໃຊ້: ${user.user_name}`,
                        performed_by: currentUser?.name || "Unknown",
                        performed_role: currentUser?.role || "admin",
                        target_user_id: user.user_id,
                        performed_at: formatDate(new Date()),
                    },
                };

                await axios.post(ENDPOINTS.CREATE, logPayload);

                alert(`🗑️ ລົບຜູ້ໃຊ້ ${user.user_name} ສຳເລັດ`);
                fetchUsers();
            } else {
                alert("⚠️ ບໍ່ສາມາດລົບຜູ້ໃຊ້ໄດ້: " + JSON.stringify(response.data));
            }
        } catch (error) {
            console.error("❌ ຜິດພາດໃນການລົບຜູ້ໃຊ້:", error.response || error);
            alert("❌ ເກີດຜິດພາດ: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="user-list-container noto-sans-lao">
            <h2>📋 ລາຍຊື່ຜູ້ໃຊ້ງານ</h2>
            <button
                className="add-user-btn"
                onClick={() => navigate("/admin/register")}
            >
                ➕ ເພີ່ມຜູ້ໃຊ້ໃໝ່
            </button>
            <table className="user-table">
                <thead>
                    <tr>
                        <th>ລະຫັດ</th>
                        <th>ຊື່ຜູ້ໃຊ້</th>
                        <th>ອີເມວ</th>
                        <th>ບົດບາດ</th>
                        <th>ເຄື່ອງມື</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u, idx) => (
                        <tr key={idx}>
                            <td>{u.user_id}</td>
                            <td>{u.user_name}</td>
                            <td>{u.email}</td>
                            <td>{u.user_role}</td>
                            <td>
                                {u.user_id !== currentUser?.id && (
                                    <>
                                        <button
                                            className="role-btn"
                                            onClick={() => toggleRole(u)}
                                        >
                                            🔄 ປ່ຽນບົດບາດ
                                        </button>
                                        <button
                                            className="delete-btn"
                                            onClick={() => deleteUser(u)}
                                        >
                                            🗑️ ລົບ
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default UserList;
