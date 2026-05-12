const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

const PLANETS = [
  { key: "mercury", label: "Mercurio", periodDays: 87.9691, L0: 252.25084 },
  { key: "venus", label: "Venus", periodDays: 224.70069, L0: 181.97973 },
  { key: "mars", label: "Marte", periodDays: 686.98, L0: 355.433 },
  { key: "jupiter", label: "Júpiter", periodDays: 4332.59, L0: 34.351 },
  { key: "saturn", label: "Saturno", periodDays: 10759.22, L0: 50.077 },
  { key: "uranus", label: "Urano", periodDays: 30688.5, L0: 314.055 },
  { key: "neptune", label: "Neptuno", periodDays: 60182, L0: 304.348 },
];

const clampLon = (lon) => {
  let v = lon;
  while (v > 180) v -= 360;
  while (v < -180) v += 360;
  return v;
};

const jdFromDate = (date) => date.getTime() / 86400000 + 2440587.5;

const gmstDegrees = (jd) => {
  const T = (jd - 2451545.0) / 36525.0;
  const theta = 280.46061837 + 360.98564736629 * (jd - 2451545) + 0.000387933 * T * T - (T * T * T) / 38710000;
  return ((theta % 360) + 360) % 360;
};

const eclipticLon = (body, d) => {
  const meanMotion = 360 / body.periodDays;
  return (body.L0 + meanMotion * d) % 360;
};

function subsolarPoint(date = new Date()) {
  const jd = jdFromDate(date);
  const T = (jd - 2451545.0) / 36525.0;
  const L0 = (280.46646 + T * (36000.76983 + T * 0.0003032)) % 360;
  const M = 357.52911 + T * (35999.05029 - 0.0001537 * T);
  const Mrad = M * DEG2RAD;
  const C = Math.sin(Mrad) * (1.914602 - T * (0.004817 + 0.000014 * T))
    + Math.sin(2 * Mrad) * (0.019993 - 0.000101 * T)
    + Math.sin(3 * Mrad) * 0.000289;
  const trueLong = L0 + C;
  const omega = 125.04 - 1934.136 * T;
  const lambda = trueLong - 0.00569 - 0.00478 * Math.sin(omega * DEG2RAD);
  const epsilon0 = 23 + (26 + ((21.448 - T * (46.815 + T * (0.00059 - T * 0.001813))) / 60)) / 60;
  const epsilon = epsilon0 + 0.00256 * Math.cos(omega * DEG2RAD);
  const lambdaRad = lambda * DEG2RAD;
  const epsilonRad = epsilon * DEG2RAD;
  const decl = Math.asin(Math.sin(epsilonRad) * Math.sin(lambdaRad)) * RAD2DEG;
  const y = Math.tan(epsilonRad / 2) ** 2;
  const eqTime = 4 * RAD2DEG * (
    y * Math.sin(2 * L0 * DEG2RAD)
    - 2 * 0.016708634 * Math.sin(Mrad)
    + 4 * 0.016708634 * y * Math.sin(Mrad) * Math.cos(2 * L0 * DEG2RAD)
    - 0.5 * y * y * Math.sin(4 * L0 * DEG2RAD)
    - 1.25 * 0.016708634 * 0.016708634 * Math.sin(2 * Mrad)
  );
  const minutesUtc = date.getUTCHours() * 60 + date.getUTCMinutes() + date.getUTCSeconds() / 60;
  let subsolarLon = (720 - minutesUtc - eqTime) / 4;
  while (subsolarLon > 180) subsolarLon -= 360;
  while (subsolarLon < -180) subsolarLon += 360;
  return { lat: decl, lon: subsolarLon };
}

function planetSubpoints(date = new Date()) {
  const jd = jdFromDate(date);
  const d = jd - 2451545.0;
  const eps = 23.439291 * DEG2RAD;
  const earthLon = eclipticLon({ periodDays: 365.256363004, L0: 100.466457 }, d) * DEG2RAD;
  const ex = Math.cos(earthLon);
  const ey = Math.sin(earthLon);
  const gmst = gmstDegrees(jd);

  return PLANETS.map((p) => {
    const lp = eclipticLon(p, d) * DEG2RAD;
    const gx = Math.cos(lp) - ex;
    const gy = Math.sin(lp) - ey;
    const rx = gx;
    const ry = gy * Math.cos(eps);
    const rz = gy * Math.sin(eps);
    const ra = Math.atan2(ry, rx);
    const dec = Math.atan2(rz, Math.hypot(rx, ry));
    const raDeg = ((ra * RAD2DEG) + 360) % 360;
    const gha = clampLon(gmst - raDeg);
    return {
      key: p.key,
      label: p.label,
      lat: dec * RAD2DEG,
      lon: clampLon(-gha),
    };
  });
}

window.AstroEphemeris = {
  subsolarPoint,
  planetSubpoints,
};
