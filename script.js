fetch('./gps-data.json')
    .then(res => res.json())
    .then(points => {
        const map = L.map('map').setView([points[0].lat, points[0].lon], 8);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        points.forEach(p => {
            L.marker([p.lat, p.lon]).addTo(map);
        });
    })
    .catch(err => {
        console.error('Lỗi tải JSON:', err);
    });
