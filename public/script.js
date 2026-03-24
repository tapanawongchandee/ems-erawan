document.getElementById('shortenForm').addEventListener('submit', async function(e) {
    e.preventDefault(); // ป้องกันไม่ให้หน้าเว็บรีเฟรช

    // ดึงข้อมูลจากช่องกรอก
    const longUrl = document.getElementById('longUrl').value;
    const customCode = document.getElementById('customCode').value;
    const expiresInDays = document.getElementById('expiresInDays').value;

    // ดึงพื้นที่แสดงผล
    const resultArea = document.getElementById('resultArea');
    const errorArea = document.getElementById('errorArea');
    const shortUrlResult = document.getElementById('shortUrlResult');
    const expireText = document.getElementById('expireText');

    // ซ่อนข้อความผลลัพธ์และแจ้งเตือนเก่าก่อนเริ่มทำงาน
    resultArea.style.display = 'none';
    errorArea.classList.add('d-none');

    try {
        const response = await fetch('/api/shorten', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ longUrl, customCode, expiresInDays })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // ✅ กรณีสำเร็จ: แสดงลิงก์
            shortUrlResult.value = data.shortUrl;
            resultArea.style.display = 'block';

            // แสดงวันหมดอายุ (ถ้ามีการตั้งไว้)
            if (data.expiresAt) {
                const date = new Date(data.expiresAt).toLocaleString('th-TH');
                expireText.innerText = `⏳ ลิงก์นี้จะหมดอายุในวันที่: ${date}`;
            } else {
                expireText.innerText = '';
            }

            // 🌟 จัดการคิวอาร์โค้ด
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
            // ❌ กรณี Error จากเซิร์ฟเวอร์ (เช่น ชื่อลิงก์ซ้ำ)
            errorArea.innerText = `❌ ข้อผิดพลาด: ${data.error}`;
            errorArea.classList.remove('d-none');
        }
        
    } catch (err) { 
        // ❌ กรณี Error จากระบบเครือข่าย
        errorArea.innerText = '❌ ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้';
        errorArea.classList.remove('d-none');
    }
});

// ==========================================
// ฟังก์ชันเสริม: คัดลอกลิงก์
// ==========================================
function copyToClipboard() {
    const copyText = document.getElementById('shortUrlResult');
    copyText.select();
    copyText.setSelectionRange(0, 99999); // สำหรับมือถือ
    navigator.clipboard.writeText(copyText.value);
    alert('✅ คัดลอกลิงก์เรียบร้อยแล้ว!');
}

// ==========================================
// ฟังก์ชันเสริม: ดาวน์โหลด QR Code
// ==========================================
async function downloadQR() {
    const imgUrl = document.getElementById('qrCodeImage').src;
    if (!imgUrl) return;

    try {
        const response = await fetch(imgUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'ems-erawan-qr.png'; // ตั้งชื่อไฟล์รูป
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        window.open(imgUrl, '_blank');
    }
}
