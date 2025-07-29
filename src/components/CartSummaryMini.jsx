
// import React, { useState } from "react";
// import Modal from "react-modal";
// import "../css/CartSummaryMini.css";
// import CartSummary from "./CartSummary";

// Modal.setAppElement("#root");

// const CartSummaryMini = ({ cart, onSubmitOrder, onRemoveFromCart }) => {
//     const [isOpen, setIsOpen] = useState(false);
//     const total = cart.reduce((sum, item) => sum + item.total, 0);

//     return (
//         <>
//             {/* ✅ ປຸ່ມລອຍມຸມຂວາລຸ່ມ */}
//             {cart.length > 0 && (
//                 <div className="cart-summary-mini">
//                     <button className="mini-cart-btn" onClick={() => setIsOpen(true)}>
//                         🛒 {cart.length} ລາຍການ | ລວມ: {total.toLocaleString()} kip
//                     </button>
//                 </div>
//             )}

//             {/* ✅ Popup ສະແດງ CartSummary */}
//             <Modal
//                 isOpen={isOpen}
//                 onRequestClose={() => setIsOpen(false)}
//                 contentLabel="Cart Summary"
//                 className="cart-modal"
//                 overlayClassName="cart-modal-overlay"
//             >
//                 <div className="cart-modal-content">
//                     <CartSummary
//                         cart={cart}
//                         onSubmitOrder={onSubmitOrder}
//                         onRemoveFromCart={onRemoveFromCart}
//                     />
//                     <button className="close-modal-btn" onClick={() => setIsOpen(false)}>
//                         ປິດ
//                     </button>
//                 </div>
//             </Modal>
//         </>
//     );
// };

// export default CartSummaryMini;

import React, { useState } from "react";
import "../css/CartSummaryMini.css";
import CartSummary from "./CartSummary";

const CartSummaryMini = ({ cart, onSubmitOrder, onRemoveFromCart }) => {
    const [isOpen, setIsOpen] = useState(false);
    const total = cart.reduce((sum, item) => sum + item.total, 0);

    return (
        <>
            {cart.length > 0 && (
                <div className="cart-summary-mini">
                    <button className="mini-cart-btn" onClick={() => setIsOpen(true)}>
                        🛒 {cart.length} ລາຍການ | ລວມ: {total.toLocaleString()} kip
                    </button>
                </div>
            )}

            {isOpen && (
                <div className="cart-modal-overlay" onClick={() => setIsOpen(false)}>
                    <div className="cart-modal-content" onClick={(e) => e.stopPropagation()}>
                        <CartSummary
                            cart={cart}
                            onSubmitOrder={onSubmitOrder}
                            onRemoveFromCart={onRemoveFromCart}
                        />
                        <button className="close-modal-btn" onClick={() => setIsOpen(false)}>
                            ປິດ
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default CartSummaryMini;

