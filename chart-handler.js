// --- Chart Handler ---
let priceChartInstance = null; // Store the chart instance

function destroyExistingChart() {
    if (priceChartInstance) {
        priceChartInstance.destroy();
        priceChartInstance = null;
    }
}

async function displayPriceChart(coinId, coinName) {
    const chartCanvas = document.getElementById('price-chart');
    const detailLoading = document.getElementById('coin-detail-loading');
    const chartContainer = document.querySelector('.chart-container'); // Target container

    if (!chartCanvas || !detailLoading || !chartContainer) {
        console.error("Chart canvas or loading indicator not found!");
        return;
    }

    destroyExistingChart(); // Clear previous chart
    chartContainer.style.display = 'none'; // Hide chart initially
    detailLoading.style.display = 'block'; // Show loading

    try {
        // --- MOCK CHART DATA SIMULATION ---
        // Replace this with actual API call to get historical data (e.g., price history for last 7 days)
        console.log(`Workspaceing chart data for ${coinName} (ID: ${coinId})...`);
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate fetch delay

        const labels = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Today'];
        const dataPoints = labels.map(() => Math.random() * 50000 + 10000); // Random data
        // --- END MOCK ---

        /* --- REAL API FETCH FOR CHART DATA (Example Idea) ---
         // const historyUrl = `https://api.example-crypto-data.com/v1/coins/${coinId}/history?interval=daily&period=7d`; // Adjust URL/params
         // const response = await fetch(historyUrl, { headers: { 'X-API-KEY': 'YOUR_KEY' } }); // Add auth if needed
         // if (!response.ok) throw new Error('Failed to load historical data');
         // const historyData = await response.json();
         //
         // // --- Adapt data structure ---
         // const labels = historyData.timestamps.map(ts => new Date(ts * 1000).toLocaleDateString()); // Example
         // const dataPoints = historyData.prices; // Example
         --- END REAL API --- */


        chartContainer.style.display = 'block'; // Show container before rendering chart
        const ctx = chartCanvas.getContext('2d');
        priceChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: `${coinName} Price (USD)`,
                    data: dataPoints,
                    borderColor: getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim() || '#e94560', // Use theme accent color
                    backgroundColor: 'rgba(233, 69, 96, 0.1)', // Use a subtle fill
                    tension: 0.1,
                    borderWidth: 2,
                    pointBackgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim() || '#e94560',
                    pointRadius: 3,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, // Allow chart to fill container height
                scales: {
                    y: {
                        beginAtZero: false, // Don't force scale to start at 0
                        ticks: {
                            callback: function(value, index, values) {
                                return '$' + value.toLocaleString(); // Format Y-axis ticks as currency
                            },
                            color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim() || '#a0a0a0' // Theme color
                        },
                         grid: {
                            color: getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim() || '#2a2a4a' // Theme color
                        }
                    },
                    x: {
                         ticks: {
                             color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim() || '#a0a0a0' // Theme color
                         },
                         grid: {
                            display: false // Hide vertical grid lines for cleaner look
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                             color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim() || '#e0e0e0' // Theme color
                        }
                    },
                    tooltip: {
                         callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += '$' + context.parsed.y.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                                }
                                return label;
                            }
                         }
                    }
                }
            }
        });

    } catch (error) {
        console.error("Failed to display price chart:", error);
        chartContainer.innerHTML = `<p class="error-message">Could not load chart data.</p>`;
        chartContainer.style.display = 'block'; // Still show container to display error
    } finally {
        detailLoading.style.display = 'none'; // Hide loading
    }
}

// Function to update chart colors on theme change
function updateChartTheme() {
    if (!priceChartInstance) return;

    const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim();
    const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim();
    const secondaryTextColor = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim();
    const borderColor = getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim();

    // Update dataset colors
    priceChartInstance.data.datasets[0].borderColor = accentColor;
    priceChartInstance.data.datasets[0].backgroundColor = accentColor + '1A'; // Add alpha
    priceChartInstance.data.datasets[0].pointBackgroundColor = accentColor;

    // Update scale/tick/legend colors
    priceChartInstance.options.scales.y.ticks.color = secondaryTextColor;
    priceChartInstance.options.scales.y.grid.color = borderColor;
    priceChartInstance.options.scales.x.ticks.color = secondaryTextColor;
    priceChartInstance.options.plugins.legend.labels.color = textColor;

    priceChartInstance.update(); // Redraw the chart with new colors
}