
// Logic Verification Script for Gold Calculator

const UNITS = {
    VORI_TO_ANA: 16,
    ANA_TO_ROTI: 6,
    ROTI_TO_POINT: 10
};

// 1 Vori = 16 * 6 * 10 = 960 Points
// 1 Ana = 6 * 10 = 60 Points
// 1 Roti = 10 Points

function toPoints(vori, ana, roti, point) {
    return (vori * 960) + (ana * 60) + (roti * 10) + point;
}

function fromPoints(totalPoints) {
    let remaining = totalPoints;
    const vori = Math.floor(remaining / 960);
    remaining %= 960;
    const ana = Math.floor(remaining / 60);
    remaining %= 60;
    const roti = Math.floor(remaining / 10);
    remaining %= 10;
    const point = Math.round(remaining * 100) / 100;
    return { vori, ana, roti, point };
}

function calculatePrice(totalPoints, pricePerVori, purity) {
    const totalVori = totalPoints / 960;
    return totalVori * purity * pricePerVori;
}

// --- Tests ---
console.log("Running Verification Tests...");

// Test 1: Basic Conversion
const t1 = toPoints(1, 0, 0, 0);
if (t1 === 960) console.log("PASS: 1 Vori = 960 Points");
else console.error("FAIL: 1 Vori =", t1);

// Test 2: Ana to Vori
const t2 = toPoints(0, 16, 0, 0);
const r2 = fromPoints(t2);
if (r2.vori === 1 && r2.ana === 0) console.log("PASS: 16 Ana converts to 1 Vori");
else console.error("FAIL: 16 Ana =", r2);

// Test 3: Summation
const row1 = toPoints(0, 15, 0, 0);
const row2 = toPoints(0, 1, 0, 0);
const sum = row1 + row2;
const r3 = fromPoints(sum);
if (r3.vori === 1 && r3.ana === 0) console.log("PASS: 15 Ana + 1 Ana = 1 Vori");
else console.error("FAIL: 15 Ana + 1 Ana =", r3);

// Test 4: Price 24K
const price1 = calculatePrice(960, 100000, 1.0); // 1 Vori, 100k, 24K
if (Math.round(price1) === 100000) console.log("PASS: 1 Vori 24K @ 100k = 100k");
else console.error("FAIL: Price 24K =", price1);

// Test 5: Price 22K
const price2 = calculatePrice(960, 100000, 0.916); // 1 Vori, 100k, 22K
if (Math.round(price2) === 91600) console.log("PASS: 1 Vori 22K @ 100k = 91600");
else console.error("FAIL: Price 22K =", price2);

// Test 6: Complex Points
// 1 Vori 2 Ana 3 Roti 4 Point
// = 960 + 120 + 30 + 4 = 1114 Points
const t6 = toPoints(1, 2, 3, 4);
if (t6 === 1114) console.log("PASS: 1V 2A 3R 4P = 1114 Points");
else console.error("FAIL: Complex calc =", t6);
