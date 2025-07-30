// import React from "react";
// const DetailModal = ({ menu, onClose }) => {
//     console.log(menu);

//     if (!menu) return null;

//     return (
//         <div className="modal-overlay" onClick={onClose}>
//             <div className="modal-content" onClick={(e) => e.stopPropagation()}>

//                 {/* ปุ่มปิด */}
//                 <button className="modal-close-btn" onClick={onClose}>×</button>

//                 {/* รูปเมนู */}
//                 <img

//                     className="modal-menu-image"
//                     // src={`/img/${menu.image}`}
//                     // src={`http://localhost:5000/storages/images/${menu.image}`}
            
//                     src={`http://${window.location.hostname}:5000/storages/images/${menu.image}`}


//                     alt={menu.menu_name}
//                 />

            
//                 <h2>{menu.menu_name}</h2>

            
//                 <p>
//                     <strong>💰 ລາຄາ:</strong> {Number(menu.menu_price).toLocaleString()} ກີບ
//                 </p>

            
//                 <p>
//                     <strong>📖 ລາຍລະອຽດ:</strong> {menu.description || "ບໍ່ມີຂໍ້ມູນ"}
//                 </p>
//             </div>
//         </div>
//     );
// };

// export default DetailModal;
import React from "react";

const DetailModal = ({ menu, onClose }) => {
    console.log(menu);

    if (!menu) return null;

    // ดึง hostname ของเครื่องปัจจุบัน (ทั้งคอมและมือถือ)
    const serverHost = window.location.hostname;
    const imageURL = `http://${serverHost}:5000/storages/images/${menu.image}`;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                
                {/* ปุ่มปิด */}
                <button className="modal-close-btn" onClick={onClose}>×</button>

                {/* รูปเมนู */}
                <img
                    className="modal-menu-image"
                    src={imageURL}
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
