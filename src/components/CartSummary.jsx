
// const CartSummary = ({ cart, onSubmitOrder, onRemoveFromCart }) => {
//     const total = cart.reduce((sum, item) => sum + item.total, 0);

//     return (
//         <div className="cart-summary">
//             <h3>🛒 ກະຕ່າສິນຄ້າຂອງທ່ານ:</h3>
//             {cart.map((item, index) => (
//                 <div key={index}>
//                     {item.menu_name} × {item.quantity} = {item.total.toLocaleString()} kip{" "}
//                     <button
//                         className="remove-btn"
//                         onClick={() => onRemoveFromCart(index)}
//                     >
//                         ລຶບ
//                     </button>
//                 </div>
//             ))}
//             <p><strong>ລວມ:</strong> {total.toLocaleString()} kip</p>
//             <button
//                 onClick={() => {
//                     const confirmed = window.confirm("ທ່ານຢືນຢັນທີ່ຈະສັ່ງຊື້ແທ້ບໍ?");
//                     if (confirmed) {
//                         onSubmitOrder();
//                     }
//                 }}
//             >
//                 ✅ ຢືນຢັນການສັ່ງຊື້
//             </button>
//         </div>
//     );
// };

// export default CartSummary;

// 7777777777777777777777777777777777777
// const CartSummary = ({ cart, onSubmitOrder, onRemoveFromCart }) => {
//     const total = cart.reduce((sum, item) => sum + item.total, 0);

//     // ฟังก์ชันยืนยันการสั่งซื้อ
//     const handleConfirmOrder = () => {
//         const confirmed = window.confirm("ທ່ານຢືນຢັນທີ່ຈະສັ່ງຊື້ແທ້ບໍ?");
//         if (confirmed) onSubmitOrder();
//     };

//     return (
//         <div className="cart-summary">
//             {/* หัวข้อ */}
//             <h3>🛒 ກະຕ່າສິນຄ້າຂອງທ່ານ:</h3>

//             {/* รายการในตะกร้า */}
//             {cart.map((item, index) => (
//                 <div key={index} className="cart-item">
//                     {item.menu_name} × {item.quantity} = {item.total.toLocaleString()} kip{" "}
//                     <button className="remove-btn" onClick={() => onRemoveFromCart(index)}>
//                         ລຶບ
//                     </button>
//                 </div>
//             ))}

//             {/* ราคารวม */}
//             <p><strong>ລວມ:</strong> {total.toLocaleString()} kip</p>

//             {/* ปุ่มยืนยันการสั่งซื้อ */}
//             <button className="confirm-order-btn" onClick={handleConfirmOrder}>
//                 ✅ ຢືນຢັນການສັ່ງຊື້
//             </button>
//         </div>
//     );
// };

// export default CartSummary;
import React from "react";
import "../css/CartSummary.css";

const CartSummary = ({ cart, onSubmitOrder, onRemoveFromCart }) => {
    const total = cart.reduce((sum, item) => sum + item.total, 0);

    return (
        <div className="cart-summary-popup">
            <h3 className="cart-title">🛒 ກະຕ່າສິນຄ້າ</h3>
            
            {cart.length === 0 ? (
                <p className="cart-empty">ຍັງບໍ່ມີລາຍການ</p>
            ) : (
                <>
                    <div className="cart-items">
                        {cart.map((item, index) => (
                            <div className="cart-item" key={index}>
                                <span className="item-name">{item.menu_name} × {item.quantity}</span>
                                <span className="item-price">{item.total.toLocaleString()} kip</span>
                                <button
                                    className="remove-btn"
                                    onClick={() => onRemoveFromCart(index)}
                                >
                                    ລຶບ
                                </button>
                            </div>
                        ))}
                    </div>
                    <p className="cart-total">
                        <strong>ລວມ:</strong> {total.toLocaleString()} kip
                    </p>
                    <button
                        className="confirm-order-btn"
                        onClick={() => {
                            const confirmed = window.confirm("ທ່ານຢືນຢັນທີ່ຈະສັ່ງຊື້ແທ້ບໍ?");
                            if (confirmed) onSubmitOrder();
                        }}
                    >
                        ✅ ຢືນຢັນການສັ່ງຊື້
                    </button>
                </>
            )}
        </div>
    );
};

export default CartSummary;
