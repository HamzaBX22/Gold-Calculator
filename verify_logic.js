
// Mocking DOM elements and state for testing logic
const state = {
    price: 100000,
    purity: 1.0,
    rows: []
};

// Logic adapted from script.js
function calculateWeight(vori, ana, roti, point) {
    return vori + (ana / 16) + (roti / 96) + (point / 960);
}

function calculatePrice(totalVori, purity, pricePerUnit) {
    return totalVori * purity * pricePerUnit;
}

function test(description, actual, expected) {
    const pass = Math.abs(actual - expected) < 0.001; // Float tolerance
    console.log(`${pass ? 'PASS' : 'FAIL'}: ${description}`);
    if (!pass) console.log(`  Expected: ${expected}, Got: ${actual}`);
}

console.log('--- Verification Tests ---');

// Test 1: Weight Conversion
// 16 Ana = 1 Vori
test('16 Ana -> 1 Vori', calculateWeight(0, 16, 0, 0), 1.000);

// 96 Roti = 1 Vori
test('96 Roti -> 1 Vori', calculateWeight(0, 0, 96, 0), 1.000);

// 1 Vori, 8 Ana = 1.5 Vori
test('1 Vori, 8 Ana -> 1.5 Vori', calculateWeight(1, 8, 0, 0), 1.500);

// Test 2: Price Calculation
// 1 Vori, 24K (1.0), 100k Price
test('Price: 1 Vori @ 100k (24K)', calculatePrice(1.0, 1.0, 100000), 100000);

// 1 Vori, 18K (0.75), 100k Price
test('Price: 1 Vori @ 100k (18K)', calculatePrice(1.0, 0.75, 100000), 75000);

// Test 3: Custom Karat
// Custom 21K -> 21/24 = 0.875
const customPurity21 = 21 / 24;
test('Custom 21K Purity', customPurity21, 0.875);

// Price with Custom 21K, 1 Vori, 100k
test('Price: 1 Vori @ 100k (Custom 21K)', calculatePrice(1.0, customPurity21, 100000), 87500);

console.log('--- End Verification ---');
