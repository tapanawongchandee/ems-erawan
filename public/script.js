document.getElementById('shortenForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const longUrl = document.getElementById('longUrl').value;
    const customCode = document.getElementById('customCode').value;
    const expiresInDays = document.getElementById('expiresInDays').value;

    document.getElementById('resultArea').style.display = 'none';
    document.getElementById('errorArea').classList.add('d-none');

    try {
        const response = await fetch('/api/shorten', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ longUrl, customCode, expiresInDays })
        });
        const data = await response.json();
        if (response.ok) {
            // กรณีสำเร็จ: แสดงลิงก์
            shortUrlResult.value = data.shortUrl;
            resultArea.style.display = 'block';

            // แสดงวันหมดอายุ (ถ้ามีการตั้งไว้)
            if (data.expiresAt) {
                const date = new Date(data.expiresAt).toLocaleString('th-TH');
                expireText.innerText = `⏳ ลิงก์นี้จะหมดอายุในวันที่: ${date}`;
            } else {
                expireText.innerText = '';
            }

            // 🌟 ส่วนที่เพิ่มใหม่: จัดการคิวอาร์โค้ด 🌟
            const generateQr = document.getElementById('generateQr').checked;
            const qrCodeArea = document.getElementById('qrCodeArea');
            const qrCodeImage = document.getElementById('qrCodeImage');

            if (generateQr) {
                // เรียกใช้ API ฟรี เพื่อแปลงลิงก์สั้นให้เป็นรูปภาพ QR Code
                qrCodeImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(data.shortUrl)}`;
                qrCodeArea.style.display = 'block';
            } else {
                // ถ้าไม่ได้ติ๊กเลือก ให้ซ่อนรูปไป
                qrCodeArea.style.display = 'none';
            }

        } else {
            document.getElementById('shortUrlResult').value = data.shortUrl;
            document.getElementById('resultArea').style.display = 'block';
        } else {
            document.getElementById('errorArea').innerText = data.error;
            document.getElementById('errorArea').classList.remove('d-none');
        }
    } catch (err) { alert('ระบบมีปัญหา'); }
});
