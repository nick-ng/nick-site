const EARTH_RADIUS = 6371000;

const toRadians = deg => deg * (Math.PI / 180);
const sin = Math.sin;
const cos = Math.cos;
const atan2 = Math.atan2;
const sqrt = Math.sqrt;

const haversine = (coords1, coords2) => {
    const latr1 = toRadians(coords1.lat);
    const latr2 = toRadians(coords2.lat);
    const latrd = latr2 - latr1;
    const lonrd = toRadians(coords2.lon - coords1.lon);

    const a = sin(latrd / 2) ** 2 + cos(latr1) * cos(latr2) * sin(lonrd / 2) * sin(lonrd / 2);

    const c = 2 * atan2(sqrt(a), sqrt(1 - a));

    return EARTH_RADIUS * c;
};

module.exports = haversine;
