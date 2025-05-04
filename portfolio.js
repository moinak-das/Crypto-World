// --- Portfolio Management (using localStorage) ---
// WARNING: localStorage is NOT secure for sensitive data. This is for DEMO purposes only.
// Real applications need a secure backend database and user authentication.

const PORTFOLIO_STORAGE_KEY = 'cryptoPortfolio';

// --- Load Portfolio from localStorage ---
function loadPortfolio() {
    const storedPortfolio = localStorage.getItem(PORTFOLIO_STORAGE_KEY);
    return storedPortfolio ? JSON.parse(storedPortfolio) : []; // Return empty array if nothing stored
}

// --- Save Portfolio to localStorage ---
function savePortfolio(portfolio) {
    localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(portfolio));
}

// --- Add a Holding ---
// Needs current market data to be passed in for calculations
function addHolding(coinId, coinName, coinSymbol, quantity, purchasePrice, currentMarketData) {
    if (!coinId || !coinName || !coinSymbol || isNaN(quantity) || quantity <= 0) {
        console.error("Invalid data for adding holding");
        return { success: false, message: "Invalid input data." };
    }
    // Purchase price is optional

    const portfolio = loadPortfolio();
    const existingHoldingIndex = portfolio.findIndex(h => h.id === coinId);

    if (existingHoldingIndex > -1) {
        // --- Update existing holding ---
        const existing = portfolio[existingHoldingIndex];
        const currentTotalQuantity = existing.quantity;
        const currentTotalCost = existing.avgBuyPrice * currentTotalQuantity;

        const newPurchaseCost = (isNaN(purchasePrice) || purchasePrice <= 0) ? 0 : purchasePrice * quantity;

        existing.quantity += quantity;
        // Calculate new average buy price only if a valid purchase price was entered for the new amount
        if (newPurchaseCost > 0) {
             existing.avgBuyPrice = (currentTotalCost + newPurchaseCost) / existing.quantity;
        } // else, average buy price remains unchanged if no purchase price was given

        console.log(`Updated holding: ${coinSymbol}, New Qty: ${existing.quantity}, New Avg Price: ${existing.avgBuyPrice}`);

    } else {
        // --- Add new holding ---
        portfolio.push({
            id: coinId,
            name: coinName,
            symbol: coinSymbol,
            quantity: quantity,
            avgBuyPrice: (isNaN(purchasePrice) || purchasePrice <= 0) ? 0 : purchasePrice // Store 0 if no price given
        });
         console.log(`Added new holding: ${coinSymbol}, Qty: ${quantity}, Avg Price: ${purchasePrice}`);
    }

    savePortfolio(portfolio);
    return { success: true, message: `${coinSymbol} holding ${existingHoldingIndex > -1 ? 'updated' : 'added'}.` };
}

// --- Remove a Holding ---
function removeHolding(coinId) {
    let portfolio = loadPortfolio();
    portfolio = portfolio.filter(h => h.id !== coinId);
    savePortfolio(portfolio);
    console.log(`Removed holding with ID: ${coinId}`);
    return { success: true, message: "Holding removed." };
}


// --- Display Portfolio Data in Table ---
function displayPortfolioData(currentMarketData) {
    const portfolioTableBody = document.getElementById('portfolio-data');
    const portfolioTotalValueEl = document.getElementById('portfolio-total-value');
    const portfolio = loadPortfolio();

    if (!portfolioTableBody || !portfolioTotalValueEl || !currentMarketData) {
         console.error("Portfolio table elements or market data not found.");
         // Display message in table if possible
         if(portfolioTableBody) portfolioTableBody.innerHTML = `<tr><td colspan="7">Could not load portfolio data. Market prices unavailable.</td></tr>`;
         return;
    }

    portfolioTableBody.innerHTML = ''; // Clear table
    let totalPortfolioValue = 0;

    if (portfolio.length === 0) {
        portfolioTableBody.innerHTML = `<tr><td colspan="7">You have no holdings yet. Add some!</td></tr>`;
        portfolioTotalValueEl.textContent = formatCurrencyPortfolio(0);
        return;
    }

    portfolio.forEach(holding => {
        // Find the current market data for this coin
        const marketInfo = currentMarketData.find(coin => coin.id === holding.id);
        const currentPrice = marketInfo ? marketInfo.price : 0; // Use 0 if price not found (coin delisted?)
        const currentValue = holding.quantity * currentPrice;
        totalPortfolioValue += currentValue;

        const row = document.createElement('tr');
        row.setAttribute('data-holding-id', holding.id);

        // Use different formatting functions if needed, or reuse from script.js
        const formattedAvgBuyPrice = holding.avgBuyPrice > 0 ? formatCurrencyPortfolio(holding.avgBuyPrice) : 'N/A';
        const formattedCurrentPrice = currentPrice > 0 ? formatCurrencyPortfolio(currentPrice) : 'N/A';
        const formattedCurrentValue = formatCurrencyPortfolio(currentValue);

        row.innerHTML = `
            <td>${holding.name}</td>
            <td>${holding.symbol}</td>
            <td>${holding.quantity.toLocaleString()}</td>
            <td>${formattedAvgBuyPrice}</td>
            <td>${formattedCurrentPrice}</td>
            <td>${formattedCurrentValue}</td>
            <td>
                <button class="remove-holding-btn" data-id="${holding.id}">Remove</button>
            </td>
        `;
        portfolioTableBody.appendChild(row);
    });

    portfolioTotalValueEl.textContent = formatCurrencyPortfolio(totalPortfolioValue);

    // Add event listeners to newly created Remove buttons
    document.querySelectorAll('.remove-holding-btn').forEach(button => {
        button.addEventListener('click', handleRemoveHolding);
    });
}

function handleRemoveHolding(event) {
     const coinIdToRemove = event.target.getAttribute('data-id');
     // Optional: Add a confirmation dialog
     if (confirm(`Are you sure you want to remove this ${coinIdToRemove} holding?`)) {
        const result = removeHolding(coinIdToRemove);
        // Refresh portfolio display (needs access to current market data again)
        // This highlights a dependency - script.js should trigger portfolio refresh
         displayPortfolioData(window.cryptoDataCache || []); // Use global cache if available
         updatePortfolioMessage(result.message, result.success);
     }
}


// --- Populate Add Holding Dropdown ---
function populateCoinDropdown(marketData) {
    const selectElement = document.getElementById('add-coin-select');
    if (!selectElement || !marketData) return;

    // Clear existing options except the placeholder
    selectElement.length = 1;

    // Sort data alphabetically for dropdown
    const sortedData = [...marketData].sort((a, b) => a.name.localeCompare(b.name));

    sortedData.forEach(coin => {
        const option = document.createElement('option');
        option.value = JSON.stringify({ id: coin.id, name: coin.name, symbol: coin.symbol }); // Store necessary info
        option.textContent = `${coin.name} (${coin.symbol})`;
        selectElement.appendChild(option);
    });
}

// --- Portfolio Message Handling ---
function updatePortfolioMessage(message, isSuccess) {
     const messageEl = document.getElementById('portfolio-message');
     if (!messageEl) return;
     messageEl.textContent = message;
     messageEl.className = 'portfolio-message'; // Reset classes
     if (isSuccess) {
         messageEl.classList.add('success');
     } else if (message) { // Only add error class if there is a message
          messageEl.classList.add('error');
     }

     // Optional: Clear message after a few seconds
     setTimeout(() => {
         messageEl.textContent = '';
         messageEl.className = 'portfolio-message';
     }, 5000);
}


// --- Helper Function (can be shared or duplicated) ---
function formatCurrencyPortfolio(value) {
    if (value === null || value === undefined || isNaN(value)) return 'N/A';
    return '$' + value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}