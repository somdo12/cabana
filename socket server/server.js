// const express = require('express');
// const http = require('http');
// const cors = require('cors');
// const { Server } = require('socket.io');
// const messageSocketEvent = require('./src/message-event');
// const bookingEvent = require('./src/booking-event');
// const orderEvent = require('./src/order-event');

// const app = express();
// app.use(cors({
//     origin: "*",
//     methods: ["GET", "POST"],
//     allowedHeaders: ["Content-Type", "Authorization"],
// }));

// const server = http.createServer(app);

// // ตั้งค่า Socket.IO ให้เปิดกว้างทุก origin
// const io = new Server(server, {
//     cors: {
//         origin: "*",
//         methods: ["GET", "POST"],
//         allowedHeaders: ["Content-Type"],
//         credentials: true,
//     },
// });


// io.on('connection', (socket) => {
//     console.log('User connected:', socket.id);

//     messageSocketEvent(io, socket);
//     bookingEvent(io, socket);
//     orderEvent(io, socket);

//     socket.on('disconnect', () => {
//         console.log('User disconnected:', socket.id);
//     });
// });

// server.listen(4000, () => {
//     console.log("Server is running on port 4000");
// });
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const messageSocketEvent = require('./src/message-event');
const bookingEvent = require('./src/booking-event');
const orderEvent = require('./src/order-event'); // ✅ เพิ่มบรรทัดนี้

const app = express();
app.use(cors({ origin: "*", methods: ["GET", "POST"] }));

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Event Modules
    messageSocketEvent(io, socket);
    bookingEvent(io, socket);
    orderEvent(io, socket); // ✅ เรียกใช้ order-event

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

server.listen(4000, () => {
    console.log("Server is running on port 4000");
});
