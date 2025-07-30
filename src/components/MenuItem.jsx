
import React from "react";
const MenuItem = ({ item, onOrderClick, onDetailClick, menuTypeData }) => {
    console.log(item);
    const menuTypeName = menuTypeData?.find(
        (type) => type.menu_type_id === item.menu_type_id
    )?.menu_type_name || "ไม่ทราบประเภท";

    // ✅ แปลงราคาด้วย toLocaleString
    const formattedPrice = Number(item.menu_price).toLocaleString();

    return (
        <div className="menu-item">
            <img
                className="menu-image"
                src={`http://${window.location.hostname}:5000/storages/images/${item.image}`}
                alt={item.menu_name}
                onClick={() => onOrderClick(item)}
            />
            <div className="menu-info">{item.menu_name}</div>
            <div className="menu-info">ປະເພດ: {menuTypeName}</div>

            {/* ✅ ราคาแบบมี comma และไอคอน */}
            <div className="menu-price"> {formattedPrice} kip</div>

            <button className="menu-detail-btn" onClick={() => onDetailClick(item)}>
                ເບິ່ງລາຍລະອຽດ
            </button>
        </div>
    );
};

export default MenuItem;
