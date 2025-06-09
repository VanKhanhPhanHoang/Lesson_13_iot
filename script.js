const subscriptionKey = import.meta.env.VITE_SUBSCRIPTION_KEY;

let map, features = [];

fetch("/gps-data.json")
  .then(res => {
    if (!res.ok) throw new Error("Không thể tải file JSON");
    return res.json();
  })
  .then(data => {
    features = data.map(coord => new atlas.data.Feature(
      new atlas.data.Point([coord.lon, coord.lat])
    ));

    map = new atlas.Map("myMap", {
      center: [features[0].geometry.coordinates[0], features[0].geometry.coordinates[1]],
      zoom: 12,
      authOptions: {
        authType: "subscriptionKey",
        subscriptionKey: subscriptionKey,
      },
    });

    map.events.add("ready", function () {
      const source = new atlas.source.DataSource();
      map.sources.add(source);
      map.layers.add(new atlas.layer.BubbleLayer(source));
      source.add(features);
    });
  })
  .catch(err => {
    console.error("Lỗi khi tải hoặc xử lý GPS data:", err);
  });