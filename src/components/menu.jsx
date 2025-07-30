
import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Axios from "axios";
import socket from "./admin/socket-conn";

import TopNav from "./TopNav";
import MenuItem from "./MenuItem";
import OrderModal from "./OrderModal";
import DetailModal from "./DetailModal";
import CartSummaryMini from "./CartSummaryMini";
import { API_BASE_URL } from "../config";
// import { UploadImageIntoServer } from "./uploadImage";

import "../css/style.css";
import "../css/Menu.css";
import "../css/responsive.css"

function Menu() {
    const [ListData, setListData] = useState([]);
    const [MenuTypeData, setMenuTypeData] = useState([]);
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [note, setNote] = useState("");
    const [cart, setCart] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const [showOrderPopup, setShowOrderPopup] = useState(false); // Popup สั่งเสร็จ

    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const selectedMenuTypeFromUrl = queryParams.get("type");
    const searchTermFromUrl = queryParams.get("search");

    /** ====== ดึงข้อมูลเมนู ====== */
    const fetchListData = useCallback(async () => {
        try {
            const res = await Axios.post(`${API_BASE_URL}/fetch`, {
                db_type: "mysql",
                store_code: "tb_menu",
                field_list: "*",
                where: { menu_status: "available" }
            });
            setListData(res.data.data || []);
        } catch (error) {
            console.error("fetchListData Error:", error);
        }
    }, []);

    /** ====== ดึงข้อมูลประเภทเมนู ====== */
    const fetchMenuTypeData = useCallback(async () => {
        try {
            const res = await Axios.post(`${API_BASE_URL}/fetch`, {
                db_type: "mysql",
                store_code: "tb_menu_type",
                field_list: "*",
                where: "*"
            });
            setMenuTypeData(res.data.data || []);
        } catch (error) {
            console.error("fetchMenuTypeData Error:", error);
        }
    }, []);

    useEffect(() => {
        fetchListData();
        fetchMenuTypeData();
        if (searchTermFromUrl) setSearchTerm(searchTermFromUrl);
    }, [fetchListData, fetchMenuTypeData, searchTermFromUrl]);

    /** ====== ค้นหา ====== */
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/menu?search=${encodeURIComponent(searchTerm)}`);
        }
    };

    /** ====== จัดการ Modal ====== */
    const openOrderModal = (menu) => {
        setSelectedMenu(menu);
        setQuantity(1);
        setNote("");
        setIsOrderModalOpen(true);
    };

    const openDetailModal = (menu) => {
        setSelectedMenu(menu);
        setIsDetailModalOpen(true);
    };

    const closeModal = () => {
        setIsOrderModalOpen(false);
        setIsDetailModalOpen(false);
        setSelectedMenu(null);
    };

    /** ====== จัดการจำนวน ====== */
    const handleQuantityChange = (amount) => {
        setQuantity((prev) => Math.max(1, prev + amount));
    };

    /** ====== ตะกร้าสินค้า ====== */
    const addToCart = () => {
        const newItem = {
            menu_id: selectedMenu.menu_id,
            menu_name: selectedMenu.menu_name,
            menu_price: selectedMenu.menu_price,
            quantity,
            note,
            total: selectedMenu.menu_price * quantity
        };
        setCart((prev) => [...prev, newItem]);
        closeModal();
    };

    const removeFromCart = (indexToRemove) => {
        setCart((prev) => prev.filter((_, index) => index !== indexToRemove));
    };

    /** ====== ส่งคำสั่งซื้อ ====== */
    const submitOrder = async () => {
        console.log("DEBUG: submitOrder called, cart =", cart);
        if (cart.length === 0) {
            alert("🛒 ກະລຸນາເພີ່ມລາຍການກ່ອນກົດສັ່ງຊື້");
            return;
        }

        try {
            const total_price = cart.reduce((sum, item) => sum + item.total, 0);
            const userId = localStorage.getItem("user_id") || 0;
            console.log("DEBUG: total_price =", total_price, ", userId =", userId);

            // 1. บันทึก tb_order
            const orderRes = await Axios.post(`${API_BASE_URL}/create`, {
                db_type: "mysql",
                store_code: "tb_order",
                set: {
                    payment_type: "cash",
                    payment_status: "unpaid",
                    total_price,
                    user_id: Number(userId)
                }
            });

            console.log("DEBUG: orderRes =", orderRes.data);

            if (orderRes.data.status === "error") throw new Error(orderRes.data.message);

            const newOrderId = orderRes.data?.data?.[0]?.order_id;
            if (!newOrderId) throw new Error("❌ ບໍ່ພົບ order_id ຈາກລະບົບ");

            localStorage.setItem("order_id", newOrderId);
            console.log("DEBUG: Saved order_id to localStorage:", newOrderId);

            // 2. บันทึก tb_order_detail
            const orderDetails = cart.map(item => ({
                order_id: newOrderId,
                menu_id: item.menu_id,
                status_order: "preparing",
                order_qty: item.quantity,
                order_price: item.menu_price,
                order_total: item.total
            }));

            console.log("DEBUG: orderDetails =", orderDetails);

            const detailRes = await Axios.post(`${API_BASE_URL}/create`, {
                db_type: "mysql",
                store_code: "tb_order_detail",
                set: orderDetails
            });
            console.log("DEBUG: detailRes =", detailRes.data);

            // 3. แจ้งไป admin ผ่าน socket
            socket.emit("send_order", {
                order_id: newOrderId,
                total_price,
                message: "ລູກຄ້າໄດ້ສັ່ງແລ້ວ"
            });
            console.log("DEBUG: Socket emit send_order");

            // 4. แสดง Popup
            setCart([]);
            setShowOrderPopup(true);
            console.log("DEBUG: Show order popup set to TRUE");
        } catch (err) {
            console.error("submitOrder Error", err);
            alert("❌ ເກີດຂໍ້ຜິດພາດໃນການສັ່ງຊື້");
        }
    };

    /** ====== Filter เมนู ====== */
    const filteredList = ListData.filter((item) => {
        const matchesType = !selectedMenuTypeFromUrl || item.menu_type_id.toString() === selectedMenuTypeFromUrl;
        const matchesSearch = !searchTermFromUrl || item.menu_name?.toLowerCase().includes(searchTermFromUrl.toLowerCase());
        return matchesType && matchesSearch;
    });

    return (
        <>
            <TopNav
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                handleSearch={handleSearch}
                cart={cart}
                handleSubmitOrder={submitOrder}
            />

            <CartSummaryMini
                cart={cart}
                onSubmitOrder={submitOrder}
                onRemoveFromCart={removeFromCart}
            />

            <div className="menu-container">
                <h1 className="menu-title">📋 ເມນູຂອງຮ້ານ Cabana</h1>
                <div className="menu-list">
                    {filteredList.map((item, index) => (
                        <MenuItem
                            key={index}
                            item={item}
                            menuTypeData={MenuTypeData}
                            onOrderClick={() => openOrderModal(item)}
                            onDetailClick={() => openDetailModal(item)}
                        />
                    ))}
                </div>
            </div>

            {isOrderModalOpen && selectedMenu && (
                <OrderModal
                    menu={selectedMenu}
                    quantity={quantity}
                    note={note}
                    onClose={closeModal}
                    onAddToCart={addToCart}
                    onQuantityChange={handleQuantityChange}
                    onNoteChange={setNote}
                />
            )}

            {isDetailModalOpen && selectedMenu && (
                <DetailModal
                    menu={selectedMenu}
                    onClose={closeModal}
                />
            )}

            {showOrderPopup && console.log("DEBUG: Popup Rendered")}
            {showOrderPopup && (
                <div className="popup-overlay" onClick={() => setShowOrderPopup(false)}>
                    <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                        <h3>✅ ສັ່ງຊື້ສຳເລັດແລ້ວ</h3>
                        <p>ກະລຸນາໄປຈ່າຍເງິນທີ່ເຄົ້າເຕີ ເພື່ອຮັບໃບບິນ</p>
                        <button onClick={() => navigate("/order-status")}>ເບິ່ງສະຖານະອໍເດີ</button>
                    </div>
                </div>
            )}


        </>
    );
}

export default Menu;
