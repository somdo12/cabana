import React, { useEffect, useState } from "react";
import Axios from "axios";
import "../../css/AdminOrderManager.css";
import socket from "./socket-conn";
import { API_BASE_URL } from "../../config";

function AdminOrderManager() {
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menuMap, setMenuMap] = useState({});
  const [statusSummaryMap, setStatusSummaryMap] = useState({});
  const [userMap, setUserMap] = useState({ 0: "ลูกค้า (Guest)" });
  const [currentOrderData, setCurrentOrderData] = useState(null); // เพิ่มเพื่อเก็บข้อมูล order ปัจจุบัน

  // Modal เลือกวิธีจ่ายเงิน
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPaymentOrderId, setSelectedPaymentOrderId] = useState(null);
  const [selectedPaymentType, setSelectedPaymentType] = useState("cash");

  // // ================== FETCH ORDERS ==================
  // const fetchOrders = async () => {
  //   try {
  //     const res = await Axios.post(
  //       `${API_BASE_URL}/fetch`,
  //       { db_type: "mysql", store_code: "tb_order", field_list: "*", where: "*" },
  //       { headers: { "Content-Type": "application/json" } }
  //     );
  //     setOrders(res.data.data || []);
  //   } catch (err) {
  //     console.error("❌ fetchOrders error:", err);
  //   }
  // };
  const fetchOrders = async () => {
    try {
      const res = await Axios.post(
        `${API_BASE_URL}/fetch`,
        {
          db_type: "mysql",
          store_code: "tb_order",
          field_list: "*",
          where: "*",
        },
        { headers: { "Content-Type": "application/json" } }
      );

      const sortedOrders = (res.data.data || []).sort((a, b) => {
        return new Date(b.order_date) - new Date(a.order_date); // เรียงจากใหม่ไปเก่า
      });

      setOrders(sortedOrders);
    } catch (err) {
      console.error("❌ fetchOrders error:", err);
    }
  };


  // ================== FETCH MENU ==================
  const fetchMenuMap = async () => {
    try {
      const res = await Axios.post(
        `${API_BASE_URL}/fetch`,
        { db_type: "mysql", store_code: "tb_menu", field_list: "*", where: "*" },
        { headers: { "Content-Type": "application/json" } }
      );
      const map = {};
      (res.data.data || []).forEach((menu) => {
        map[menu.menu_id] = { name: menu.menu_name, image: menu.image };
      });
      setMenuMap(map);
    } catch (err) {
      console.error("❌ fetchMenuMap error:", err);
    }
  };

  // ================== FETCH USERS ==================
  const fetchUsers = async () => {
    try {
      const res = await Axios.post(
        `${API_BASE_URL}/fetch`,
        {
          db_type: "mysql",
          store_code: "user_auth",
          field_list: "*",
          where: "*",
        },
        { headers: { "Content-Type": "application/json" } }
      );
      const map = { 0: "ລູກຄ້າ (Guest)" };
      (res.data.data || []).forEach((user) => {
        map[user.user_id] = user.user_name;
      });
      setUserMap(map);
    } catch (err) {
      console.error("❌ fetchUsers error:", err);
    }
  };

  // ================== FETCH STATUS SUMMARY ==================
  const fetchStatusSummary = async () => {
    try {
      const res = await Axios.post(
        `${API_BASE_URL}/fetch`,
        { db_type: "mysql", store_code: "tb_order_detail", field_list: "*", where: "*" },
        { headers: { "Content-Type": "application/json" } }
      );
      const statusMap = {};
      (res.data.data || []).forEach((item) => {
        const id = item.order_id;
        if (!statusMap[id]) statusMap[id] = [];
        statusMap[id].push(item.status_order);
      });

      const summaryMap = {};
      Object.entries(statusMap).forEach(([id, statuses]) => {
        const counts = statuses.reduce((acc, s) => {
          acc[s] = (acc[s] || 0) + 1;
          return acc;
        }, {});
        summaryMap[id] = Object.entries(counts)
          .map(([s, c]) => `${c}×${s}`)
          .join(", ");
      });
      setStatusSummaryMap(summaryMap);
    } catch (err) {
      console.error("❌ fetchStatusSummary error:", err);
    }
  };

  // ================== FETCH ORDER DETAILS ==================
  const fetchOrderDetails = async (orderId) => {
    try {
      const res = await Axios.post(
        `${API_BASE_URL}/fetch`,
        { db_type: "mysql", store_code: "tb_order_detail", field_list: "*", where: { order_id: orderId } },
        { headers: { "Content-Type": "application/json" } }
      );
      setSelectedOrderId(orderId);
      setOrderDetails(res.data.data || []);
      
      // หาข้อมูล order ปัจจุบัน
      const currentOrder = orders.find(order => order.order_id === orderId);
      setCurrentOrderData(currentOrder);
    } catch (err) {
      console.error("❌ fetchOrderDetails error:", err);
    }
  };

  // ================== UPDATE PAYMENT STATUS ==================
  const updatePaymentStatus = async (orderId, newStatus) => {
    try {
      console.log("DEBUG: Emitting update_payment_status for:", { order_id: orderId, payment_status: newStatus });

      socket.emit("update_payment_status", {
        order_id: orderId,
        payment_status: newStatus,
      });

      const res = await Axios.post(
        `${API_BASE_URL}/edit`,
        {
          db_type: "mysql",
          store_code: "tb_order",
          where: { order_id: orderId },
          set: { payment_status: newStatus },
        },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("DEBUG: updatePaymentStatus response:", res.data);

      if (res.data.message.includes("has been edited")) {
        await fetchOrders();
        // อัปเดต currentOrderData ด้วย
        const updatedOrder = orders.find(order => order.order_id === orderId);
        if (updatedOrder) {
          setCurrentOrderData({ ...updatedOrder, payment_status: newStatus });
        }
        alert(`✅ ສະຖານະການຈ່າຍ: ${newStatus === "paid" ? "ຊຳລະແລ້ວ" : "ຍົກເລິກ"}`);
      }
    } catch (err) {
      console.error("❌ updatePaymentStatus error:", err);
    }
  };

  // ================== UPDATE PAYMENT TYPE ==================
  const updatePaymentType = async () => {
    if (!selectedPaymentOrderId) return;

    try {
      console.log("DEBUG: Emitting update_payment_status with data:", {
        order_id: selectedPaymentOrderId,
        payment_status: "paid",
        payment_type: selectedPaymentType,
      });

      // ส่ง event real-time
      socket.emit("update_payment_status", {
        order_id: selectedPaymentOrderId,
        payment_status: "paid",
        payment_type: selectedPaymentType,
      });

      const res = await Axios.post(
        `${API_BASE_URL}/edit`,
        {
          db_type: "mysql",
          store_code: "tb_order",
          where: { order_id: selectedPaymentOrderId },
          set: {
            payment_status: "paid",
            payment_type: selectedPaymentType,
          },
        },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("DEBUG: updatePaymentType Response:", res.data);

      if (res.data.message.includes("has been edited")) {
        await fetchOrders();
        // อัปเดต currentOrderData ด้วย
        if (currentOrderData && currentOrderData.order_id === selectedPaymentOrderId) {
          setCurrentOrderData({ 
            ...currentOrderData, 
            payment_status: "paid",
            payment_type: selectedPaymentType 
          });
        }
        setIsPaymentModalOpen(false);
        alert(`✅ ອັບເດດການຊຳລະເງິນນແລ້ວ: ${selectedPaymentType}`);
      }
    } catch (err) {
      console.error("❌ updatePaymentType error:", err);
    }
  };

  // ================== ORDER DETAIL STATUS ==================
  const updateOrderDetailStatus = async (item) => {
    const nextStatus =
      item.status_order === "preparing" ? "done" : item.status_order === "done" ? "served" : "preparing";
    try {
      await Axios.post(
        `${API_BASE_URL}/edit`,
        { db_type: "mysql", store_code: "tb_order_detail", where: { order_id: item.order_id, menu_id: item.menu_id }, set: { status_order: nextStatus } },
        { headers: { "Content-Type": "application/json" } }
      );
      socket.emit("update_order_detail_status", { order_id: item.order_id, menu_id: item.menu_id, status: nextStatus });
      fetchOrderDetails(item.order_id);
      fetchStatusSummary();
    } catch (err) {
      console.error("❌ updateOrderDetailStatus error:", err);
    }
  };


  const deleteOrder = async (orderId) => {
    const confirmDelete = window.confirm("🗑 ທ່ານແນ່ໃຈບໍ່ວ່າຈະລຶບອໍເດີນີ້?");
    if (!confirmDelete) return;

    try {
      // 🔁 ลบรายการลูกใน tb_order_detail ก่อน
      await Axios.post(
        `${API_BASE_URL}/delete`,
        {
          db_type: "mysql",
          store_code: "tb_order_detail",
          where: { order_id: orderId },
        },
        { headers: { "Content-Type": "application/json" } }
      );

      // ✅ จากนั้นลบ tb_order
      const res = await Axios.post(
        `${API_BASE_URL}/delete`,
        {
          db_type: "mysql",
          store_code: "tb_order",
          where: { order_id: orderId },
        },
        { headers: { "Content-Type": "application/json" } }
      );

      const msg = res.data?.message?.toLowerCase() || "";
      if (msg.includes("has been deleted")) {
        alert("✅ ລຶບອໍເດີສຳເລັດແລ້ວ");
        fetchOrders(); // รีโหลดข้อมูล
      } else {
        alert("❌ ລຶບບໍ່ສຳເລັດ: " + msg);
      }
    } catch (err) {
      console.error("❌ deleteOrder error:", err);
      alert("❌ ເກີດຂໍ້ຜິດພາດໃນການລຶບ");
    }
  };


  // ================== SOCKET LISTENERS ==================
  useEffect(() => {
    if (!socket) return;

    socket.on("receive_new_order", () => {
      fetchOrders();
      fetchStatusSummary();
    });

    socket.on("receive_update_payment_status", (data) => {
      console.log("DEBUG: Admin received update_payment_status:", data);
      fetchOrders();
    });

    socket.on("update_order_detail_status", () => {
      fetchStatusSummary();
    });

    return () => {
      socket.off("receive_new_order");
      socket.off("receive_update_payment_status");
      socket.off("update_order_detail_status");
    };
  }, [selectedOrderId]);



  // ================== DATE FORMAT ==================
  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    return (
      date.toLocaleString("la-LA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }) + " ນ."
    );
  };

  useEffect(() => {
    fetchOrders();
    fetchMenuMap();
    fetchUsers();
    fetchStatusSummary();
  }, []);

  const totalRevenue = orders.reduce((sum, order) => sum + order.total_price, 0);

  return (
    <div className="order-manager">
      <h2>ຄຳສັ່ງຊື້ທັງໝົດ</h2>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>ผู้สั่ง</th>
            <th>ລາຄາລວມ</th>
            <th>ວັນທີ</th>
            <th>ສະຖານະອາຫານ</th>
            <th>ສະຖານະຈ່າຍເງິນ</th>
            <th>ລາຍການ</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.order_id}>
              <td>{order.order_id}</td>
              <td>{userMap[order.user_id] || `User ID: ${order.user_id}`}</td>
              <td>{order.total_price.toLocaleString()} kip</td>
              <td>{formatDate(order.order_date)}</td>
              <td>{statusSummaryMap[order.order_id] || "-"}</td>
              <td>
                {order.payment_status === "paid" ? (
                  <span className="payment-status-paid">✅ ຊຳລະແລ້ວ ({order.payment_type})</span>
                ) : (
                  <span className="payment-status-unpaid">❌ ຍັງບໍ່ຊຳລະ</span>
                )}
              </td>
              <td>
                <button
                  onClick={() => {
                    fetchOrderDetails(order.order_id);
                    setIsModalOpen(true);
                  }}
                  className="btn-view-details"
                >
                  ເບິ່ງລາຍການ
                </button>
                <button
                  onClick={() => deleteOrder(order.order_id)}
                  className="btn-delete-order"
                >
                  🗑 ລົບອໍເດີ
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="total-revenue">💰 ຍອດຂາຍລວມທັງໝົດ: {totalRevenue.toLocaleString()} kip</p>

      {isModalOpen && currentOrderData && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>ລາຍການຄຳສັ່ງຊື້ #{selectedOrderId}</h3>
            
            {/* ส่วนจัดการการจ่ายเงิน */}
            <div className="payment-management-section">
              <h4>ການຈັດການການຈ່າຍເງິນ</h4>
              <div className="payment-info">
                <strong>ສະຖານະການຈ່າຍ: </strong>
                {currentOrderData.payment_status === "paid" ? (
                  <span className="status-paid">ຊຳລະແລ້ວ</span>
                ) : (
                  <span className="status-unpaid">ຍັງບໍ່ຊຳລະ</span>
                )}
                {currentOrderData.payment_type && (
                  <>
                    <br />
                    <strong>ປະເພດເງິນ: </strong>{currentOrderData.payment_type}
                  </>
                )}
              </div>
              
              <div className="payment-actions">
                {currentOrderData.payment_status === "unpaid" ? (
                  <button
                    onClick={() => {
                      setSelectedPaymentOrderId(currentOrderData.order_id);
                      setSelectedPaymentType(currentOrderData.payment_type || "ເງຶນສົດ");
                      setIsPaymentModalOpen(true);
                    }}
                    className="btn-confirm-pay"
                  >
                    ✅ ຢືນຢັນການຈ່າຍ
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setSelectedPaymentOrderId(currentOrderData.order_id);
                        setSelectedPaymentType(currentOrderData.payment_type);
                        setIsPaymentModalOpen(true);
                      }}
                      className="btn-edit-pay"
                    >
                      ✏ ແກ້ໄຂປະເພດເງິນ
                    </button>
                    <button
                      onClick={() => updatePaymentStatus(currentOrderData.order_id, "unpaid")}
                      className="btn-cancel-pay"
                    >
                      ❌ ຍົກເລີກການຈ່າຍ
                    </button>
                    <button
                      onClick={() => window.open(`/bill/${currentOrderData.order_id}`, "_blank")}
                      className="btn-print"
                    >
                      🖨 ພິມໃບສັ່ງຊື້
                    </button>
                  </>
                )}
              </div>
            </div>
            
            <hr />
            
            {/* ส่วนรายการอาหาร */}
            <h4>ລາຍການອາຫານ</h4>
            <div className="modal-items-container">
              {orderDetails.map((item, index) => (
                <div className="modal-item-row" key={index}>
                  <img
                    src={`http://${window.location.hostname}:5000/storages/images/${menuMap[item.menu_id]?.image || "noimage.jpg"}`}
                    alt="menu"
                    className="modal-menu-image"
                  />

                  <div className="modal-menu-info">
                    <div><strong>{menuMap[item.menu_id]?.name || `Menu #${item.menu_id}`}</strong></div>
                    <div>ຈຳນວນ: {item.order_qty}</div>
                    <div>ລາຄາ: {item.order_price.toLocaleString()} kip</div>
                    <div>ລວມ: {item.order_total.toLocaleString()} kip</div>
                    {item.note && item.note.trim() !== "" && (
                      <div className="menu-note">
                        📝 <strong>ໝາຍເຫດ:</strong> {item.note}
                      </div>
                    )}
                    <div>ສະຖານະ: <span className={`badge-status ${item.status_order}`}>{item.status_order}</span></div>
                    <button onClick={() => updateOrderDetailStatus(item)} className="status-btn">ປ່ຽນສະຖານະ</button>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setIsModalOpen(false)} className="close-modal-btn">ປິດ</button>
          </div>
        </div>
      )}

      {isPaymentModalOpen && (
        <div className="modal-overlay" onClick={() => setIsPaymentModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>ເລືອກປະເພດກະຊຳລະເງຶນ</h3>
            <select value={selectedPaymentType} onChange={(e) => setSelectedPaymentType(e.target.value)}>
              <option value="ເງຶນສົດ">ເງຶນສົດ</option>
              <option value="ເງິນໂອນ">ເງຶນໂອນ</option>
              <option value="ບັດເຄດິດ">ບັດເຄດິດ</option>
            </select>
            <div className="modal-actions">
              <button onClick={updatePaymentType} className="btn-save-pay">ບັນທຶກ</button>
              <button onClick={() => setIsPaymentModalOpen(false)} className="btn-cancel">ຍົກເລີກ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrderManager;