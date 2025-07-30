import React, { useEffect, useState } from "react";
// import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import useServerIP from "../wifi-ip";

function QRCodePage() {
    const [url, setUrl] = useState("");
    const ip = useServerIP();

    useEffect(() => {
        
        setUrl(`http://${ip}:3000`);
    }, [ip]);


    const downloadQR = () => {
        const canvas = document.getElementById("wifi-qr");
        if (!canvas) return;
        const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = "wifi_qr.png";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };

    return (
        <div style={{ textAlign: "center", padding: "50px", fontFamily: "Arial" }}>
            <h2>ສະແກນ QR Code ເພື່ອເຂົ້າສັ່ງອໍເດີ</h2>
            {url ? (
                <>
                    <QRCodeCanvas id="wifi-qr" value={url} size={220} />
                    <p style={{ marginTop: "10px" }}>{url}</p>
                    <button
                        onClick={downloadQR}
                        style={{
                            marginTop: "20px",
                            padding: "10px 20px",
                            fontSize: "16px",
                            cursor: "pointer",
                            borderRadius: "8px",
                            border: "none",
                            backgroundColor: "#f39c12",
                            color: "#fff",
                            fontWeight: "bold",
                        }}
                    >
                        ดาวน์โหลด QR Code
                    </button>
                </>
            ) : (
                <p>กำลังโหลด IP...</p>
            )}
        </div>
    );
}

export default QRCodePage;
