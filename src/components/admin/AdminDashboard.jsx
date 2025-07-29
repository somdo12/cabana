// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import socket from "./socket-conn"; // <== เพิ่ม
// import { API_BASE_URL } from "../../config"; // <== เพิ่ม
// import "../../css/admin.css";
// import "../../css/AdminDashboard.css";

// function AdminDashboard() {
//     const [orderCount, setOrderCount] = useState(0);
//     const [salesTotal, setSalesTotal] = useState(0);
//     const [menuCount, setMenuCount] = useState(0);
//     const [userCount, setUserCount] = useState(0);

//     const user = JSON.parse(localStorage.getItem("user"));
//     const role = user?.role;

//     const fetchDashboardData = async () => {
//         try {
//             console.log("=== โหลดข้อมูล Dashboard ===");

//             // ดึงข้อมูลออเดอร์ทั้งหมด
//             const ordersRes = await axios.post(`${API_BASE_URL}/fetch`, {
//                 db_type: "mysql",
//                 store_code: "tb_order",
//                 field_list: "*",
//                 where: "*",
//             });

//             const orders = ordersRes.data.data || [];
//             const today = new Date().toISOString().slice(0, 10);

//             const todayOrders = orders.filter(order => {
//                 if (!order.order_date) return false;
//                 const orderDate = new Date(order.order_date);
//                 return !isNaN(orderDate) && orderDate.toISOString().slice(0, 10) === today;
//             });

//             setOrderCount(todayOrders.length);

//             const totalSales = todayOrders.reduce((sum, order) => sum + (parseFloat(order.total_price) || 0), 0);
//             setSalesTotal(totalSales);

//             // จำนวนเมนูทั้งหมด
//             const menuRes = await axios.post(`${API_BASE_URL}/fetch`, {
//                 db_type: "mysql",
//                 store_code: "tb_menu",
//                 field_list: "*",
//                 where: "*",
//             });
//             setMenuCount(menuRes.data.data.length || 0);

//             // จำนวนผู้ใช้งาน (เฉพาะ admin)
//             if (role === "admin") {
//                 const userRes = await axios.post(`${API_BASE_URL}/fetch`, {
//                     db_type: "mysql",
//                     store_code: "user_privacy",
//                     field_list: "*",
//                     where: "*",
//                 });
//                 setUserCount(userRes.data.data.length || 0);
//             }
//         } catch (error) {
//             console.error("Error fetching dashboard data:", error);
//         }
//     };

//     useEffect(() => {
//         fetchDashboardData();

//         // Real-time update when new order or payment status changes
//         socket.on("receive_new_order", () => {
//             console.log("🔄 Dashboard: มีออเดอร์ใหม่ อัปเดตข้อมูล...");
//             fetchDashboardData();
//         });

//         socket.on("receive_update_payment_status", () => {
//             console.log("🔄 Dashboard: สถานะการจ่ายเงินเปลี่ยน อัปเดตข้อมูล...");
//             fetchDashboardData();
//         });

//         return () => {
//             socket.off("receive_new_order");
//             socket.off("receive_update_payment_status");
//         };
//     }, [role]);

//     return (
//         <div className="admin-dashboard">
//             <h1 className="dashboard-title">☕ ໜ້າຫຼັກ Admin Dashboard</h1>
//             <p className="dashboard-subtitle">ยินดีต้อนรับเข้าสู่ระบบจัดการร้าน Cabana Cafe</p>

//             <div className="dashboard-cards">
//                 <div className="dashboard-card">
//                     <h3>📋 ออเดอร์วันนี้</h3>
//                     <p>{orderCount} ออเดอร์</p>
//                 </div>
//                 <div className="dashboard-card">
//                     <h3>💰 ยอดขายวันนี้</h3>
//                     <p>{salesTotal.toLocaleString()} ກີບ</p>
//                 </div>
//                 <div className="dashboard-card">
//                     <h3>🍽️ จำนวนเมนู</h3>
//                     <p>{menuCount} รายการ</p>
//                 </div>
//                 {role === "admin" && (
//                     <div className="dashboard-card">
//                         <h3>👤 ผู้ใช้งาน</h3>
//                         <p>{userCount} คน</p>
//                     </div>
//                 )}
//                 <div className="dashboard-card">
//                     <button 
//                         className="btn-queue"
//                         onClick={() => window.location.href = "/QRCode"}
//                     >
//                         🔗 ไปหน้าคิว QR Code
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default AdminDashboard;
import React, { useEffect, useState } from "react";
import axios from "axios";
import socket from "./socket-conn"; 
import { API_BASE_URL } from "../../config"; 
import "../../css/admin.css";
import "../../css/AdminDashboard.css";

function AdminDashboard() {
    const [orderCount, setOrderCount] = useState(0);
    const [salesTotal, setSalesTotal] = useState(0);
    const [menuCount, setMenuCount] = useState(0);
    const [userCount, setUserCount] = useState(0);

    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role;

    const fetchDashboardData = async () => {
        try {
            console.log("=== ກຳລັງໂຫຼດຂໍ້ມູນ Dashboard ===");

            // ດຶງຂໍ້ມູນອໍເດີທັງໝົດ
            const ordersRes = await axios.post(`${API_BASE_URL}/fetch`, {
                db_type: "mysql",
                store_code: "tb_order",
                field_list: "*",
                where: "*",
            });

            const orders = ordersRes.data.data || [];
            const today = new Date().toISOString().slice(0, 10);

            const todayOrders = orders.filter(order => {
                if (!order.order_date) return false;
                const orderDate = new Date(order.order_date);
                return !isNaN(orderDate) && orderDate.toISOString().slice(0, 10) === today;
            });

            setOrderCount(todayOrders.length);

            const totalSales = todayOrders.reduce((sum, order) => sum + (parseFloat(order.total_price) || 0), 0);
            setSalesTotal(totalSales);

            // ຈຳນວນເມນູທັງໝົດ
            const menuRes = await axios.post(`${API_BASE_URL}/fetch`, {
                db_type: "mysql",
                store_code: "tb_menu",
                field_list: "*",
                where: "*",
            });
            setMenuCount(menuRes.data.data.length || 0);

            // ຈຳນວນຜູ້ໃຊ້ງານ (ສຳລັບ admin)
            if (role === "admin") {
                const userRes = await axios.post(`${API_BASE_URL}/fetch`, {
                    db_type: "mysql",
                    store_code: "user_privacy",
                    field_list: "*",
                    where: "*",
                });
                setUserCount(userRes.data.data.length || 0);
            }
        } catch (error) {
            console.error("ດຶງຂໍ້ມູນ Dashboard ຜິດພາດ:", error);
        }
    };

    useEffect(() => {
        fetchDashboardData();

        // ອັບເດດແບບ real-time ເມື່ອມີອໍເດີໃໝ່ ຫຼື ສະຖານະການຈ່າຍເງິນປ່ຽນ
        socket.on("receive_new_order", () => {
            console.log("🔄 Dashboard: ມີອໍເດີໃໝ່ ກຳລັງອັບເດດ...");
            fetchDashboardData();
        });

        socket.on("receive_update_payment_status", () => {
            console.log("🔄 Dashboard: ສະຖານະການຈ່າຍເງິນປ່ຽນ ກຳລັງອັບເດດ...");
            fetchDashboardData();
        });

        return () => {
            socket.off("receive_new_order");
            socket.off("receive_update_payment_status");
        };
    }, [role]);

    return (
        <div className="admin-dashboard">
            <h1 className="dashboard-title">☕ ໜ້າຫຼັກການຈັດການ (Admin Dashboard)</h1>
            <p className="dashboard-subtitle">ຍິນດີຕ້ອນຮັບເຂົ້າສູ່ລະບົບຈັດການຮ້ານ Cabana Cafe</p>

            <div className="dashboard-cards">
                <div className="dashboard-card">
                    <h3>📋 ອໍເດີມື້ນີ້</h3>
                    <p>{orderCount} ອໍເດີ</p>
                </div>
                <div className="dashboard-card">
                    <h3>💰 ຍອດຂາຍມື້ນີ້</h3>
                    <p>{salesTotal.toLocaleString()} ກີບ</p>
                </div>
                <div className="dashboard-card">
                    <h3>🍽️ ຈຳນວນເມນູ</h3>
                    <p>{menuCount} ລາຍການ</p>
                </div>
                {role === "admin" && (
                    <div className="dashboard-card">
                        <h3>👤 ຜູ້ໃຊ້ງານ</h3>
                        <p>{userCount} ຄົນ</p>
                    </div>
                )}
                <div className="dashboard-card">
                    <button 
                        className="btn-queue"
                        onClick={() => window.location.href = "/QRCode"}
                    >
                        🔗 ໄປໜ້າຄິວ QR Code
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
