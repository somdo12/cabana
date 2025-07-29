import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Axios from "axios";
import "../../css/Bill.css";

const Bill = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [orderDetails, setOrderDetails] = useState([]);
    const [menuMap, setMenuMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

  const fetchOrder = async () => {
    try {
        const res = await Axios.post("http://localhost:5000/v1/store/fetch", {
            db_type: "mysql",
            store_code: "tb_order",
            field_list: "*",
            where: { order_id: Number(orderId) } // ✅ ใช้ object และ Number
        }, {
            headers: { "Content-Type": "application/json" }
        });

        console.log("fetchOrder result:", res.data);

        if (res.data.data && res.data.data.length > 0) {
            setOrder(res.data.data[0]);
        } else {
            setError("ไม่พบข้อมูลคำสั่งซื้อ");
        }
    } catch (err) {
        console.error("fetchOrder error:", err);
        setError("เกิดข้อผิดพลาดในการดึงข้อมูลคำสั่งซื้อ");
    }
};


    const fetchOrderDetails = async () => {
        try {
            const res = await Axios.post("http://localhost:5000/v1/store/fetch", {
                db_type: "mysql",
                store_code: "tb_order_detail",
                field_list: "*",
                where: { order_id: Number(orderId) }
            }, {
                headers: { "Content-Type": "application/json" }

            });

            console.log("fetchOrderDetails result:", res.data);

            setOrderDetails(res.data.data || []);
        } catch (err) {
            console.error("fetchOrderDetails error:", err);
            setError("เกิดข้อผิดพลาดในการดึงรายละเอียดคำสั่งซื้อ");
        }
    };

    const fetchMenuMap = async () => {
        try {
            const res = await Axios.post("http://localhost:5000/v1/store/fetch", {
                db_type: "mysql",
                store_code: "tb_menu",
                field_list: "*",
                where: "*"   // ✅ โหลดทุกเมนู
            });

            const menus = res.data.data || [];
            const map = {};
            menus.forEach((menu) => {
                map[menu.menu_id] = menu.menu_name;
            });
            setMenuMap(map);

            console.log("fetchMenuMap:", map);
        } catch (err) {
            console.error("fetchMenuMap error:", err);
        }
    };


    useEffect(() => {
        console.log("OrderId from URL:", orderId);
        const loadData = async () => {
            setLoading(true);
            await fetchOrder();
            await fetchOrderDetails();
            await fetchMenuMap();
            setLoading(false);
        };
        loadData();
    }, [orderId]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) return <p>⏳ กำลังโหลดข้อมูล...</p>;
    if (error) return <p style={{ color: "red" }}>❌ {error}</p>;

    return (
        <div className="bill-container">
            <h2>🧾 ໃບສັ່ງຊື້</h2>
            <p>Order ID: {order?.order_id}</p>
            <p>ວັນທີ: {new Date(order?.order_date).toLocaleString("la-LA")}</p>
            <hr />

            <h3>ລາຍການ:</h3>
            <table className="bill-table">
                <thead>
                    <tr>
                        <th>ເມນູ</th>
                        <th>ຈຳນວນ</th>
                        <th>ລາຄາ</th>
                        <th>ລວມ</th>
                    </tr>
                </thead>
                <tbody>
                    {orderDetails.map((item, idx) => (
                        <tr key={idx}>
                            <td>{menuMap[item.menu_id] || `Menu #${item.menu_id}`}</td>
                            <td>{item.order_qty}</td>
                            <td>{item.order_price.toLocaleString()} kip</td>
                            <td>{item.order_total.toLocaleString()} kip</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3 className="total-price">
                ລາຄາລວມ: {order?.total_price?.toLocaleString()} kip
            </h3>

            <button className="print-btn" onClick={handlePrint}>
                🖨 ພິມໃບສັ່ງຊື້
            </button>
        </div>
    );
};

export default Bill;
