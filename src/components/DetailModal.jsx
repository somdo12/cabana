
// import React from "react";

// const DetailModal = ({ menu, onClose }) => {
//     if (!menu) return null;

//     return (
//         <div className="modal-overlay" onClick={onClose}>
//             <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//                 <button className="modal-close-btn" onClick={onClose}>×</button>
//                 <img className="modal-menu-image" src={`/img/${menu.image}`} alt={menu.menu_name} />
//                 <h2>{menu.menu_name}</h2>
                
//                 <p><strong>💰 ລາຄາ:</strong> {Number(menu.menu_price).toLocaleString()} ກີບ</p>

//                 <p><strong>📖 ລາຍລະອຽດ:</strong> {menu.description || 'ບໍ່ມີຂໍ້ມູນ'}</p>
//             </div>
//         </div>
//     );
// };

// export default DetailModal;

import React from "react";
// import "../css/DetailModal.css";   // ถ้ามีไฟล์ CSS ของ modal แนะนำให้ import ที่นี่

const DetailModal = ({ menu, onClose }) => {
    if (!menu) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>

                {/* ปุ่มปิด */}
                <button className="modal-close-btn" onClick={onClose}>×</button>

                {/* รูปเมนู */}
                <img
                    className="modal-menu-image"
                    src={`/img/${menu.image}`}
                    alt={menu.menu_name}
                />

                {/* ชื่อเมนู */}
                <h2>{menu.menu_name}</h2>

                {/* ราคา */}
                <p>
                    <strong>💰 ລາຄາ:</strong> {Number(menu.menu_price).toLocaleString()} ກີບ
                </p>

                {/* รายละเอียด */}
                <p>
                    <strong>📖 ລາຍລະອຽດ:</strong> {menu.description || "ບໍ່ມີຂໍ້ມູນ"}
                </p>
            </div>
        </div>
    );
};

export default DetailModal;
