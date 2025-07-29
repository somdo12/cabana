// module.exports = (io, socket) => {
//     console.log("DEBUG: order-event.js loaded for socket:", socket.id);

//     // เมื่อมีการส่งออเดอร์จากลูกค้า
//     socket.on("send_order", (data) => {
//         console.log("📦 [Server] Received new order:", data);
//         // ส่งต่อ event ให้ทุก client ที่เชื่อมอยู่ (รวมถึง Admin)
//         io.emit("send_order", data);
//     });

//     // เมื่อมีการอัปเดตสถานะการจ่ายเงิน
//     socket.on("update_payment_status", (data) => {
//         console.log("💰 [Server] Payment status update:", data);
//         io.emit("update_payment_status", data);
//     });

//     // เมื่อมีการอัปเดตสถานะอาหาร
//     socket.on("update_order_detail_status", (data) => {
//         console.log("🍳 [Server] Order detail status update:", data);
//         io.emit("update_order_detail_status", data);
//     });
// };
module.exports = (io, socket) => {
    console.log("DEBUG: order-event.js loaded for socket:", socket.id);

    // เมื่อมีการส่งออเดอร์จากลูกค้า
    socket.on("send_order", (data) => {
        console.log("📦 [Server] Received new order:", data);
        io.emit("receive_new_order", data); // ให้ client ฟัง event "receive_new_order"
    });

    // เมื่อมีการอัปเดตสถานะการจ่ายเงิน
    socket.on("update_payment_status", (data) => {
        console.log("💰 [Server] Payment status update:", data);
        io.emit("receive_update_payment_status", data); // เปลี่ยนชื่อให้ตรง client
    });

    // เมื่อมีการอัปเดตสถานะอาหาร
    socket.on("update_order_detail_status", (data) => {
        console.log("🍳 [Server] Order detail status update:", data);
        io.emit("receive_update_order_detail_status", data); // ให้ client ฟัง event นี้
    });
};
