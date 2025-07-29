
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MenuTypeButtons from "./MenuTypeButtons";
import "../css/TopNav.css";

const TopNav = ({ searchTerm, setSearchTerm, handleSearch }) => {
    const [userRole, setUserRole] = useState("");
    const navigate = useNavigate();

    /** ====== ดึงข้อมูล role ของผู้ใช้จาก localStorage ====== */
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user?.role) {
            console.log("TopNav: User role =", user.role); // Debug
            setUserRole(user.role);
        }
    }, []);

    /** ====== ไปหน้า Admin Dashboard ====== */
    const goToAdminDashboard = () => {
        console.log("TopNav: Navigating to Admin Dashboard"); // Debug
        navigate("/admin/dashboard");
    };

    return (
        <div className="nav-bar">
            <nav className="navbar">
                {/* โลโก้ */}
                <div className="navbar-brand logo-text">
                    <Link to="/" className="nav-logo-link">
                        CABANA CAFE
                    </Link>
                </div>

                <div className="navbar-group">
                    {/* ปุ่ม Admin เฉพาะ admin หรือ staff */}
                    {(userRole === "admin" || userRole === "staff") && (
                        <button 
                            className="admin-nav-btn"
                            onClick={goToAdminDashboard}
                        >
                            Admin
                        </button>
                    )}

                    {/* ลิงก์เมนูหลัก */}
                    <div className="nav-links-wrapper">
                        <Link to="/menu" className="nav-button">Home</Link>
                        <Link to="/order-status" className="nav-button">Order</Link>
                    </div>

                    {/* ปุ่มประเภทเมนู */}
                    <MenuTypeButtons />

                    {/* ค้นหาเมนู */}
                    {/* <form className="nav-search-form" onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder="ค้นหาเมนู..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button type="submit">ค้นหา</button>
                    </form> */}
                </div>
            </nav>
        </div>
    );
};

export default TopNav;
