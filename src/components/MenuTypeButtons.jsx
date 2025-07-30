
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Axios from "axios";
import "../css/MenuTypeButtons.css"; 
import { API_BASE_URL } from "../config"; // ใช้จาก config.js เพื่อความยืดหยุ่น

function MenuTypeButtons() {
    const [menuTypes, setMenuTypes] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    /** ====== ดึงข้อมูลประเภทเมนู ====== */
    useEffect(() => {
        const fetchMenuTypes = async () => {
            try {
                const result = await Axios.post(`${API_BASE_URL}/fetch`, {
                    db_type: "mysql",
                    store_code: "tb_menu_type",
                    field_list: "*",
                    where: "*"
                }, {
                    headers: { "Content-Type": "application/json" }
                });
                setMenuTypes(result.data.data || []);
            } catch (error) {
                console.error("fetchMenuTypes error:", error);
            }
        };

        fetchMenuTypes();
    }, []);

    /** ====== จัดการเปลี่ยนประเภทเมนู ====== */
    const handleChange = (e) => {
        const selectedType = e.target.value;
        navigate(selectedType ? `/menu?type=${selectedType}` : "/menu");
    };

    // ดึงค่าประเภทเมนูจาก URL
    const selectedTypeFromUrl = new URLSearchParams(location.search).get("type") || "";

    return (
    
        <div className="menu-type-buttons">
    <button
        className={`menu-type-btn ${selectedTypeFromUrl === "" ? "active" : ""}`}
        onClick={() => handleChange({ target: { value: "" } })}
    >
        Menu Type
    </button>

    {menuTypes.map((type) => (
        <button
            key={type.menu_type_id}
            className={`menu-type-btn ${
                selectedTypeFromUrl === type.menu_type_id ? "active" : ""
            }`}
            onClick={() => handleChange({ target: { value: type.menu_type_id } })}
        >
            {type.menu_type_name}
        </button>
    ))}
</div>

    );
}

export default MenuTypeButtons;
