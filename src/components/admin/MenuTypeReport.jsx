import React, { useEffect, useState } from "react";
import Axios from "axios";
import "../../css/MenuTypeReport.css"; // ไฟล์ CSS สำหรับสไตล์
import { API_BASE_URL } from "../../config";

function MenuTypeReport() {
    const [reportData, setReportData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    /** ===== ดึงข้อมูลประเภทเมนู + ข้อมูลเมนู + รายการขาย ===== */
    const fetchMenuTypeReport = async () => {
        try {
            console.log("🔄 เริ่มดึงข้อมูลประเภทเมนู...");

            // 1. ดึงข้อมูลประเภทเมนู
            const typeRes = await Axios.post(
                `${API_BASE_URL}/fetch`,
                {
                    db_type: "mysql",
                    store_code: "tb_menu_type",
                    field_list: ["menu_type_id", "menu_type_name"],
                    where: "*"
                },
                { headers: { "Content-Type": "application/json" } }
            );
            const menuTypes = typeRes.data.data || [];
            console.log("✅ Menu Type Data:", menuTypes);

            // 2. ดึงข้อมูลเมนู
            const menuRes = await Axios.post(
                `${API_BASE_URL}/fetch`,
                {
                    db_type: "mysql",
                    store_code: "tb_menu",
                    field_list: ["menu_id", "menu_type_id", "menu_price"],
                    where: "*"
                },
                { headers: { "Content-Type": "application/json" } }
            );
            const menus = menuRes.data.data || [];
            console.log("✅ Menu Data:", menus);

            // 3. ดึงข้อมูล order_detail
            const orderRes = await Axios.post(
                `${API_BASE_URL}/fetch`,
                {
                    db_type: "mysql",
                    store_code: "tb_order_detail",
                    field_list: ["menu_id", "order_qty", "order_total"],
                    where: "*"
                },
                { headers: { "Content-Type": "application/json" } }
            );
            const orders = orderRes.data.data || [];
            console.log("✅ Order Data:", orders);

            // 4. รวมข้อมูลตามประเภทเมนู
            const report = menuTypes.map((type) => {
                const typeMenuIds = menus
                    .filter((m) => m.menu_type_id === type.menu_type_id)
                    .map((m) => m.menu_id);

                const typeOrders = orders.filter((o) =>
                    typeMenuIds.includes(o.menu_id)
                );

                const totalQty = typeOrders.reduce(
                    (sum, o) => sum + (parseInt(o.order_qty) || 0),
                    0
                );
                const totalSales = typeOrders.reduce(
                    (sum, o) => sum + (parseInt(o.order_total) || 0),
                    0
                );

                return {
                    menu_type_name: type.menu_type_name,
                    total_qty: totalQty,
                    total_sales: totalSales,
                };
            });

            setReportData(report);
            setFilteredData(report);
            setLoading(false);
        } catch (error) {
            console.error("❌ Error fetching menu type report:", error);
            setLoading(false);
        }
    };

    /** ===== ฟังก์ชันค้นหา ===== */
    const handleSearch = () => {
        if (!searchTerm.trim()) {
            setFilteredData(reportData);
        } else {
            const filtered = reportData.filter((item) =>
                item.menu_type_name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredData(filtered);
        }
    };

    useEffect(() => {
        fetchMenuTypeReport();
    }, []);

    return (
        <div className="menu-type-report-container">
            <h2>📑 ລາຍງານປະເພດເມນູ</h2>

            {/* กล่องค้นหา */}
            <div className="search-box">
                <input
                    type="text"
                    placeholder="ຄົ້ນຫາປະເພດເມນູ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={handleSearch}>ຄົ້ນຫາ</button>
            </div>

            {/* ตารางรายงาน */}
            {loading ? (
                <p>⏳ ກຳລັງໂຫຼດຂໍ້ມູນ...</p>
            ) : (
                <table className="report-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>ປະເພດເມນູ</th>
                            <th>ຈຳນວນຂາຍ</th>
                            <th>ຍອດລວມ (kip)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length === 0 ? (
                            <tr>
                                <td colSpan="4">ບໍ່ມີຂໍ້ມູນ</td>
                            </tr>
                        ) : (
                            filteredData.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.menu_type_name}</td>
                                    <td>{item.total_qty}</td>
                                    <td>{item.total_sales.toLocaleString()}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default MenuTypeReport;
