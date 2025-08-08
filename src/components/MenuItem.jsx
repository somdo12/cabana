import React from "react";

const MenuItem = ({ item, onOrderClick, onDetailClick, menuTypeData }) => {
    // console.log(item);
    const menuTypeName = menuTypeData?.find(
        (type) => type.menu_type_id === item.menu_type_id
    )?.menu_type_name || "ไม่ทราบประเภท";

    // ✅ แปลงราคาด้วย toLocaleString
    const formattedPrice = Number(item.menu_price).toLocaleString();

    return (
        <div className="menu-item">
            {/* ✅ รูปภาพไม่มี onClick แล้ว */}
            <img
                className="menu-image"
                src={`http://${window.location.hostname}:5000/storages/images/${item.image}`}
                alt={item.menu_name}
            />
            
            {/* ✅ ชื่อเมนูสามารถคลิกได้ */}
            <div 
                className="menu-info menu-name-clickable" 
                onClick={() => onOrderClick(item)}
                style={{ cursor: 'pointer' }}
            >
                {item.menu_name}
            </div>
            
            <div className="menu-info">ປະເພດ: {menuTypeName}</div>

            {/* ✅ ราคาแบบมี comma และไอคอน */}
            <div className="menu-price"> {formattedPrice} kip</div>

            {/* ✅ ปุ่มทั้งสองอยู่แถวเดียวกัน */}
            <div className="menu-buttons" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button 
                    className="add-to-cart-btn" 
                    onClick={() => onOrderClick(item)}
                >
                    ເພີ່ມເຂົ້າຕະກຮ້າ
                </button>

                <button className="menu-detail-btn" onClick={() => onDetailClick(item)}>
                    ເບິ່ງລາຍລະອຽດ
                </button>
            </div>
        </div>
    );
};

export default MenuItem;