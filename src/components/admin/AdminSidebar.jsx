import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../css/admin.css";

function AdminSidebar() {
    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role;
    const navigate = useNavigate();
    const [isUsersDropdownOpen, setIsUsersDropdownOpen] = useState(false);

    const goToMenu = () => {
        navigate("/menu");
    };

    const goToDashboard = () => {
        navigate("/admin/dashboard");
    };

    const handleLogout = () => {
        if (window.confirm("ເຈົ້າຕ້ອງການອອກຈາກລະບົບແທ້ບໍ່?")) {
            localStorage.clear();
            navigate("/login");
        }
    };

    const toggleUsersDropdown = () => {
        setIsUsersDropdownOpen(!isUsersDropdownOpen);
    };

    return (
        <div className="admin-sidebar">
            {/* ปุ่มกลับไปหน้าเมนู */}
            <button className="back-to-menu-btn" onClick={goToMenu}>
                ← Menu
            </button>

            {/* หัวข้อแอดมินคลิกแล้วไปแดชบอร์ด */}
            <h2 className="sidebar-title" onClick={goToDashboard}>
                ☕ {role === "admin" ? "ແອດມິນ" : "ພະນັກງານ"}
            </h2>

            {/* เมนูแสดงตาม role */}
            <ul className="sidebar-menu">
                <li><Link to="/admin/dashboard">🏠 ຫນ້າຫຼັກ</Link></li>
                <li><Link to="/admin/orders">📋 ລາຍການສັ່ງຊື້</Link></li>
                <li><Link to="/admin/menu">🍽️ ຈັດການເມນູ</Link></li>
                {role === "admin" && (
                    <li className="dropdown-item">
                        <div className="dropdown-toggle" onClick={toggleUsersDropdown}>
                            👤 ຜູ້ໃຊ້ງານ
                            <span className={`dropdown-arrow ${isUsersDropdownOpen ? 'open' : ''}`}>▼</span>
                        </div>
                        {isUsersDropdownOpen && (
                            <ul className="dropdown-menu">
                                <li><Link to="/admin/users">👤 ຜູ້ໃຊ້ງານ</Link></li>
                                <li><Link to="/admin/activity-log">🗂️ ປະຫວັດການເຄື່ອນໄຫວ</Link></li>
                            </ul>
                        )}
                    </li>
                )}
                {/* <li><Link to="/admin/delete-history">🗑️ ປະຫວັດການລົບ</Link></li> */}
                <li><Link to="/admin/sales">📊 ຍອດຂາຍທັງໝົດ</Link></li>
                <li><Link to="/admin/report-menu">📈 ຍອດຂາຍເມນູ</Link></li>
                <li><Link to="/admin/report-menu-type">📑 ຍອດຂາຍປະເພດເມນູ</Link></li> {/* ✅ เพิ่มลิงก์นี้ */}
            </ul>

            {/* ปุ่ม Logout */}
            <button className="logout-btn" onClick={handleLogout}>
                🚪 Logout
            </button>
        </div>
    );
}

export default AdminSidebar;