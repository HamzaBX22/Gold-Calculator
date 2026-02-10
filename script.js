document.addEventListener('DOMContentLoaded', () => {
    // --- Constants ---
    const UNITS = {
        VORI_TO_ANA: 16,
        ANA_TO_ROTI: 6,
        ROTI_TO_POINT: 10
    };

    // --- DOM Elements ---
    // --- DOM Elements ---
    const weightRowsContainer = document.getElementById('weight-rows-container');
    const addRowBtn = document.getElementById('add-row-btn');
    const totalWeightText = document.getElementById('total-weight-text');
    const totalWeightDecimal = document.getElementById('total-weight-decimal');

    const priceInput = document.getElementById('price-input');
    const unitRadios = document.getElementsByName('price-unit');
    const karatBtns = document.querySelectorAll('.karat-btn');
    const customKaratWrapper = document.getElementById('custom-karat-wrapper');
    const customPurityInput = document.getElementById('custom-purity');

    const finalPriceDisplay = document.getElementById('final-price');
    const breakdownText = document.getElementById('calculation-breakdown');

    // --- State ---
    let currentPurity = 1.00; // Default 24K
    let isCustomKarat = false;

    // --- Initialization ---
    // Add one initial row
    addWeightRow();

    // --- Event Listeners ---
    addRowBtn.addEventListener('click', addWeightRow);

    priceInput.addEventListener('input', calculateAll);

    // Unit radios
    unitRadios.forEach(radio => {
        radio.addEventListener('change', calculateAll);
    });

    karatBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // UI Toggle
            karatBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            // Logic
            const val = e.target.dataset.value;
            if (val === 'custom') {
                isCustomKarat = true;
                customKaratWrapper.classList.remove('hidden');
                updateCustomPurity();
            } else {
                isCustomKarat = false;
                customKaratWrapper.classList.add('hidden');
                currentPurity = parseFloat(val);
                calculateAll();
            }
        });
    });

    customPurityInput.addEventListener('input', updateCustomPurity);

    // --- Functions ---

    function updateCustomPurity() {
        if (!isCustomKarat) return;
        const karatInput = parseFloat(customPurityInput.value) || 0;
        // Formula: Custom / 24
        currentPurity = karatInput / 24;
        calculateAll();
    }

    function addWeightRow() {
        const rowId = 'row-' + Date.now();
        const div = document.createElement('div');
        div.className = 'weight-row';
        div.id = rowId;

        div.innerHTML = `
            <input type="number" min="0" placeholder="0" class="weight-input vori" data-unit="vori">
            <input type="number" min="0" placeholder="0" class="weight-input ana" data-unit="ana">
            <input type="number" min="0" placeholder="0" class="weight-input roti" data-unit="roti">
            <input type="number" min="0" placeholder="0" class="weight-input point" data-unit="point">
            <button class="remove-btn" aria-label="Remove Row" tabindex="-1">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        `;

        // Add listeners to new inputs
        const inputs = div.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', calculateAll);
        });

        const removeBtn = div.querySelector('.remove-btn');
        removeBtn.addEventListener('click', () => {
            if (weightRowsContainer.children.length > 1) {
                div.remove();
                calculateAll();
            } else {
                // Clear inputs if it's the last row
                inputs.forEach(i => i.value = '');
                calculateAll();
            }
        });

        weightRowsContainer.appendChild(div);
    }

    /*
     * Core Conversion Logic:
     * 1 Vori = 16 Ana
     * 1 Ana = 6 Roti
     * 1 Roti = 10 Point
     * 
     * Total Vori = Vori + (Ana/16) + (Roti/96) + (Point/960)
     */
    function calculateAll() {
        // 1. Calculate Total Weight in Decimal Vori
        let totalVoriDecimal = 0;
        const rows = document.querySelectorAll('.weight-row');

        rows.forEach(row => {
            const vori = parseFloat(row.querySelector('.vori').value) || 0;
            const ana = parseFloat(row.querySelector('.ana').value) || 0;
            const roti = parseFloat(row.querySelector('.roti').value) || 0;
            const point = parseFloat(row.querySelector('.point').value) || 0;

            const rowVori =
                vori +
                (ana / 16) +
                (roti / 96) +
                (point / 960);

            totalVoriDecimal += rowVori;
        });

        // 2. Convert Decimal Vori back to Traditional Units for Display
        // We use totalPoints for precise integer math to avoid float errors during breakdown
        // 1 Vori = 960 Points
        const totalPoints = Math.round(totalVoriDecimal * 960);

        let remaining = totalPoints;

        // Vori
        const displayVori = Math.floor(remaining / 960);
        remaining %= 960;

        // Ana (1 Ana = 60 Points)
        const displayAna = Math.floor(remaining / 60);
        remaining %= 60;

        // Roti (1 Roti = 10 Points)
        const displayRoti = Math.floor(remaining / 10);
        remaining %= 10;

        // Point
        const displayPoint = remaining;

        // Update Total Weight Display
        totalWeightText.textContent = `${displayVori} Vori ${displayAna} Ana ${displayRoti} Roti ${displayPoint} Point`;
        totalWeightDecimal.textContent = `(${totalVoriDecimal.toFixed(3)} Vori)`;

        // 3. Calculate Price
        // EstimatedPrice = TotalVori × PricePerUnit × KaratMultiplier

        const pricePerUnit = parseFloat(priceInput.value) || 0;

        // Ensure purity is valid (handle 0 or NaN)
        const purityMultiplier = isNaN(currentPurity) ? 0 : currentPurity;

        const finalPrice = totalVoriDecimal * purityMultiplier * pricePerUnit;

        // Update Price Display
        finalPriceDisplay.textContent = Math.round(finalPrice).toLocaleString('en-BD');

        // Update Breakdown text
        // Get selected unit name
        let unitName = 'Vori';
        for (const radio of unitRadios) {
            if (radio.checked) unitName = radio.nextElementSibling.textContent;
        }

        breakdownText.textContent = `${totalVoriDecimal.toFixed(3)} ${unitName} × ${purityMultiplier.toFixed(3)} (Purity) × ৳${pricePerUnit.toLocaleString()}`;
    }
});
