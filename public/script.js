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
            document.getElementById('shortUrlResult').value = data.shortUrl;
            document.getElementById('resultArea').style.display = 'block';
        } else {
            document.getElementById('errorArea').innerText = data.error;
            document.getElementById('errorArea').classList.remove('d-none');
        }
    } catch (err) { alert('ระบบมีปัญหา'); }
});