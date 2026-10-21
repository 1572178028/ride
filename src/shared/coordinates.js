export function wgs84ToGcj02(point) {
  const [lng, lat] = point,
    x = lng - 105,
    y = lat - 35,
    pi = Math.PI;
  let dLat =
    -100 +
    2 * x +
    3 * y +
    0.2 * y * y +
    0.1 * x * y +
    0.2 * Math.sqrt(Math.abs(x));
  let dLng =
    300 + x + 2 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
  const wave = (a, b) =>
    ((20 * Math.sin(6 * a * pi) + 20 * Math.sin(2 * b * pi)) * 2) / 3;
  dLat +=
    wave(x, x) +
    ((20 * Math.sin(y * pi) + 40 * Math.sin((y / 3) * pi)) * 2) / 3 +
    ((160 * Math.sin((y / 12) * pi) + 320 * Math.sin((y / 30) * pi)) * 2) / 3;
  dLng +=
    wave(x, x) +
    ((20 * Math.sin(x * pi) + 40 * Math.sin((x / 3) * pi)) * 2) / 3 +
    ((150 * Math.sin((x / 12) * pi) + 300 * Math.sin((x / 30) * pi)) * 2) / 3;
  const rad = (lat * pi) / 180,
    magic = 1 - 0.00669342162296594323 * Math.sin(rad) ** 2;
  const sqrt = Math.sqrt(magic),
    a = 6378245;
  return [
    lng + (dLng * 180) / ((a / sqrt) * Math.cos(rad) * pi),
    lat +
      (dLat * 180) /
        (((a * (1 - 0.00669342162296594323)) / (magic * sqrt)) * pi),
  ];
}
