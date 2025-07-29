
import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import "../../css/admin.css";

const AdminLayout = () => {
    return (
        <div>
            <AdminSidebar />
            <div className="admin-layout-content">
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;
