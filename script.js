// --- Main Application Script ---

document.addEventListener('DOMContentLoaded', () => {
    // --- Global References ---
    const cryptoTableBody = document.getElementById('crypto-data');
    const searchInput = document.getElementById('search-input');
    const loadingIndicator = document.getElementById('loading-indicator');
    const apiAttribution = document.querySelector('.api-attribution');
    const views = document.querySelectorAll('.view');
    const navLinks = document.querySelectorAll('.nav-link');
    const themeToggleButton = document.getElementById('theme-toggle-button');
    const menuToggleButton = document.getElementById('menu-toggle-button');
    const headerNav = document.querySelector('header nav');
    const backButtons = document.querySelectorAll('.back-button');

    // Coin Detail View Elements
    const coinDetailView = document.getElementById('coin-detail-view');
    const coinDetailName = document.getElementById('coin-detail-name');
    const detailSymbol = document.getElementById('detail-symbol');
    const detailPrice = document.getElementById('detail-price');
    const detailChange = document.getElementById('detail-change');
    const detailMarketcap = document.getElementById('detail-marketcap');
    const detailVolume = document.getElementById('detail-volume');

    // Portfolio View Elements
    const portfolioView = document.getElementById('portfolio-view');
    const holdingForm = document.getElementById('holding-form');
    const addCoinSelect = document.getElementById('add-coin-select');
    const addQuantityInput = document.getElementById('add-quantity');
    const addPurchasePriceInput = document.getElementById('add-purchase-price');


    // --- State ---
    window.cryptoDataCache = []; // Use window scope to share with portfolio.js or pass explicitly
    let updateInterval;
    const UPDATE_INTERVAL_MS = 60 * 1000; // 60 seconds

    // --- API Configuration (Mock Data - Replace as needed) ---
    const API_KEY = 'YOUR_REAL_API_KEY'; // Keep secure!
    const API_URL = 'https://api.example-crypto-data.com/v1/ticker?limit=100';


    // --- Initialization ---
    function initializeApp() {
        setupEventListeners();
        loadThemePreference(); // Load theme first
        fetchMarketData(); // Initial market data load
        navigateToView(getDefaultView()); // Show default view (e.g., market)
        // Initial load for portfolio table (might show "loading prices")
        displayPortfolioData(window.cryptoDataCache);
    }

    function getDefaultView() {
        // Could use URL hash or localStorage later, for now default to market
        return 'market-view';
    }


    // --- Event Listeners Setup ---
    function setupEventListeners() {
        // Navigation
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetViewId = link.getAttribute('data-target');
                if (targetViewId) {
                    navigateToView(targetViewId);
                    // Close mobile menu if open
                    if(headerNav.classList.contains('active')) {
                        headerNav.classList.remove('active');
                         menuToggleButton.textContent = '☰';
                    }
                }
            });
        });

         // Back Buttons
        backButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const targetViewId = button.getAttribute('data-target');
                if (targetViewId) {
                    navigateToView(targetViewId);
                }
            });
        });


        // Market Search
        searchInput.addEventListener('input', filterMarketData);

        // Theme Toggle
        themeToggleButton.addEventListener('click', toggleTheme);

        // Mobile Menu Toggle
        menuToggleButton.addEventListener('click', toggleMobileMenu);

        // Portfolio Form Submission
        if (holdingForm) {
             holdingForm.addEventListener('submit', handleAddHoldingSubmit);
        }

        // Delegated event listener for "View Chart" buttons in the market table
        if (cryptoTableBody) {
             cryptoTableBody.addEventListener('click', handleMarketTableActions);
        }
    }


    // --- Navigation Logic ---
    function navigateToView(viewId) {
        views.forEach(view => {
            view.classList.remove('active-view');
        });
        const targetView = document.getElementById(viewId);
        if (targetView) {
            targetView.classList.add('active-view');

             // Update active state for nav links
            navLinks.forEach(link => {
                if (link.getAttribute('data-target') === viewId) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });

            // Refresh portfolio if navigating to it
            if (viewId === 'portfolio-view') {
                displayPortfolioData(window.cryptoDataCache); // Refresh with latest prices
                 populateCoinDropdown(window.cryptoDataCache); // Ensure dropdown is up-to-date
            }

            // If navigating away from coin detail, destroy chart
            if (viewId !== 'coin-detail-view') {
                destroyExistingChart(); // Call function from chart-handler.js
            }

             // Scroll to top of the view
             window.scrollTo(0, 0);

        } else {
            console.error(`View with ID "${viewId}" not found.`);
            // Optionally navigate to a default view like market-view
            navigateToView('market-view');
        }
    }


    // --- Market Data Fetching and Display ---
    async function fetchMarketData() {
        console.log("Fetching market data...");
        loadingIndicator.style.display = 'block';
        // Don't clear table immediately if updating, provides smoother feel
        // cryptoTableBody.innerHTML = '';

        try {
            // --- MOCK DATA SIMULATION ---
            await new Promise(resolve => setTimeout(resolve, 1000));
            const mockData = generateMockMarketData(100); // Use the generator
            window.cryptoDataCache = mockData; // Update global cache
            displayMarketData(window.cryptoDataCache);
            populateCoinDropdown(window.cryptoDataCache); // Update portfolio dropdown
            displayPortfolioData(window.cryptoDataCache); // Refresh portfolio values with new prices
            apiAttribution.textContent = 'Data Source: Mock Data';
            // --- END MOCK ---

            /* --- REAL API FETCH (Example) ---
             const response = await fetch(API_URL, { headers: { 'X-API-KEY': API_KEY } }); // Add auth
             if (!response.ok) throw new Error(`API Error: ${response.status}`);
             const data = await response.json();
             // Adapt data structure (IMPORTANT)
             const formattedData = adaptApiData(data); // You need to create adaptApiData function
             window.cryptoDataCache = formattedData;
             displayMarketData(window.cryptoDataCache);
             populateCoinDropdown(window.cryptoDataCache);
             displayPortfolioData(window.cryptoDataCache); // Refresh portfolio
             apiAttribution.textContent = 'Data provided by [Your API Source Name]';
            --- END REAL API --- */

        } catch (error) {
            console.error("Failed to fetch market data:", error);
            if (cryptoTableBody) cryptoTableBody.innerHTML = `<tr><td colspan="7" class="error-message">Failed to load market data. ${error.message}</td></tr>`;
            apiAttribution.textContent = '';
        } finally {
            loadingIndicator.style.display = 'none';
        }
    }

    function displayMarketData(data) {
        if (!cryptoTableBody) return;
        cryptoTableBody.innerHTML = ''; // Clear table before adding new data

        if (!data || data.length === 0) {
            cryptoTableBody.innerHTML = '<tr><td colspan="7">No market data available.</td></tr>';
            return;
        }

        data.forEach(crypto => {
            const row = document.createElement('tr');
            // Add data attribute to row for easy access later
            row.setAttribute('data-crypto-id', crypto.id);
            row.setAttribute('data-crypto-name', crypto.name);
            row.style.cursor = 'pointer'; // Indicate row is clickable for details

            const changeClass = crypto.change24h >= 0 ? 'positive' : 'negative';
            const formattedPrice = formatCurrency(crypto.price);
            const formattedMarketCap = formatLargeNumber(crypto.marketCap);
            const formattedVolume = formatLargeNumber(crypto.volume24h);
            const formattedChange = crypto.change24h.toFixed(2) + '%';

            row.innerHTML = `
                <td>${crypto.rank}</td>
                <td>
                    <div class="crypto-name">
                        ${crypto.name} <span class="crypto-symbol">${crypto.symbol}</span>
                    </div>
                </td>
                <td>${formattedPrice}</td>
                <td class="${changeClass}">${formattedChange}</td>
                <td>${formattedMarketCap}</td>
                <td>${formattedVolume}</td>
                <td>
                    <button class="view-chart-btn button-style" data-id="${crypto.id}" data-name="${crypto.name}">Chart</button>
                </td>
            `;
            cryptoTableBody.appendChild(row);
        });
    }

    // --- Market Data Filtering ---
    function filterMarketData() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const filteredData = window.cryptoDataCache.filter(crypto =>
            crypto.name.toLowerCase().includes(searchTerm) ||
            crypto.symbol.toLowerCase().includes(searchTerm)
        );
        displayMarketData(filteredData);
    }


    // --- Coin Detail & Chart Handling ---
     function handleMarketTableActions(event) {
         // Check if the click was on a 'View Chart' button
         if (event.target.classList.contains('view-chart-btn')) {
             const coinId = event.target.getAttribute('data-id');
             const coinName = event.target.getAttribute('data-name');
             showCoinDetail(coinId, coinName);
         }
         // Could also add: Check if click was on the row itself (but not the button)
         // else if (event.target.closest('tr')) {
         //    const row = event.target.closest('tr');
         //    const coinId = row.getAttribute('data-crypto-id');
         //    const coinName = row.getAttribute('data-crypto-name');
         //    if (coinId && coinName) {
         //         showCoinDetail(coinId, coinName);
         //    }
         // }
     }


    function showCoinDetail(coinId, coinName) {
        console.log(`Showing details for: ${coinName} (ID: ${coinId})`);

        // Find full coin data from cache
        const coinData = window.cryptoDataCache.find(c => c.id.toString() === coinId.toString());

        if (coinData && coinDetailView) {
            // Populate stats
            coinDetailName.textContent = `${coinData.name} Details`;
            detailSymbol.textContent = coinData.symbol;
            detailPrice.textContent = formatCurrency(coinData.price);
             const changeClass = coinData.change24h >= 0 ? 'positive' : 'negative';
            detailChange.innerHTML = `<span class="${changeClass}">${coinData.change24h.toFixed(2)}%</span>`; // Use innerHTML to apply class
            detailMarketcap.textContent = formatLargeNumber(coinData.marketCap);
            detailVolume.textContent = formatLargeNumber(coinData.volume24h);

            // Navigate to the detail view
            navigateToView('coin-detail-view');

            // Call the chart function (from chart-handler.js)
            displayPriceChart(coinId, coinName);

        } else {
            console.error(`Data not found for coin ID: ${coinId}`);
            // Maybe show an error message or navigate back
            alert("Could not find details for this coin.");
             navigateToView('market-view');
        }
    }


    // --- Portfolio Handling ---
    function handleAddHoldingSubmit(event) {
        event.preventDefault(); // Prevent page reload
        const selectedOption = addCoinSelect.options[addCoinSelect.selectedIndex];
        const quantity = parseFloat(addQuantityInput.value);
        const purchasePrice = parseFloat(addPurchasePriceInput.value); // Can be NaN if empty

        if (!selectedOption.value) {
             updatePortfolioMessage("Please select a coin.", false);
             return;
        }
        if (isNaN(quantity) || quantity <= 0) {
             updatePortfolioMessage("Please enter a valid quantity.", false);
             return;
        }

        const { id, name, symbol } = JSON.parse(selectedOption.value);

        // Call function from portfolio.js
        const result = addHolding(id, name, symbol, quantity, purchasePrice, window.cryptoDataCache);

        updatePortfolioMessage(result.message, result.success); // Use function from portfolio.js

        if (result.success) {
            holdingForm.reset(); // Clear the form
            displayPortfolioData(window.cryptoDataCache); // Refresh portfolio display
        }
    }


    // --- Theme Switching ---
    function toggleTheme() {
        const body = document.body;
        body.classList.toggle('light-mode');
        body.classList.toggle('dark-mode');

        const isLightMode = body.classList.contains('light-mode');
        localStorage.setItem('theme', isLightMode ? 'light' : 'dark');

        // Update theme toggle button icon
        themeToggleButton.textContent = isLightMode ? '🌙' : '☀️'; // Moon for switching to dark, Sun for switching to light

        // Update chart theme if a chart exists
        updateChartTheme(); // Call function from chart-handler.js
    }

    function loadThemePreference() {
        const savedTheme = localStorage.getItem('theme');
        const body = document.body;

        // Remove existing theme classes first
        body.classList.remove('light-mode', 'dark-mode');

        if (savedTheme === 'light') {
            body.classList.add('light-mode');
             themeToggleButton.textContent = '🌙'; // Moon icon
        } else {
            body.classList.add('dark-mode'); // Default to dark
             themeToggleButton.textContent = '☀️'; // Sun icon
        }
         // Ensure chart theme matches on load (if chart is visible initially, unlikely here)
         updateChartTheme();
    }

    // --- Mobile Menu ---
    function toggleMobileMenu() {
         headerNav.classList.toggle('active');
         // Change burger icon to X and back
         if (headerNav.classList.contains('active')) {
             menuToggleButton.textContent = '✕'; // Close icon
         } else {
              menuToggleButton.textContent = '☰'; // Burger icon
         }
    }

    // --- Formatting Helpers (Shared) ---
    function formatCurrency(value) {
        if (value === null || value === undefined) return 'N/A';
        return '$' + value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function formatLargeNumber(value) {
        if (value === null || value === undefined) return 'N/A';
         const absValue = Math.abs(value); // Use absolute value for deciding prefix

        if (absValue >= 1e12) {
            return '$' + (value / 1e12).toFixed(2) + ' T';
        } else if (absValue >= 1e9) {
            return '$' + (value / 1e9).toFixed(2) + ' B';
        } else if (absValue >= 1e6) {
            return '$' + (value / 1e6).toFixed(2) + ' M';
        } else if (absValue >= 1e3) {
             return '$' + value.toLocaleString('en-US', { maximumFractionDigits: 0 });
        } else {
             // For smaller numbers or prices, show more precision if needed
             return '$' + value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 }); // Adjust precision as needed
        }
    }

     // --- Mock Data Generator (for Market Data) ---
    function generateMockMarketData(count) {
        // (Same generator as before, ensure it produces id, name, symbol, price, change24h, marketCap, volume24h)
        const names = ['Bitcoin', 'Ethereum', 'Ripple', 'Litecoin', 'Cardano', 'Polkadot', 'Solana', 'Dogecoin', 'Shiba Inu', 'Chainlink', 'Avalanche', 'Tron', 'Monero', 'Stellar'];
        const symbols = ['BTC', 'ETH', 'XRP', 'LTC', 'ADA', 'DOT', 'SOL', 'DOGE', 'SHIB', 'LINK', 'AVAX', 'TRX', 'XMR', 'XLM'];
        const data = [];
        for (let i = 1; i <= count; i++) {
            const nameIndex = Math.floor(Math.random() * names.length);
            const basePrice = Math.random() * 70000 + (Math.random() * 500);
            data.push({
                rank: i,
                // Use more unique-like IDs for portfolio testing
                id: symbols[nameIndex] + i, // Combine symbol and index for a unique-ish mock ID
                name: `${names[nameIndex]}`,
                symbol: `${symbols[nameIndex]}`,
                price: basePrice * (1 + (Math.random() - 0.5) * 0.1), // Slight variation around base
                change24h: (Math.random() * 12) - 6, // -6% to +6%
                marketCap: basePrice * (Math.random() * 15000 + 10000), // Derived market cap
                volume24h: basePrice * (Math.random() * 500 + 100) // Derived volume
            });
        }
        return data.sort((a, b) => a.rank - b.rank);
    }


    // --- Run the App ---
    initializeApp();

    // Set interval for refreshing market data
    clearInterval(updateInterval);
    updateInterval = setInterval(fetchMarketData, UPDATE_INTERVAL_MS);

}); // End DOMContentLoaded