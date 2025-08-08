
import "../css/OrderModal.css";

const OrderModal = ({ menu, quantity, note, onClose, onAddToCart, onQuantityChange, onNoteChange }) => {
    if (!menu) return null;
    // เพิ่มใน OrderModal ก่อน return
    console.log("DEBUG OrderModal: note =", note);

    return (
        <div className="order-modal-overlay" onClick={onClose}>
            <div className="order-modal-content" onClick={(e) => e.stopPropagation()}>

                {/* รูปเมนู */}
                <img
                    className="modal-menu-image"
                    src={`http://${window.location.hostname}:5000/storages/images/${menu.image}`}
                    alt={menu.menu_name}
                />

                {/* ชื่อเมนู */}
                <h2>{menu.menu_name}</h2>

                {/* ราคาต่อหน่วย */}
                <p>
                    <strong>💰 ລາຄາ:</strong> {Number(menu.menu_price).toLocaleString()} ກີບ
                </p>

                {/* ปุ่มเพิ่ม/ลดจำนวน */}
                <div className="quantity-control">
                    <button onClick={() => onQuantityChange(-1)}>-</button>
                    <span>{quantity}</span>
                    <button onClick={() => onQuantityChange(1)}>+</button>
                </div>

                {/* ราคารวม */}
                <p>
                    <strong>📦 ລວມ:</strong> {(menu.menu_price * quantity).toLocaleString()} ກີບ
                </p>

                {/* ช่องหมายเหตุ */}
                <textarea
                    className="note-input"
                    placeholder="ໝາຍເຫດເພີ່ມເຕີມ (ຕົວຢ່າງ: ບໍ່ໃສ່ນ້ຳຕານ)"
                    value={note}
                    onChange={(e) => onNoteChange(e.target.value)}
                />

                {/* ปุ่มยืนยัน */}
                <button className="confirm-order-btn" onClick={onAddToCart}>
                    ➕ ເພີ່ມໃສ່ກະຕ່າສິນຄ້າ
                </button>

                {/* ปุ่มปิด */}
                <button className="modal-close-btn" onClick={onClose}>ປິດ</button>
            </div>
        </div>
    );
};

export default OrderModal;
