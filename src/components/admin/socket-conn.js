// import { io } from "socket.io-client";
// import axios from "axios";

// const socketPromise = axios
//     .get("http://localhost:5000/v1/wifi-ipv4")
//     .then((res) => {
//         const ip = res.data.ip;
//         console.log("DEBUG: Connecting to Socket Server:", `http://${ip}:4000`);
//         return io(`http://${ip}:4000`, {
//             transports: ["websocket", "polling"],
//         });
//     })
//     .catch((err) => {
//         console.error("Socket connection failed:", err);
//         return null;
//     });

// export default socketPromise;

// ໂຕນີ້ໃໍຊ້ງານໄດ້ 100
// import { io } from "socket.io-client";

// // ใช้ hostname ปัจจุบัน แทน localhost เพื่อรองรับการเข้าผ่าน IP
// const SOCKET_URL = `http://${window.location.hostname}:4000`;

// console.log("DEBUG: Initializing socket-conn.js");
// console.log("DEBUG: Hostname =", window.location.hostname);
// console.log("DEBUG: Connecting to Socket Server:", SOCKET_URL);

// const socket = io(SOCKET_URL, {
//     transports: ["websocket", "polling"],
// });

// // Debug log เมื่อเชื่อมต่อสำเร็จ
// socket.on("connect", () => {
//     console.log("DEBUG: Socket connected with ID:", socket.id);
// });

// // Debug log เมื่อ disconnect
// socket.on("disconnect", () => {
//     console.warn("⚠️ DEBUG: Socket disconnected");
// });

// // Log ทุก Event ที่ได้รับ
// socket.onAny((event, ...args) => {
//     console.log(`DEBUG: Socket Event [${event}]`, args);
// });

// export default socket;
// src/socket-conn.js
import { io } from "socket.io-client";

// ใช้ hostname ปัจจุบันแทน localhost เพื่อรองรับการเข้าผ่าน IP
const SOCKET_PORT = 4000;
const SOCKET_URL = `http://${window.location.hostname}:${SOCKET_PORT}`;

console.log("DEBUG: Initializing socket-conn.js");
console.log("DEBUG: Hostname =", window.location.hostname);
console.log("DEBUG: Connecting to Socket Server:", SOCKET_URL);

// สร้าง instance ของ socket
const socket = io(SOCKET_URL, {
    transports: ["websocket", "polling"],
    reconnectionAttempts: 5, // ลอง reconnect 5 ครั้งถ้าหลุด
    reconnectionDelay: 1000,  // หน่วงเวลา 1 วินาทีต่อครั้ง
});

// Event: เมื่อเชื่อมต่อสำเร็จ
socket.on("connect", () => {
    console.log(`DEBUG: Socket connected with ID: ${socket.id}`);
});

// Event: เมื่อ disconnect
socket.on("disconnect", (reason) => {
    console.warn(`⚠️ DEBUG: Socket disconnected (Reason: ${reason})`);
});

// Event: Log ทุก event ที่ได้รับ (ใช้เพื่อ debug)
socket.onAny((event, ...args) => {
    console.log(`DEBUG: [Socket Event] ${event}`, args);
});

export default socket;
