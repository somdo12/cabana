// import { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import Axios from "axios";
// import "../css/MenuTypeButtons.css"; // อย่าลืมสร้างไฟล์นี้นะครับ

// function MenuTypeButtons() {
//     const [menuTypes, setMenuTypes] = useState([]);
//     const navigate = useNavigate();
//     const location = useLocation();
    
//     useEffect(() => {
//         fetchMenuTypes();
//     }, []);

//     const fetchMenuTypes = async () => {
//         try {
//             const uri = "http://localhost:5000/v1/store/fetch";
//             const bodyData = {
//                 db_type: "mysql",
//                 store_code: "tb_menu_type",
//                 field_list: "*",
//                 where: "*"
//             };
//             const headers = { "Content-Type": "application/json" };
//             const result = await Axios.post(uri, bodyData, headers);
//             setMenuTypes(result.data.data || []);
//         } catch (error) {
//             console.error("fetchMenuTypes error", error);
//         }
//     };

//     const handleChange = (e) => {
//         const selectedType = e.target.value;
//         if (selectedType === "") {
//             navigate("/menu");
//         } else {
//             navigate(`/menu?type=${selectedType}`);
//         }
//     };
//     // console.log("location.search", location.search);

//     const selectedTypeFromUrl = new URLSearchParams(location.search).get('type') || "";

//     return (
//         <div className="menu-type-dropdown">
//             <label className="dropdown-label"></label>
//             <select value={selectedTypeFromUrl} onChange={handleChange} className="dropdown-select">
//                 <option value="">Menu Type</option>
//                 {menuTypes.map((type) => (
//                     <option key={type.menu_type_id} value={type.menu_type_id}>
//                         {type.menu_type_name}
//                     </option>
//                 ))}
//             </select>
//         </div>
//     );
// }

// export default MenuTypeButtons;

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
        <div className="menu-type-dropdown">
            <select
                value={selectedTypeFromUrl}
                onChange={handleChange}
                className="dropdown-select"
            >
                <option value="">Menu Type</option>
                {menuTypes.map((type) => (
                    <option key={type.menu_type_id} value={type.menu_type_id}>
                        {type.menu_type_name}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default MenuTypeButtons;
