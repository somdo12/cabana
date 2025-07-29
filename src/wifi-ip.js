import { useState, useEffect } from "react";
import axios from "axios";

export default function useServerIP() {
    const [ip, setIp] = useState("");

    useEffect(() => {
        // ใช้ hostname ของเครื่องปัจจุบัน เช่น 172.20.10.2
        const serverHost = window.location.hostname || "localhost";
        const apiURL = `http://${serverHost}:5000/v1/wifi-ipv4`;

        console.log("DEBUG: Fetching IP from", apiURL);

        axios
            .get(apiURL)
            .then((res) => {
                console.log("DEBUG: Wi-Fi IPv4 =", res.data.ip);
                setIp(res.data.ip);
            })
            .catch((err) => console.error("Error fetching Wi-Fi IP:", err));
    }, []);

    return ip;
}
