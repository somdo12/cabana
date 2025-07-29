import React from "react";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children, roles }) {
    const user = JSON.parse(localStorage.getItem("user")); // อ่านข้อมูล user

    // ❌ ถ้าไม่มีข้อมูล user เลย (ยังไม่ล็อกอิน)
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // ❌ ถ้า role ของ user ไม่ตรงกับ roles ที่อนุญาต
    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/login" replace />;
    }

    return children; // ✅ อนุญาตให้เข้า
}

export default PrivateRoute;
