// import { useEffect, useState } from "react";
// import { io } from "socket.io-client";

// // const socket = io("http://localhost:4000");

// function TestSocket() {
//     const [name, setName] = useState("");
//     const [message, setMessage] = useState("");
//     const [chat, setChat] = useState([]);

//     // useEffect(() => {
//     //     socket.on("receive_message", (data) => {
//     //         console.log("'receive_message' event : ", data);

//     //         const newMessage = `[${data.name}] ${data.message}`;
//     //         setChat((prev) => [...prev, newMessage]); // ເພີ່ມຂໍ້ມູນທີ່ສົ່ງມາລົງໃນ Chat state
//     //     });
//     // }, []);

//     // const sendMessage = () => {
//     //     if (socket) {
//     //         const messageData = { name: name, message: message };

//     //         socket.emit("send_message", messageData);
//     //         setMessage(""); // ຕັ່ງສະຖານະເປັນວ່າງເປົ່າ
//     //     }
//     // };

//     // const sendOrder = () => {
//     //     if (socket) {
//     //         const orderData = { name: name, message: message };
//     //         socket.emit('send_order', orderData);
//     //     }
//     // }

//     return (
//         <div>
//             {/* <h1>Socket.IO Chat</h1>
//             <div>
//                 <p>name : </p>
//                 <input value={name} onChange={(e) => setName(e.target.value)} />
//             </div>
//             <div>
//                 <p>message : </p>
//                 <input value={message} onChange={(e) => setMessage(e.target.value)} />
//             </div>
//             <button onClick={sendMessage}>Send</button>
//             <ul>
//                 {chat.map((msg, i) => (
//                     <li key={i}>{msg}</li>
//                 ))}
//             </ul> */}
//         </div>
//     );
// }

// export default TestSocket;