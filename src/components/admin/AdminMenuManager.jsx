
import React, { useEffect, useState } from "react";
import Axios from "axios";
import "../../css/AdminMenuManager.css";
import { API_BASE_URL } from "../../config";
import { UploadImageIntoServer } from "./uploadImage";


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
        imageFile: "",
    });

    const [editMenu, setEditMenu] = useState(null);
    const [editImageFile, setEditImageFile] = useState(null);

    const handleAddMenu = async () => {
        try {
            console.log("📤 Adding menu:", newMenu);

            const uploadedImageData = await UploadImageIntoServer(newMenu.imageFile);
            console.log("Uploaded image data:", uploadedImageData);

            const res = await Axios.post(
                `${API_BASE_URL}/create`,
                {
                    db_type: "mysql",
                    store_code: "tb_menu",
                    set: {
                        menu_name: newMenu.menu_name,
                        menu_type_id: parseInt(newMenu.menu_type_id),
                        menu_price: parseInt(newMenu.menu_price),
                        image: uploadedImageData.data.data.name,
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
                    imageFile: "",
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

            let imageFileName = editMenu.image; // ใช้รูปเดิม

            // ถ้ามีการเลือกไฟล์รูปใหม่
            if (editImageFile) {
                const uploadedImageData = await UploadImageIntoServer(editImageFile);
                console.log("Uploaded new image:", uploadedImageData);
                imageFileName = uploadedImageData.data.data.name;
            }

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
                        image: imageFileName, // ใช้ชื่อไฟล์ใหม่หรือเดิม
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
                setEditImageFile(null); // รีเซ็ตไฟล์รูป
                fetchMenus();
            } else {
                alert("❌ ບໍ່ສາມາດແກ້ໄຂເມນູໄດ້: " + msg);
            }
        } catch (error) {
            console.error("❌ handleUpdateMenu error", error);
            alert("❌ ເກີດຂໍ້ຜິດພາດລະຫວ່າງການອັບເດດເມນູ");
        }
    };

    // const fetchMenus = async () => {
    //     try {
    //         const res = await Axios.post(
    //             `${API_BASE_URL}/fetch`,
    //             {
    //                 db_type: "mysql",
    //                 store_code: "tb_menu",
    //                 field_list: "*",
    //                 where: "*",
    //             },
    //             { headers: { "Content-Type": "application/json" } }
    //         );
    //         console.log("📥 Menus fetched:", res.data.data);
    //         setMenus(res.data.data || []);
    //     } catch (error) {
    //         console.error("❌ fetchMenus error:", error);
    //     }
    // };
    const fetchMenus = async () => {
        try {
            const res = await Axios.post(
                `${API_BASE_URL}/fetch`,
                {
                    db_type: "mysql",
                    store_code: "tb_menu",
                    field_list: "*",
                    where: "*", // ดึงทั้งหมดมาก่อน
                },
                { headers: { "Content-Type": "application/json" } }
            );

            console.log("📥 Menus fetched:", res.data.data);

            // กรองเอาแค่เมนูที่ไม่ได้ถูกลบ (is_deleted = 0)
            const activeMenus = (res.data.data || []).filter(menu =>
                menu.is_deleted === 0 || menu.is_deleted === null
            );

            setMenus(activeMenus);

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
            "ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບເມນູນີ້? (เมนูจะถูกซ่อนและไม่แสดงในระบบ)"
        );
        if (!confirmDelete) return;

        try {
            // ลองลบจริงก่อน (สำหรับเมนูใหม่ที่ยังไม่มีการสั่งซื้อ)
            const deleteRes = await Axios.post(
                `${API_BASE_URL}/delete`,
                {
                    db_type: "mysql",
                    store_code: "tb_menu",
                    where: { menu_id: menuId },
                },
                { headers: { "Content-Type": "application/json" } }
            );

            console.log("🗑️ Delete attempt response:", deleteRes.data);

            // ถ้าลบสำเร็จ
            const deleteMsg = deleteRes.data?.message?.toLowerCase() || "";
            if (deleteMsg.includes("has been deleted")) {
                alert("✅ ລຶບເມນູສຳເລັດແລ້ວ");
                fetchMenus();
                return;
            }

        } catch (deleteError) {
            console.log("❌ Hard delete failed, trying soft delete:", deleteError.response?.data);

            // ถ้าลบไม่ได้ (Foreign Key Error) ให้ทำ Soft Delete
            if (deleteError.response?.status === 409 ||
                deleteError.response?.data?.message?.includes("foreign key") ||
                deleteError.response?.data?.message?.includes("constraint")) {

                try {
                    // Soft Delete - ใช้ field is_deleted
                    const softDeleteRes = await Axios.post(
                        `${API_BASE_URL}/edit`,
                        {
                            db_type: "mysql",
                            store_code: "tb_menu",
                            where: { menu_id: menuId },
                            set: {
                                is_deleted: 1 // 1 = ถูกลบ, 0 = ยังไม่ถูกลบ
                            },
                        },
                        { headers: { "Content-Type": "application/json" } }
                    );

                    console.log("✅ Soft delete response:", softDeleteRes.data);
                    const softMsg = softDeleteRes.data?.message?.toLowerCase() || "";

                    if (softMsg.includes("edited")) {
                        alert("✅ ເມນູຖືກເຊື່ອງແລ້ວ (ບໍ່ສາມາດລຶບໄດ້ເນື່ອງຈາກມີການສັ່ງຊື້)");
                        fetchMenus();
                    } else {
                        alert("❌ ບໍ່ສາມາດເຊື່ອງເມນູໄດ້");
                    }

                } catch (softDeleteError) {
                    console.error("❌ Soft delete error:", softDeleteError);
                    alert("❌ ເກີດຂໍ້ຜິດພາດໃນການເຊື່ອງເມນູ");
                }

            } else {
                // Error อื่นๆ
                console.error("❌ deleteMenu error:", deleteError);
                alert("❌ ເກີດຂໍ້ຜິດພາດໃນການລຶບເມນູ");
            }
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

                <tbody>
                    {menus.map((menu) => (
                        <tr key={menu.menu_id}>
                            <td>
                                <img
                                    src={`http://localhost:5000/storages/images/${menu.image}`}
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
                                    setNewMenu({ ...newMenu, imageFile: file });
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
                                📂 ໄຟລ໌ທີ່ເລືອກ: <strong>{newMenu.imageFile.name}</strong>
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
                        <div className="image-preview-container">

                            <div className="current-image-display">
                                <img
                                    src={`http://localhost:5000/storages/images/${editMenu.image}`}
                                    alt={editMenu.menu_name}
                                    className="current-image"
                                />
                                <p className="current-image-name">📂 {editMenu.image}</p>
                            </div>

                            <label>📸 เลือกรูปใหม่ (ถ้าต้องการเปลี่ยน):</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    setEditImageFile(file);
                                }}
                                className="file-input"
                            />

                            {editImageFile && (
                                <div className="new-image-preview">
                                    <p className="new-image-name">
                                        ✨ รูปใหม่ที่เลือก: <strong>{editImageFile.name}</strong>
                                    </p>
                                    <img
                                        src={URL.createObjectURL(editImageFile)}
                                        alt="Preview"
                                        className="preview-image"
                                    />
                                </div>
                            )}
                        </div>

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

                        <select
                            value={editMenu.menu_status || "available"}
                            onChange={(e) =>
                                setEditMenu({ ...editMenu, menu_status: e.target.value })
                            }
                        >
                            <option value="available">🟢 ສະແດງເມນູ (Available)</option>
                            <option value="hidden">🚫 ບໍ່ສະແດງເມນູ (Hidden)</option>
                        </select>
                        
                        {editMenu.is_deleted === 1 && (
                            <label style={{ color: 'red', marginTop: '10px', display: 'block' }}>
                                <input
                                    type="checkbox"
                                    checked={false}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setEditMenu({ ...editMenu, is_deleted: 0 });
                                        }
                                    }}
                                />
                                🔄 ກູ້ຄືນເມນູນີ້ (Restore Menu)
                            </label>
                        )}


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
