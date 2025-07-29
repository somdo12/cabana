
import React, { useState, useEffect } from "react";
import Axios from "axios";
import "../../css/AdminSalesReport.css";

function AdminSalesReport() {
    const [orders, setOrders] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [showPaidOnly, setShowPaidOnly] = useState(false);

    const fetchOrders = async () => {
        try {
            const res = await Axios.post(
                "http://localhost:5000/v1/store/fetch",
                {
                    db_type: "mysql",
                    store_code: "tb_order",
                    field_list: "*",
                    where: "*",
                },
                { headers: { "Content-Type": "application/json" } }
            );
            console.log("Fetched orders:", res.data.data);
            setOrders(res.data.data || []);
        } catch (err) {
            console.error("fetchOrders error", err);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // ฟิลเตอร์ตามวันที่
    const filteredByDate = selectedDate
        ? orders.filter((order) => {
            const dbDate = order.order_date.substring(0, 10); // YYYY-MM-DD
            console.log(`Check order_id=${order.order_id}, dbDate=${dbDate}, selected=${selectedDate}`);
            return dbDate === selectedDate;
        })
        : orders;

    const filteredOrders = showPaidOnly
        ? filteredByDate.filter((order) => order.payment_status === "paid")
        : filteredByDate;

    const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.total_price, 0);

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

    return (
        <div className="sales-report">
            <h2>📊 ລາຍງານຍອດຂາຍ</h2>
            <div className="filter-section">
                <label>
                    ວັນທີ:
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                </label>
                <label className="toggle-paid-only">
                    <input
                        type="checkbox"
                        checked={showPaidOnly}
                        onChange={(e) => setShowPaidOnly(e.target.checked)}
                    />
                    ສະແດງສະເພາະລາຍການທີ່ຊຳລະແລ້ວ
                </label>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>ລາຄາລວມ</th>
                        <th>ວັນທີ</th>
                        <th>ສະຖານະ</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredOrders.length > 0 ? (
                        filteredOrders.map((order) => (
                            <tr key={order.order_id}>
                                <td>{order.order_id}</td>
                                <td>{order.total_price.toLocaleString()} kip</td>
                                <td>{formatDate(order.order_date)}</td>
                                <td>
                                    {order.payment_status === "paid"
                                        ? "ຊຳລະແລ້ວ"
                                        : "ຍັງບໍ່ຊຳລະ"}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">ບໍ່ພົບຂໍ້ມູນ</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <p className="total-revenue">
                💰 ຍອດຂາຍລວມ: {totalRevenue.toLocaleString()} kip
            </p>
        </div>
    );
}

export default AdminSalesReport;
