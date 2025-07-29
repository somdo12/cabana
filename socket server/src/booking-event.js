

module.exports = function bookingSocketEvent(io, socket) {
    console.log('[bookingSocketEvent] Connected to socket server');

    socket.on('send_booking', (data) => {
        console.log('New booking from client:', data);

        const newData = {
            name: data.name,
            message: data.message
        };
    });
}