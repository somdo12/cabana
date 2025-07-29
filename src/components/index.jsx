
import { Routes, Route, Navigate } from "react-router-dom";

import Todolist from "./Todolist";
import MenuTypeButtons from "./MenuTypeButtons";
import Login from "./login";
import Register from "./Register";
import Menu from "./menu";
import OrderStatus from "./OrderStatus";

import AdminLayout from "./admin/AdminLayout";
import AdminOrderManager from "./admin/AdminOrderManager";
import AdminSalesReport from "./admin/AdminSalesReport";
import AdminMenuManager from "./admin/AdminMenuManager";
import UserList from "./admin/UserList";
import UploadToCloudinary from "./UploadToCloudinary";
import TestSocket from "./test-socket";
import Bill from "./admin/Bill";
import AdminDashboard from "./admin/AdminDashboard";
import QRCodePage from "./QRCodePage";
import PrivateRoute from "./PrivateRoute";
import MenuReport from "./admin/MenuReport";
import MenuTypeReport from "./admin/MenuTypeReport";
// import DeleteHistory from "./admin/DeleteHistory";
import AdminActivityLog from "./admin/AdminActivityLog";

function Lobby() {
    return (
        <Routes>
            {/* 🔸 เส้นทางฝั่งลูกค้า */}
            <Route path="/" element={<Navigate to="/menu" replace />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/UploadToCloudinary" element={<UploadToCloudinary />} />
            <Route path="/socket" element={<TestSocket />} />
            <Route path="/MenuTypeButtons" element={<MenuTypeButtons />} />
            <Route path="/Todolist" element={<Todolist />} />
            <Route path="/login" element={<Login />} />
            <Route path="/order-status" element={<OrderStatus />} />
            <Route path="/qrcode" element={<QRCodePage />} />

            {/* 🔸 เส้นทางฝั่งแอดมิน ต้อง login */}
            <Route
                path="/admin/*"
                element={
                    <PrivateRoute roles={["admin", "staff"]}>
                        <AdminLayout />
                    </PrivateRoute>
                }
            >
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="orders" element={<AdminOrderManager />} />
                <Route path="sales" element={<AdminSalesReport />} />
                <Route path="menu" element={<AdminMenuManager />} />
                <Route path="users" element={<UserList />} />
                <Route path="register" element={<Register />} />
                <Route path="report-menu" element={<MenuReport />} /> {/* ✅ เพิ่มตรงนี้ */}
                <Route path="report-menu-type" element={<MenuTypeReport />} />
                {/* <Route path="delete-history" element={<DeleteHistory />} /> */}
                
                <Route path="activity-log" element={<AdminActivityLog />} />


                

            </Route>


            {/* หน้าใบเสร็จ */}
            <Route path="/bill/:orderId" element={<Bill />} />
        </Routes>
    );
}

export default Lobby;
