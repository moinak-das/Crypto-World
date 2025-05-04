# Crypto World - Your Real-Time Edge [Alfresco 2k25 Submission] 🚀

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Hackathon Alfresco 2k25 Submission**

Welcome to Crypto World, our vision for a clean, fast, and responsive frontend interface for tracking the dynamic world of cryptocurrency markets and managing personal portfolios. Built with passion during Hackathon Alfresco 2k25!

We aimed to create an intuitive dashboard that empowers users – from beginners to seasoned traders – to stay informed with real-time data and insights, all presented in a sleek, modern interface.

---

## ✨ Live Demo (Hypothetical)

*[Link to Live Demo Here - e.g., hosted on Netlify/Vercel/GitHub Pages]*

*(Note: As this is a frontend-only demo, portfolio data uses LocalStorage and market data is currently mocked.)*

---

## 📸 Screenshots (Placeholder)

*(Insert a GIF or screenshots here showing the Market View, Portfolio, Coin Detail Chart, and Theme Switching)*

* *Market Overview (Light/Dark)*
* *Portfolio Tracking*
* *Coin Detail with Price Chart*
* *Responsive Design on Mobile*

---

## 💡 Key Features

* **📈 Real-Time Market Overview:** Track top cryptocurrencies with essential data points (Price, 24h Change, Market Cap, Volume). *Currently uses mock data refreshing every 60 seconds.*
* **🔍 Instant Search:** Quickly filter and find specific cryptocurrencies by name or symbol.
* **📊 Detailed Coin View:** Click on a coin (or the 'Chart' button) to view more stats and an interactive historical price chart (powered by Chart.js). *Chart data is currently mocked.*
* **💼 Personal Portfolio Tracking:**
    * Add your crypto holdings (Coin, Quantity, optional Purchase Price).
    * View current value based on live(mock) market prices.
    * See your total portfolio value at a glance.
    * Remove holdings easily.
    * *(Demo uses Browser `localStorage` - see notes below)*
* **🎨 Dark/Light Theme Toggle:** Switch seamlessly between a slick dark mode (default) and a clean light mode. Your preference is saved!
* **📱 Fully Responsive Design:** Looks and works great on desktops, tablets, and mobile devices. Navigation adapts gracefully.
* **🧩 Modular Code:** Well-structured HTML, CSS (with variables for theming!), and JavaScript (split into logical modules for maintainability).

---

## 🚀 Our Design Philosophy & "The Idea"

For Hackathon Alfresco 2k25, we focused on building a **frontend-first experience** that prioritizes:

1.  **Clarity & Speed:** Provide essential market data quickly and clearly. The UI is designed to be intuitive, reducing clutter.
2.  **User Empowerment:** Integrate portfolio tracking directly, allowing users to see not just the market, but *their* stake in it.
3.  **Visual Comfort:** Offer both Dark and Light modes to suit user preference and reduce eye strain during long tracking sessions.
4.  **Accessibility:** Build a responsive interface that works across devices, ensuring users can track crypto on the go.
5.  **Foundation for Growth:** While using mock data and `localStorage` for this hackathon version, the modular structure is designed to easily integrate with real APIs and a secure backend later.

We believe a great tracker isn't just about data; it's about presenting that data in a way that's actionable and pleasant to use.

---

## 🛠️ Technology Stack

* **HTML5:** Semantic structure for content and accessibility.
* **CSS3:** Modern styling, Flexbox/Grid layouts, **CSS Variables** (Custom Properties) for efficient theming.
* **JavaScript (ES6+):** Core application logic, DOM manipulation, API interaction simulation, event handling. Code is organized into modules (`script.js`, `portfolio.js`, `chart-handler.js`).
* **Chart.js:** For rendering beautiful, interactive price charts.
* **LocalStorage API:** Used *for demonstration purposes only* to persist theme preference and portfolio data within the browser.

---

## 🏁 Getting Started (Local Setup)

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/moinak-das/Crypto-World.git](https://github.com/moinak-das/Crypto-World.git) 
    cd Crypto-World
    ```
2.  **Open `index.html`:**
    Simply open the `index.html` file in your preferred web browser.

That's it! You can explore the Market view, add mock portfolio data, view charts, and toggle the theme.

---

## 🔮 Future Scope (Beyond the Hackathon)

* **Real API Integration & Backend:** The highest priority! Connect to live market data APIs via a secure backend proxy.
* **User Authentication:** Implement secure user login/signup and store portfolio data per user in a database.
* **Real-Time Updates:** Utilize WebSockets (if supported by the API/backend) for true real-time price updates without constant polling.
* **Advanced Portfolio:** Calculate Profit/Loss, track transaction history, display portfolio distribution charts.
* **Watchlist Feature:** Allow users to create a custom list of coins to monitor.
* **Price Alerts:** Set up notifications for price movements.
* **Progressive Web App (PWA):** Add offline capabilities and install-to-homescreen functionality.
* **More Chart Options:** Add different timeframes (1D, 7D, 1M, 1Y), indicators (MACD, RSI), and chart types.
* **Enhanced Accessibility (A11y):** Further testing and refinement for screen readers and keyboard navigation.

---

## 🧑‍💻 Team (Alfresco 2k25)

* *[Moinak Das / A student of second year Electrical Engineering Department of Government College of Engineering and Textile Technology, Berhampore]*


