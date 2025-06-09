// Lấy subscriptionKey từ biến môi trường
const subscriptionKey = import.meta.env.VITE_SUBSCRIPTION_KEY;

// Biến toàn cục
let map;
let features = [];

// Hàm chính
async function init() {
    try {
        // Tải dữ liệu GPS từ file JSON nội bộ (không gây lỗi CORS)
        const response = await fetch('/gps-data.json');
        if (!response.ok) throw new Error('Không thể tải file JSON');

        const gps = await response.json();

        // Chuyển đổi tọa độ GPS thành đối tượng bản đồ
        features.push(new atlas.data.Feature(
            new atlas.data.Point([
                parseFloat(gps.gps.lon),
                parseFloat(gps.gps.lat)
            ])
        ));

        // Khởi tạo bản đồ
        map = new atlas.Map("myMap", {
            center: [parseFloat(gps.gps.lon), parseFloat(gps.gps.lat)],
            zoom: 14,
            authOptions: {
                authType: "subscriptionKey",
                subscriptionKey: subscriptionKey,
            },
        });

        // Khi bản đồ sẵn sàng thì thêm dữ liệu vào
        map.events.add("ready", function () {
            const source = new atlas.source.DataSource();
            map.sources.add(source);

            // Tạo BubbleLayer để hiển thị vị trí
            map.layers.add(new atlas.layer.BubbleLayer(source));
            source.add(features);
        });

    } catch (err) {
        console.error("Lỗi khi tải hoặc xử lý GPS data:", err);
    }
}

// Gọi hàm khi script được load
init();