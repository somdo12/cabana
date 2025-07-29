
// import React, { useEffect, useState } from "react";
// import Axios from "axios";
// import "../css/OrderStatus.css";
// import socket from "./admin/socket-conn";
// import { Link } from "react-router-dom";
// import { API_BASE_URL } from "../config";

// function OrderStatus() {
//     const [order, setOrder] = useState(null);
//     const [error, setError] = useState("");
//     const [orderItems, setOrderItems] = useState([]);
//     const [menuMap, setMenuMap] = useState({});

//     /** ====== ดึงข้อมูลเริ่มต้น ====== */
//     useEffect(() => {
//         // ดึงข้อมูลเมนู
//         Axios.post(`${API_BASE_URL}/fetch`, {
//             db_type: "mysql",
//             store_code: "tb_menu",
//             field_list: "*",
//             where: "*"
//         }).then((res) => {
//             const map = {};
//             res.data.data.forEach(menu => {
//                 map[menu.menu_id] = menu.menu_name;
//             });
//             setMenuMap(map);
//         }).catch((err) => {
//             console.error("🔥 MENU MAP ERROR:", err.response?.data || err.message);
//         });

//         const orderId = localStorage.getItem("order_id");
//         if (!orderId) {
//             setError("❌ ไม่พบหมายเลขคำสั่งซื้อ กรุณาสั่งใหม่");
//             return;
//         }

//         // ดึงข้อมูล order
//         Axios.post(`${API_BASE_URL}/fetch`, {
//             db_type: "mysql",
//             store_code: "tb_order",
//             field_list: "*",
//             where: { order_id: parseInt(orderId) }
//         }).then((res) => {
//             if (res.data?.data?.length > 0) {
//                 console.log("DEBUG: Initial order data:", res.data.data[0]);
//                 setOrder(res.data.data[0]);
//             } else {
//                 setError("❌ ไม่พบข้อมูลคำสั่งซื้อ");
//             }
//         }).catch(() => {
//             setError("❌ โหลดคำสั่งซื้อไม่สำเร็จ");
//         });

//         // ดึงรายละเอียด order
//         Axios.post(`${API_BASE_URL}/fetch`, {
//             db_type: "mysql",
//             store_code: "tb_order_detail",
//             field_list: "*",
//             where: { order_id: parseInt(orderId) }
//         }).then((res) => {
//             setOrderItems(res.data.data || []);
//         }).catch((err) => {
//             console.error("🔥 ORDER ITEMS ERROR:", err.response?.data || err.message);
//         });
//     }, []);

//     /** ====== Socket Real-Time ====== */
//     useEffect(() => {
//         if (!socket) return;

//         socket.on("receive_update_order_detail_status", (data) => {
//             if (order?.order_id === data.order_id) {
//                 Axios.post(`${API_BASE_URL}/fetch`, {
//                     db_type: "mysql",
//                     store_code: "tb_order_detail",
//                     field_list: "*",
//                     where: { order_id: data.order_id }
//                 }).then((res) => {
//                     setOrderItems(res.data.data || []);
//                 });
//             }
//         });

//         // อัปเดตสถานะการจ่ายและประเภทการจ่ายแบบ real-time
//         socket.on("receive_update_payment_status", (data) => {
//             console.log("DEBUG: receive_update_payment_status received:", data);
//             if (order?.order_id === data.order_id) {
//                 setOrder((prev) => ({
//                     ...prev,
//                     payment_status: data.payment_status,
//                     payment_type: data.payment_type || prev.payment_type
//                 }));
//             }
//         });

//         socket.on("receive_update_order_status", (data) => {
//             if (order?.order_id === data.order_id) {
//                 setOrder((prev) => ({ ...prev, status_order: data.status_order }));
//             }
//         });

//         return () => {
//             socket.off("receive_update_order_detail_status");
//             socket.off("receive_update_payment_status");
//             socket.off("receive_update_order_status");
//         };
//     }, [order?.order_id]);

//     /** ====== ฟังก์ชันช่วย format วันที่ ====== */
//     const formatDate = (isoDateString) => {
//         const date = new Date(isoDateString);
//         return date.toLocaleString("la-LA", {
//             year: "numeric",
//             month: "2-digit",
//             day: "2-digit",
//             hour: "2-digit",
//             minute: "2-digit",
//             hour12: false
//         }) + " ນ.";
//     };

//     /** ====== UI ====== */
//     if (error) {
//         return (
//             <div className="order-status-container" style={{ fontFamily: "'Noto Sans Lao', sans-serif", color: "red", padding: "20px" }}>
//                 {error}
//             </div>
//         );
//     }
//     if (!order) {
//         return (
//             <div className="order-status-container" style={{ fontFamily: "'Noto Sans Lao', sans-serif", padding: "20px" }}>
//                 🔄 ກຳລັງໂຫຼດຂໍ້ມູນຄຳສັ່ງຊື້...
//             </div>
//         );
//     }

//     return (
//         <div className="order-status-container" style={{ fontFamily: "'Noto Sans Lao', sans-serif" }}>
//             <h2>📋 ສະຖານະຄຳສັ່ງຊື້ຂອງທ່ານ</h2>

//             <div className="order-info">
//                 <p><strong>ເລກຄຳສັ່ງຊື້:</strong> #{order.order_id}</p>
//                 <p><strong>ປະເພດການຈ່າຍເງິນ:</strong> {order.payment_type}</p>
//                 <p><strong>ສະຖານະການຈ່າຍ:</strong> {order.payment_status}</p>
//                 <p><strong>ເວລາສັ່ງ:</strong> {formatDate(order.order_date)}</p>
//                 <p><strong>ລວມທັງໝົດ:</strong> {order.total_price.toLocaleString()} ₭</p>
//             </div>

//             {orderItems.length > 0 && (
//                 <div className="order-items-box">
//                     <div className="order-items-title">🍽️ ລາຍການທີ່ທ່ານສັ່ງ</div>
//                     {orderItems.map((item, index) => (
//                         <div key={index} className="order-item">
//                             <div className="order-item-name">
//                                 <p>{menuMap[item.menu_id] || `ເມນູ #${item.menu_id}`} × {item.order_qty}</p>
//                                 <p><strong>ໝາຍເຫດ:</strong> {item.description || 'ບໍ່ມີ'}</p>
//                                 <p>
//                                     <span className={`status-badge status-${item.status_order}`}>
//                                         {item.status_order === "preparing" ? "ກຳລັງເຮັດ"
//                                             : item.status_order === "done" ? "ເຮັດແລ້ວ"
//                                                 : item.status_order === "served" ? "ສົ່ງແລ້ວ"
//                                                     : item.status_order}
//                                     </span>
//                                 </p>
//                             </div>
//                             <div className="order-item-total">
//                                 ₭{item.order_total.toLocaleString()}
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             )}

//             <Link to="/menu">
//                 <button className="back-to-menu-btn">← ກັບໄປໜ້າຫຼັກ</button>
//             </Link>
//         </div>
//     );
// }

// export default OrderStatus;
import React, { useEffect, useState } from "react";
import Axios from "axios";
import "../css/OrderStatus.css";
import socket from "./admin/socket-conn";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../config";

function OrderStatus() {
    const [order, setOrder] = useState(null);
    const [orderItems, setOrderItems] = useState([]);
    const [menuMap, setMenuMap] = useState({});

    /** ====== ดึงข้อมูลเริ่มต้น ====== */
    useEffect(() => {
        // ดึงข้อมูลเมนู
        Axios.post(`${API_BASE_URL}/fetch`, {
            db_type: "mysql",
            store_code: "tb_menu",
            field_list: "*",
            where: "*"
        }).then((res) => {
            const map = {};
            res.data.data.forEach(menu => {
                map[menu.menu_id] = menu.menu_name;
            });
            setMenuMap(map);
        }).catch((err) => {
            console.error("🔥 MENU MAP ERROR:", err.response?.data || err.message);
        });

        const orderId = localStorage.getItem("order_id");
        if (!orderId) {
            alert("❌ คุณยังไม่มีคำสั่งซื้อ กรุณาเพิ่มรายการก่อน");
            window.location.href = "/menu";
            return;
        }

        // ดึงข้อมูล order
        Axios.post(`${API_BASE_URL}/fetch`, {
            db_type: "mysql",
            store_code: "tb_order",
            field_list: "*",
            where: { order_id: parseInt(orderId) }
        }).then((res) => {
            if (res.data?.data?.length > 0) {
                setOrder(res.data.data[0]);
            } else {
                alert("❌ ไม่พบข้อมูลคำสั่งซื้อของคุณ กรุณาสั่งใหม่");
                window.location.href = "/menu";
            }
        }).catch(() => {
            alert("❌ โหลดคำสั่งซื้อไม่สำเร็จ กรุณาลองใหม่");
            window.location.href = "/menu";
        });

        // ดึงรายละเอียด order
        Axios.post(`${API_BASE_URL}/fetch`, {
            db_type: "mysql",
            store_code: "tb_order_detail",
            field_list: "*",
            where: { order_id: parseInt(orderId) }
        }).then((res) => {
            setOrderItems(res.data.data || []);
        }).catch((err) => {
            console.error("🔥 ORDER ITEMS ERROR:", err.response?.data || err.message);
        });
    }, []);

    /** ====== Socket Real-Time ====== */
    useEffect(() => {
        if (!socket) return;

        socket.on("receive_update_order_detail_status", (data) => {
            if (order?.order_id === data.order_id) {
                Axios.post(`${API_BASE_URL}/fetch`, {
                    db_type: "mysql",
                    store_code: "tb_order_detail",
                    field_list: "*",
                    where: { order_id: data.order_id }
                }).then((res) => {
                    setOrderItems(res.data.data || []);
                });
            }
        });

        socket.on("receive_update_payment_status", (data) => {
            if (order?.order_id === data.order_id) {
                setOrder((prev) => ({
                    ...prev,
                    payment_status: data.payment_status,
                    payment_type: data.payment_type || prev.payment_type
                }));
            }
        });

        return () => {
            socket.off("receive_update_order_detail_status");
            socket.off("receive_update_payment_status");
        };
    }, [order?.order_id]);

    /** ====== ฟังก์ชันช่วย format วันที่ ====== */
    const formatDate = (isoDateString) => {
        const date = new Date(isoDateString);
        return date.toLocaleString("la-LA", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        }) + " ນ.";
    };

    /** ====== UI ====== */
    if (!order) {
        return (
            <div className="order-status-container" style={{ fontFamily: "'Noto Sans Lao', sans-serif", padding: "20px" }}>
                🔄 ກຳລັງໂຫຼດຂໍ້ມູນຄຳສັ່ງຊື້...
            </div>
        );
    }

    return (
        <div className="order-status-container" style={{ fontFamily: "'Noto Sans Lao', sans-serif" }}>
            <h2>📋 ສະຖານະຄຳສັ່ງຊື້ຂອງທ່ານ</h2>

            <div className="order-info">
                <p><strong>ເລກຄຳສັ່ງຊື້:</strong> #{order.order_id}</p>
                <p><strong>ປະເພດການຈ່າຍເງິນ:</strong> {order.payment_type}</p>
                <p><strong>ສະຖານະການຈ່າຍ:</strong> {order.payment_status}</p>
                <p><strong>ເວລາສັ່ງ:</strong> {formatDate(order.order_date)}</p>
                <p><strong>ລວມທັງໝົດ:</strong> {order.total_price.toLocaleString()} ₭</p>
            </div>

            {orderItems.length > 0 && (
                <div className="order-items-box">
                    <div className="order-items-title">🍽️ ລາຍການທີ່ທ່ານສັ່ງ</div>
                    {orderItems.map((item, index) => (
                        <div key={index} className="order-item">
                            <div className="order-item-name">
                                <p>{menuMap[item.menu_id] || `ເມນູ #${item.menu_id}`} × {item.order_qty}</p>
                                <p><strong>ໝາຍເຫດ:</strong> {item.description || 'ບໍ່ມີ'}</p>
                                <p>
                                    <span className={`status-badge status-${item.status_order}`}>
                                        {item.status_order === "preparing" ? "ກຳລັງເຮັດ"
                                            : item.status_order === "done" ? "ເຮັດແລ້ວ"
                                                : item.status_order === "served" ? "ສົ່ງແລ້ວ"
                                                    : item.status_order}
                                    </span>
                                </p>
                            </div>
                            <div className="order-item-total">
                                ₭{item.order_total.toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Link to="/menu">
                <button className="back-to-menu-btn">← ກັບໄປໜ້າຫຼັກ</button>
            </Link>
        </div>
    );
}

export default OrderStatus;
