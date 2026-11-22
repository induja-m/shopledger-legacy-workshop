# ShopLedger

Node.js, Express 4, body-parser, CommonJS, and a browser UI built with HTML, CSS, and vanilla JavaScript. App data lives in a local JSON file.

## Module map

- `server.js` serves `public/`, mounts the API routers, and renders printable invoices.
- `routes/` handles products, orders, customers, and reports.
- `lib/` handles pricing, coupons, GST, invoicing, orders, dates, inventory, Khata, reports, and JSON storage.
- `config.js` contains shop, tax, coupon, and inventory settings.
- `data/db.json` stores products, orders, customer ledgers, and audit data.

## Commands

- `npm install` installs existing dependencies.
- `npm start` starts the app on port 3000 by default.
- `node --test` runs Node's built-in test runner. The `npm test` script is a placeholder.

## Workshop rules

- Write characterization tests before changing behavior.
- Limit production changes to the module involved in the ticket.
- Use in-memory fixtures for tests. Never read or write `data/db.json` in tests.
- Add no dependencies.
