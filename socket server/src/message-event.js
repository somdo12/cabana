// socketEvents.js

module.exports = function messageSocketEvent(io, socket) {
    console.log('[messageSocketEvent] Connected to socket server');

    socket.on('send_message', (data) => {
        console.log('New message from client:', data);

        const newData = {
            name: data.name,
            message: data.message
        };

        io.emit('receive_message', newData); // แนะนำให้เปลี่ยนชื่อ event ให้สื่อความหมายถ้าจำเป็น เช่น 'broadcast_message'
    });

    socket.on('send_chat_status', (data) => {
        console.log('New message from client:', data);
    });
    // เพิ่ม event อื่น ๆ ได้ตรงนี้
};
