import React, { useEffect, useState } from "react";
import axios from "axios";
import { ENDPOINTS } from "../../config";
import "../../css/UserList.css"; // ใช้ style เดิม

function DeleteHistory() {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        fetchLogs();
    }, []);

    // ดึงข้อมูลประวัติการลบจาก user_activity_log
    const fetchLogs = async () => {
    try {
        const bodyData = {
            db_type: "mysql",
            store_code: "user_activity_log",
            field_list: "*",
            where: "*" // ดึงทั้งหมดก่อน แล้วค่อย filter ใน frontend
        };
        console.log("🔄 ກຳລັງດຶງປະຫວັດການລົບ:", bodyData);
        const result = await axios.post(ENDPOINTS.FETCH, bodyData);
        console.log("✅ ດຶງປະຫວັດສຳເລັດ:", result.data);

        const allLogs = result.data.data || [];
        // filter เอาเฉพาะ action ที่เป็น "ລົບຜູ້ໃຊ້"
        const filteredLogs = allLogs.filter(log => log.action.startsWith("ລົບຜູ້ໃຊ້"));
        setLogs(filteredLogs);
    } catch (error) {
        console.error("❌ ຜິດພາດໃນການດຶງປະຫວັດການລົບ:", error.response || error);
    }
};


    return (
        <div className="user-list-container noto-sans-lao">
            <h2>🗑️ ປະຫວັດການລົບຜູ້ໃຊ້</h2>
            <table className="user-table">
                <thead>
                    <tr>
                        <th>ລະຫັດ</th>
                        <th>ການກະທຳ</th>
                        <th>ຜູ້ທີ່ລົບ</th>
                        <th>ວັນ ແລະ ເວລາ</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.length > 0 ? (
                        logs.map((log, idx) => (
                            <tr key={idx}>
                                <td>{log.log_id || idx + 1}</td>
                                <td>{log.action}</td>
                                <td>{log.performed_by}</td>
                                <td>{new Date(log.performed_at).toLocaleString()}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" style={{ textAlign: "center" }}>
                                ບໍ່ມີປະຫວັດການລົບ
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default DeleteHistory;
