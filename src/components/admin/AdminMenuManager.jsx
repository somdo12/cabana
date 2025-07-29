
// import React, { useEffect, useState } from "react";
// import Axios from "axios";
// import "../../css/AdminMenuManager.css";

// function AdminMenuManager() {
//     const [menus, setMenus] = useState([]);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//     const [menuTypes, setMenuTypes] = useState([]);
//     const [menuTypeMap, setMenuTypeMap] = useState({});

//     const [newMenu, setNewMenu] = useState({
//         menu_name: "",
//         menu_price: "",
//         menu_type_id: "",
//         image: ""
//     });

//     const [editMenu, setEditMenu] = useState(null);

//     const handleAddMenu = async () => {
//         try {
//             console.log("📤 Adding menu:", newMenu);
//             const res = await Axios.post("http://localhost:5000/v1/store/create", {
//                 db_type: "mysql",
//                 store_code: "tb_menu",
//                 set: {
//                     menu_name: newMenu.menu_name,
//                     menu_type_id: parseInt(newMenu.menu_type_id),
//                     menu_price: parseInt(newMenu.menu_price),
//                     image: newMenu.image
//                 }
//             }, {
//                 headers: { "Content-Type": "application/json" }
//             });

//             console.log("✅ Add Menu Response:", res.data);
//             const msg = res.data?.message?.toLowerCase() || "";

//             if (msg.includes("successfully created")) {
//                 alert("✅ เพิ่มเมนูสำเร็จแล้ว");
//                 setIsModalOpen(false);
//                 fetchMenus();
//                 setNewMenu({ menu_name: "", menu_price: "", menu_type_id: "", image: "" });
//             } else {
//                 alert("❌ เพิ่มเมนูไม่สำเร็จ: " + msg);
//             }

//         } catch (err) {
//             console.error("❌ addMenu error", err);
//             alert("❌ เกิดข้อผิดพลาดในการเพิ่มเมนู");
//         }
//     };

//     const handleUpdateMenu = async () => {
//         try {
//             console.log("📤 Updating menu:", editMenu);
//             const res = await Axios.post("http://localhost:5000/v1/store/edit", {
//                 db_type: "mysql",
//                 store_code: "tb_menu",
//                 where: { menu_id: editMenu.menu_id },
//                 set: {
//                     menu_name: editMenu.menu_name,
//                     menu_price: parseInt(editMenu.menu_price),
//                     menu_type_id: parseInt(editMenu.menu_type_id),
//                     image: editMenu.image
//                 }
//             }, {
//                 headers: { "Content-Type": "application/json" }
//             });

//             console.log("✅ Update Menu Response:", res.data);
//             const msg = res.data?.message?.toLowerCase() || "";
//             if (msg.includes("edited")) {
//                 alert("✅ แก้ไขเมนูเรียบร้อยแล้ว");
//                 setIsEditModalOpen(false);
//                 fetchMenus();
//             } else {
//                 alert("❌ ไม่สามารถแก้ไขเมนูได้: " + msg);
//             }
//         } catch (error) {
//             console.error("❌ handleUpdateMenu error", error);
//             alert("❌ เกิดข้อผิดพลาดขณะอัปเดตเมนู");
//         }
//     };

//     const fetchMenus = async () => {
//         try {
//             const res = await Axios.post("http://localhost:5000/v1/store/fetch", {
//                 db_type: "mysql",
//                 store_code: "tb_menu",
//                 field_list: "*",
//                 where: "*"
//             }, {
//                 headers: { "Content-Type": "application/json" }
//             });
//             console.log("📥 Menus fetched:", res.data.data);
//             setMenus(res.data.data || []);
//         } catch (error) {
//             console.error("❌ fetchMenus error:", error);
//         }
//     };

//     useEffect(() => {
//         fetchMenus();
//         const fetchMenuTypes = async () => {
//             try {
//                 const res = await Axios.post("http://localhost:5000/v1/store/fetch", {
//                     db_type: "mysql",
//                     store_code: "tb_menu_type",
//                     field_list: "*",
//                     where: "*"
//                 }, {
//                     headers: { "Content-Type": "application/json" }
//                 });

//                 const types = res.data.data || [];
//                 console.log("📥 Menu types:", types);
//                 setMenuTypes(types);

//                 const map = {};
//                 types.forEach(t => {
//                     map[t.menu_type_id] = t.menu_type_name;
//                 });
//                 setMenuTypeMap(map);
//             } catch (err) {
//                 console.error("❌ fetchMenuTypes error", err);
//             }
//         };

//         fetchMenuTypes();

//     }, []);

//     const deleteMenu = async (menuId) => {
//         const confirmDelete = window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบเมนูนี้?");
//         if (!confirmDelete) return;

//         try {
//             const res = await Axios.post("http://localhost:5000/v1/store/delete", {
//                 db_type: "mysql",
//                 store_code: "tb_menu",
//                 where: { menu_id: menuId }
//             }, {
//                 headers: { "Content-Type": "application/json" }
//             });

//             console.log("🗑️ Delete response:", res.data);
//             const msg = res.data?.message?.toLowerCase() || "";
//             if (msg.includes("has been deleted")) {
//                 alert("✅ ลบเมนูเรียบร้อยแล้ว");
//                 fetchMenus();
//             } else {
//                 alert("❌ ลบเมนูไม่สำเร็จ: " + msg);
//             }
//         } catch (err) {
//             console.error("❌ deleteMenu error:", err);
//             alert("❌ เกิดข้อผิดพลาดในการลบเมนู");
//         }
//     };

//     return (
//         <div className="menu-manager">
//             <h2>จัดการเมนู</h2>
//             <button className="add-btn" onClick={() => setIsModalOpen(true)}>
//                 ➕ เพิ่มเมนูใหม่
//             </button>

//             <table>
//                 <thead>
//                     <tr>
//                         <th>รูป</th>
//                         <th>ชื่อเมนู</th>
//                         <th>ประเภท</th>
//                         <th>ราคา</th>
//                         <th>การจัดการ</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {menus.map(menu => (
//                         <tr key={menu.menu_id}>
//                             <td><img src={`/img/${menu.image}`} alt={menu.menu_name} className="menu-img" /></td>
//                             <td>{menu.menu_name}</td>
//                             <td>{menuTypeMap[menu.menu_type_id] || menu.menu_type_id}</td>
//                             <td>{menu.menu_price.toLocaleString()} kip</td>
//                             <td>
//                                 <button className="edit-btn" onClick={() => { setEditMenu(menu); setIsEditModalOpen(true); }}>✏️</button>
//                                 <button className="delete-btn" onClick={() => deleteMenu(menu.menu_id)}>🗑️</button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>

//             {isModalOpen && (
//                 <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
//                     <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//                         <h3>➕ เพิ่มเมนูใหม่</h3>

//                         <input type="text" placeholder="ชื่อเมนู" value={newMenu.menu_name} onChange={(e) => setNewMenu({ ...newMenu, menu_name: e.target.value })} />
//                         <input type="number" placeholder="ราคา" value={newMenu.menu_price} onChange={(e) => setNewMenu({ ...newMenu, menu_price: e.target.value })} />

//                         <select value={newMenu.menu_type_id} onChange={(e) => setNewMenu({ ...newMenu, menu_type_id: e.target.value })}>
//                             <option value="">เลือกประเภท</option>
//                             {menuTypes.map(type => (
//                                 <option key={type.menu_type_id} value={type.menu_type_id}>{type.menu_type_name}</option>
//                             ))}
//                         </select>

//                         <input type="file" accept="image/*" onChange={(e) => {
//                             const file = e.target.files[0];
//                             if (file) {
//                                 setNewMenu({ ...newMenu, image: file.name });
//                             }
//                         }} />
//                         {newMenu.image && (
//                             <p style={{ fontSize: "14px", color: "#555", marginTop: "5px" }}>
//                                 📂 ไฟล์ที่เลือก: <strong>{newMenu.image}</strong>
//                             </p>
//                         )}

//                         <div style={{ marginTop: "10px" }}>
//                             <button onClick={handleAddMenu} className="add-btn">บันทึก</button>
//                             <button onClick={() => setIsModalOpen(false)} className="delete-btn">ยกเลิก</button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {isEditModalOpen && editMenu && (
//                 <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
//                     <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//                         <h3>✏️ แก้ไขเมนู</h3>

//                         <input type="text" placeholder="ชื่อเมนู" value={editMenu.menu_name} onChange={(e) => setEditMenu({ ...editMenu, menu_name: e.target.value })} />
//                         <input type="number" placeholder="ราคา" value={editMenu.menu_price} onChange={(e) => setEditMenu({ ...editMenu, menu_price: e.target.value })} />

//                         <select value={editMenu.menu_type_id} onChange={(e) => setEditMenu({ ...editMenu, menu_type_id: e.target.value })}>
//                             {menuTypes.map(type => (
//                                 <option key={type.menu_type_id} value={type.menu_type_id}>{type.menu_type_name}</option>
//                             ))}
//                         </select>

//                         <input type="text" placeholder="ชื่อไฟล์ภาพ เช่น abc.jpg" value={editMenu.image} onChange={(e) => setEditMenu({ ...editMenu, image: e.target.value })} />

//                         <div style={{ marginTop: "10px" }}>
//                             <button onClick={handleUpdateMenu} className="edit-btn">บันทึก</button>
//                             <button onClick={() => setIsEditModalOpen(false)} className="delete-btn">ยกเลิก</button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default AdminMenuManager;




// dddddddddddd


import React, { useEffect, useState } from "react";
import Axios from "axios";
import "../../css/AdminMenuManager.css";
import { API_BASE_URL } from "../../config"; // <<<< เพิ่มการ import


function AdminMenuManager() {
    const [menus, setMenus] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [menuTypes, setMenuTypes] = useState([]);
    const [menuTypeMap, setMenuTypeMap] = useState({});

    const [newMenu, setNewMenu] = useState({
        menu_name: "",
        menu_price: "",
        menu_type_id: "",
        image: "",
    });

    const [editMenu, setEditMenu] = useState(null);

    const handleAddMenu = async () => {
        try {
            console.log("📤 Adding menu:", newMenu);
            const res = await Axios.post(
                `${API_BASE_URL}/create`,
                {
                    db_type: "mysql",
                    store_code: "tb_menu",
                    set: {
                        menu_name: newMenu.menu_name,
                        menu_type_id: parseInt(newMenu.menu_type_id),
                        menu_price: parseInt(newMenu.menu_price),
                        image: newMenu.image,
                    },
                },
                { headers: { "Content-Type": "application/json" } }
            );

            console.log("✅ Add Menu Response:", res.data);
            const msg = res.data?.message?.toLowerCase() || "";

            if (msg.includes("successfully created")) {
                alert("✅ ເພີ່ມເມນູສຳເລັດແລ້ວ");
                setIsModalOpen(false);
                fetchMenus();
                setNewMenu({
                    menu_name: "",
                    menu_price: "",
                    menu_type_id: "",
                    image: "",
                });
            } else {
                alert("❌ ເພີ່ມເມນູບໍ່ສຳເລັດ: " + msg);
            }
        } catch (err) {
            console.error("❌ addMenu error", err);
            alert("❌ ເກີດຂໍ້ຜິດພາດໃນການເພີ່ມເມນູ");
        }
    };

    const handleUpdateMenu = async () => {
        try {
            console.log("📤 Updating menu:", editMenu);
            const res = await Axios.post(
                `${API_BASE_URL}/edit`,
                {
                    db_type: "mysql",
                    store_code: "tb_menu",
                    where: { menu_id: editMenu.menu_id },
                    set: {
                        menu_name: editMenu.menu_name,
                        menu_price: parseInt(editMenu.menu_price),
                        menu_type_id: parseInt(editMenu.menu_type_id),
                        image: editMenu.image,
                        menu_status: editMenu.menu_status,
                    },
                },
                { headers: { "Content-Type": "application/json" } }
            );

            console.log("✅ Update Menu Response:", res.data);
            const msg = res.data?.message?.toLowerCase() || "";
            if (msg.includes("edited")) {
                alert("✅ ແກ້ໄຂເມນູສຳເລັດແລ້ວ");
                setIsEditModalOpen(false);
                fetchMenus();
            } else {
                alert("❌ ບໍ່ສາມາດແກ້ໄຂເມນູໄດ້: " + msg);
            }
        } catch (error) {
            console.error("❌ handleUpdateMenu error", error);
            alert("❌ ເກີດຂໍ້ຜິດພາດລະຫວ່າງການອັບເດດເມນູ");
        }
    };

    const fetchMenus = async () => {
        try {
            const res = await Axios.post(
                `${API_BASE_URL}/fetch`,
                {
                    db_type: "mysql",
                    store_code: "tb_menu",
                    field_list: "*",
                    where: "*",
                },
                { headers: { "Content-Type": "application/json" } }
            );
            console.log("📥 Menus fetched:", res.data.data);
            setMenus(res.data.data || []);
        } catch (error) {
            console.error("❌ fetchMenus error:", error);
        }
    };

    useEffect(() => {
        fetchMenus();
        const fetchMenuTypes = async () => {
            try {
                const res = await Axios.post(
                    `${API_BASE_URL}/fetch`,
                    {
                        db_type: "mysql",
                        store_code: "tb_menu_type",
                        field_list: "*",
                        where: "*",
                    },
                    { headers: { "Content-Type": "application/json" } }
                );

                const types = res.data.data || [];
                console.log("📥 Menu types:", types);
                setMenuTypes(types);

                const map = {};
                types.forEach((t) => {
                    map[t.menu_type_id] = t.menu_type_name;
                });
                setMenuTypeMap(map);
            } catch (err) {
                console.error("❌ fetchMenuTypes error", err);
            }
        };

        fetchMenuTypes();
    }, []);

    const deleteMenu = async (menuId) => {
        const confirmDelete = window.confirm(
            "ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບເມນູນີ້?"
        );
        if (!confirmDelete) return;

        try {
            const res = await Axios.post(
                `${API_BASE_URL}/delete`,
                {
                    db_type: "mysql",
                    store_code: "tb_menu",
                    where: { menu_id: menuId },
                },
                { headers: { "Content-Type": "application/json" } }
            );

            console.log("🗑️ Delete response:", res.data);
            const msg = res.data?.message?.toLowerCase() || "";
            if (msg.includes("has been deleted")) {
                alert("✅ ລຶບເມນູສຳເລັດແລ້ວ");
                fetchMenus();
            } else {
                alert("❌ ລຶບເມນູບໍ່ສຳເລັດ: " + msg);
            }
        } catch (err) {
            console.error("❌ deleteMenu error:", err);
            alert("❌ ເກີດຂໍ້ຜິດພາດໃນການລຶບເມນູ");
        }
    };
    return (
        <div className="menu-manager">
            <h2>ຈັດການເມນູ</h2>
            <button className="add-btn" onClick={() => setIsModalOpen(true)}>
                ➕ ເພີ່ມເມນູໃໝ່
            </button>
            <div>
                <p>ເມນູທີ່ປຶດການຂາຍ: {menus.filter((menu) => menu.menu_status === "hidden").length}</p>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>ຮູບພາບ</th>
                        <th>ຊື່ເມນູ</th>
                        <th>ປະເພດ</th>
                        <th>ລາຄາ</th>
                        <th>ການຄວບຄຸມ</th>
                    </tr>
                </thead>
                {/* <tbody>
                    {menus.map((menu) => (
                        <tr key={menu.menu_id}>
                            <td>
                                <img
                                    src={`/img/${menu.image}`}
                                    alt={menu.menu_name}
                                    className="menu-img"
                                />
                            </td>
                            <td>{menu.menu_name}</td>
                            <td>{menuTypeMap[menu.menu_type_id] || menu.menu_type_id}</td>
                            <td>{menu.menu_price.toLocaleString()} kip</td>
                            <td>
                                <button
                                    className="edit-btn"
                                    onClick={() => {
                                        setEditMenu(menu);
                                        setIsEditModalOpen(true);
                                    }}
                                >
                                    ✏️
                                </button>
                                <button
                                    className="delete-btn"
                                    onClick={() => deleteMenu(menu.menu_id)}
                                >
                                    🗑️
                                </button>
                            </td>
                        

                        </tr>
                    ))}
                </tbody> */}
                <tbody>
                    {menus.map((menu) => (
                        <tr key={menu.menu_id}>
                            <td>
                                <img
                                    src={`/img/${menu.image}`}
                                    alt={menu.menu_name}
                                    className="menu-img"
                                />
                            </td>
                            <td>{menu.menu_name}</td>
                            <td>{menuTypeMap[menu.menu_type_id] || menu.menu_type_id}</td>
                            <td>{Number(menu.menu_price).toLocaleString()} kip</td>
                            <td>
                                <button
                                    className="edit-btn"
                                    onClick={() => {
                                        setEditMenu(menu);
                                        setIsEditModalOpen(true);
                                    }}
                                >
                                    ✏️
                                </button>
                                {menu.menu_status === "hidden" && (
                                    <span style={{ color: "red", marginLeft: "8px" }}>🚫 ບໍ່ສະແດງ</span>
                                )}
                                <button
                                    className="delete-btn"
                                    onClick={() => deleteMenu(menu.menu_id)}
                                >
                                    🗑️
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>


            </table>

            {/* Modal ເພີ່ມເມນູ */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>➕ ເພີ່ມເມນູໃໝ່</h3>
                        <input
                            type="text"
                            placeholder="ຊື່ເມນູ"
                            value={newMenu.menu_name}
                            onChange={(e) =>
                                setNewMenu({ ...newMenu, menu_name: e.target.value })
                            }
                        />
                        <input
                            type="number"
                            placeholder="ລາຄາ"
                            value={newMenu.menu_price}
                            onChange={(e) =>
                                setNewMenu({ ...newMenu, menu_price: e.target.value })
                            }
                        />
                        <select
                            value={newMenu.menu_type_id}
                            onChange={(e) =>
                                setNewMenu({ ...newMenu, menu_type_id: e.target.value })
                            }
                        >
                            <option value="">ເລືອກປະເພດ</option>
                            {menuTypes.map((type) => (
                                <option key={type.menu_type_id} value={type.menu_type_id}>
                                    {type.menu_type_name}
                                </option>
                            ))}
                        </select>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    setNewMenu({ ...newMenu, image: file.name });
                                }
                            }}
                        />
                        {newMenu.image && (
                            <p
                                style={{
                                    fontSize: "14px",
                                    color: "#555",
                                    marginTop: "5px",
                                }}
                            >
                                📂 ໄຟລ໌ທີ່ເລືອກ: <strong>{newMenu.image}</strong>
                            </p>
                        )}
                        <div style={{ marginTop: "10px" }}>
                            <button onClick={handleAddMenu} className="add-btn">
                                ບັນທຶກ
                            </button>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="delete-btn"
                            >
                                ຍົກເລີກ
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal ແກ້ໄຂເມນູ */}
            {isEditModalOpen && editMenu && (
                <div
                    className="modal-overlay"
                    onClick={() => setIsEditModalOpen(false)}
                >
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>✏️ ແກ້ໄຂເມນູ</h3>

                        <input
                            type="text"
                            placeholder="ຊື່ເມນູ"
                            value={editMenu.menu_name}
                            onChange={(e) =>
                                setEditMenu({ ...editMenu, menu_name: e.target.value })
                            }
                        />

                        <input
                            type="number"
                            placeholder="ລາຄາ"
                            value={editMenu.menu_price}
                            onChange={(e) =>
                                setEditMenu({ ...editMenu, menu_price: e.target.value })
                            }
                        />

                        <select
                            value={editMenu.menu_type_id}
                            onChange={(e) =>
                                setEditMenu({ ...editMenu, menu_type_id: e.target.value })
                            }
                        >
                            {menuTypes.map((type) => (
                                <option key={type.menu_type_id} value={type.menu_type_id}>
                                    {type.menu_type_name}
                                </option>
                            ))}
                        </select>

                        <input
                            type="text"
                            placeholder="ຊື່ໄຟລ໌ຮູບ ຕົວຢ່າງ abc.jpg"
                            value={editMenu.image}
                            onChange={(e) =>
                                setEditMenu({ ...editMenu, image: e.target.value })
                            }
                        />

                        {/* 🔽 Dropdown เลือกสถานะเมนู */}
                        <select
                            value={editMenu.menu_status || "available"}
                            onChange={(e) =>
                                setEditMenu({ ...editMenu, menu_status: e.target.value })
                            }
                        >
                            <option value="available">🟢 ສະແດງເມນູ (Available)</option>
                            <option value="hidden">🚫 ບໍ່ສະແດງເມນູ (Hidden)</option>
                        </select>

                        <div style={{ marginTop: "10px" }}>
                            <button onClick={handleUpdateMenu} className="edit-btn">
                                ບັນທຶກ
                            </button>
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="delete-btn"
                            >
                                ຍົກເລີກ
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default AdminMenuManager;
