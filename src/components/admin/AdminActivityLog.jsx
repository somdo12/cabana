
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ENDPOINTS } from "../../config";
import "../../css/AdminActivityLog.css";

const AdminActivityLog = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    // ฟังก์ชันฟอร์แมตเวลา
    const formatDateTime = (datetime) => {
        const date = new Date(datetime);
        if (isNaN(date)) return datetime; // ถ้าไม่สามารถ parse เป็นวันที่ ให้คืนค่าเดิม

        const pad = (n) => (n < 10 ? "0" + n : n);
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    };

    // ดึงข้อมูล log
    const fetchLogs = async () => {
        try {
            const bodyData = {
                db_type: "mysql",
                store_code: "user_activity_log",
                field_list: "*",
                where: "*",
            };
            const response = await axios.post(ENDPOINTS.FETCH, bodyData);
            setLogs(response.data.data || []);
        } catch (error) {
            console.error("❌ ດຶງ log ຜິດພາດ:", error.response || error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    return (
        <div className="activity-log-container">
            <h2>📜 ປະຫວັດການຈັດການພະນັກງານ</h2>
            {loading ? (
                <p>⏳ ກຳລັງໂຫຼດ...</p>
            ) : logs.length > 0 ? (
                <table className="activity-log-table">
                    <thead>
                        <tr>
                            <th>ລະຫັດ</th>
                            <th>ການກະທຳ</th>
                            <th>ໂດຍ</th>
                            <th>ບົດບາດ</th>
                            <th>Target ID</th>
                            <th>ວັນເວລາ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log) => (
                            <tr key={log.log_id}>
                                <td>{log.log_id}</td>
                                <td>{log.action}</td>
                                <td>{log.performed_by}</td>
                                <td>{log.performed_role}</td>
                                <td>{log.target_user_id}</td>
                                <td>{formatDateTime(log.performed_at)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>❌ ບໍ່ມີຂໍ້ມູນ log</p>
            )}
        </div>
    );
};

export default AdminActivityLog;
