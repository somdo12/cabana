// src/config.js
// export const API_BASE_URL = `http://${window.location.hostname}:5000/v1/store`;
// src/config.js

// Hostname ปัจจุบัน (จาก URL ของผู้ใช้)
export const HOSTNAME = window.location.hostname;

// Port และ API version
const PORT = 5000;
const API_VERSION = "v1";

// Base URL สำหรับการเชื่อมต่อ API
export const API_BASE_URL = `http://${HOSTNAME}:${PORT}/${API_VERSION}/store`;

// ถ้ามี endpoint อื่น ๆ สามารถเพิ่มได้ที่นี่
export const ENDPOINTS = {
    FETCH: `${API_BASE_URL}/fetch`,
    CREATE: `${API_BASE_URL}/create`,
    EDIT: `${API_BASE_URL}/edit`,
    DELETE: `${API_BASE_URL}/delete`

};

