# Product Carousel - JavaScript Implementation

This project is a custom-built product carousel created using only vanilla JavaScript (ES6). It replicates the product recommendation section found on the homepage of the ebebek.com website.

## Objective

- Dynamically fetch product data from a remote JSON source
- Display products in a horizontal, scrollable carousel layout
- Calculate and display discounts only when the product is on sale
- Allow users to favorite products, with state saved in localStorage
- Ensure responsiveness and compatibility across devices
- All functionality built using native DOM manipulation methods

## Technologies Used

- JavaScript (ES6+)
- Dynamic DOM manipulation
- `fetch` API
- `localStorage` for caching and user preferences
- No third-party libraries, frameworks, or external CSS

## Features

- Products are fetched and cached in `localStorage` to avoid repeated network requests
- Discount percentage is displayed only if `price < original_price`
- Favorite system toggles a heart icon and persists using `localStorage`
- Carousel renders only on the homepage (`location.pathname === '/'`)
- Fully responsive layout with basic inline CSS styling
- All structure and logic are implemented within a single `.js` file

## How to Use

1. Navigate to https://www.e-bebek.com (homepage only)
2. Open Developer Tools → Console
3. Paste the contents of the JavaScript file and press Enter
4. The carousel will be rendered above the "Sizin için Seçtiklerimiz" section

## File Structure

```bash
.
├── elif_isik.js      # Main script file
└── README.md         # Project documentation
