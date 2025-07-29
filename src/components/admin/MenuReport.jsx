
// import React, { useEffect, useState } from "react";
// import Axios from "axios";
// import "../../css/MenuReport.css";

// function MenuReport() {
//     const [reportData, setReportData] = useState([]);
//     const [loading, setLoading] = useState(true);

//     /** ===== ดึงข้อมูลเมนู + รายการขาย ===== */
//     const fetchMenuReport = async () => {
//         try {
//             console.log("🔄 เริ่มดึงข้อมูลเมนู...");

//             // ดึงข้อมูลเมนู
//             const menuRes = await Axios.post(
//                 "http://localhost:5000/v1/store/fetch",
//                 {
//                     db_type: "mysql",
//                     store_code: "tb_menu",
//                     field_list: ["menu_id", "menu_name", "menu_price"],
//                     where: "*"
//                 },
//                 { headers: { "Content-Type": "application/json" } }
//             );

//             console.log("✅ Menu Data:", menuRes.data);

//             // ดึงข้อมูลออเดอร์
//             const orderRes = await Axios.post(
//                 "http://localhost:5000/v1/store/fetch",
//                 {
//                     db_type: "mysql",
//                     store_code: "tb_order_detail",
//                     field_list: ["menu_id", "order_qty", "order_total"],
//                     where: "*"
//                 },
//                 { headers: { "Content-Type": "application/json" } }
//             );

//             console.log("✅ Order Data:", orderRes.data);

//             if (menuRes.data?.data && orderRes.data?.data) {
//                 // รวมยอดขายตามเมนู
//                 const orders = orderRes.data.data;
//                 const menuReport = menuRes.data.data.map(menu => {
//                     const totalQty = orders
//                         .filter(o => o.menu_id === menu.menu_id)
//                         .reduce((sum, o) => sum + (o.order_qty || 0), 0);

//                     const totalSales = orders
//                         .filter(o => o.menu_id === menu.menu_id)
//                         .reduce((sum, o) => sum + (o.order_total || 0), 0);

//                     return {
//                         ...menu,
//                         total_qty: totalQty,
//                         total_sales: totalSales
//                     };
//                 });

//                 setReportData(menuReport);
//             }

//             setLoading(false);
//         } catch (error) {
//             console.error("❌ Error fetching menu report:", error);
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchMenuReport();
//     }, []);

//     return (
//         <div className="menu-report-container">
//             <h2>📊 ລາຍງານຍອດຂາຍເມນູ</h2>
//             {loading ? (
//                 <p>⏳ กำลังโหลดข้อมูล...</p>
//             ) : (
//                 <table className="report-table">
//                     <thead>
//                         <tr>
//                             <th>#</th>
//                             <th>ເມນູ</th>
//                             <th>ຈຳນວນທີ່ຂາຍ</th>
//                             <th>ຍອດລວມ (kip)</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {reportData.length === 0 ? (
//                             <tr>
//                                 <td colSpan="4">ไม่มีข้อมูล</td>
//                             </tr>
//                         ) : (
//                             reportData.map((item, index) => (
//                                 <tr key={index}>
//                                     <td>{index + 1}</td>
//                                     <td>{item.menu_name}</td>
//                                     <td>{item.total_qty}</td>
//                                     <td>{item.total_sales.toLocaleString()}</td>
//                                 </tr>
//                             ))
//                         )}
//                     </tbody>
//                 </table>
//             )}
//         </div>
//     );
// }

// export default MenuReport;
import React, { useEffect, useState } from "react";
import Axios from "axios";
import "../../css/MenuReport.css";

function MenuReport() {
    const [reportData, setReportData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    /** ===== ดึงข้อมูลเมนู + รายการขาย ===== */
    const fetchMenuReport = async () => {
        try {
            console.log("🔄 เริ่มดึงข้อมูลเมนู...");

            const menuRes = await Axios.post(
                "http://localhost:5000/v1/store/fetch",
                {
                    db_type: "mysql",
                    store_code: "tb_menu",
                    field_list: ["menu_id", "menu_name", "menu_price"],
                    where: "*"
                },
                { headers: { "Content-Type": "application/json" } }
            );

            const orderRes = await Axios.post(
                "http://localhost:5000/v1/store/fetch",
                {
                    db_type: "mysql",
                    store_code: "tb_order_detail",
                    field_list: ["menu_id", "order_qty", "order_total"],
                    where: "*"
                },
                { headers: { "Content-Type": "application/json" } }
            );

            if (menuRes.data?.data && orderRes.data?.data) {
                const orders = orderRes.data.data;
                const menuReport = menuRes.data.data.map(menu => {
                    const totalQty = orders
                        .filter(o => o.menu_id === menu.menu_id)
                        .reduce((sum, o) => sum + (o.order_qty || 0), 0);

                    const totalSales = orders
                        .filter(o => o.menu_id === menu.menu_id)
                        .reduce((sum, o) => sum + (o.order_total || 0), 0);

                    return {
                        ...menu,
                        total_qty: totalQty,
                        total_sales: totalSales
                    };
                });

                setReportData(menuReport);
                setFilteredData(menuReport);
            }

            setLoading(false);
        } catch (error) {
            console.error("❌ Error fetching menu report:", error);
            setLoading(false);
        }
    };

    /** ===== ฟังก์ชันค้นหา ===== */
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim() === "") {
            setFilteredData(reportData);
        } else {
            const filtered = reportData.filter(item =>
                item.menu_name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredData(filtered);
        }
    };

    useEffect(() => {
        fetchMenuReport();
    }, []);

    return (
        <div className="menu-report-container">
            <h2>📊 ລາຍງານຍອດຂາຍເມນູ</h2>

            {/* กล่องค้นหา */}
            <form className="menu-search-form" onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="🔍 ค้นหาเมนู..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit">ค้นหา</button>
            </form>

            {loading ? (
                <p>⏳ กำลังโหลดข้อมูล...</p>
            ) : (
                <table className="report-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>ເມນູ</th>
                            <th>ຈຳນວນທີ່ຂາຍ</th>
                            <th>ຍອດລວມ (kip)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length === 0 ? (
                            <tr>
                                <td colSpan="4">ไม่มีข้อมูล</td>
                            </tr>
                        ) : (
                            filteredData.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.menu_name}</td>
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

export default MenuReport;
