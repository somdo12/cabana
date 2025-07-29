module.exports = function orderSocketEvent(io, socket) {
    console.log('[orderSocketEvent] Connected to socket server');

    socket.on('update_order_detail_status', (data) => {
        console.log('🛠️ order from admin:', data);

        io.emit('receive_update_order_detail_status', data); // ส่งกลับให้ทุกคน (รวมลูกค้า)
    });
    socket.on('update_payment_status', (data) => {
        console.log('Payment status update from admin:', data);
        io.emit('receive_update_payment_status', data); // บอกฝั่งลูกค้า
    });


    socket.on('send_order', (data) => {
        console.log('📦 New order from client:', data);

        io.emit('receive_new_order', data); // 🔥 แจ้งแอดมินให้โหลดข้อมูลใหม่
    });
};
