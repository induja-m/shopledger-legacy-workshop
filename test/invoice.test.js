const assert = require('node:assert/strict');
const test = require('node:test');
const invoice = require('../lib/invoice');
const pricing = require('../lib/pricing');

const rice = { id: 1, name: 'Rice', sku: 'RICE', hsn: '1006', price: 2240, qty: 1 };
const ghee = { id: 2, name: 'Ghee', hsn: '0405', price: 100, qty: 1 };
const tea = { id: 3, name: 'Tea', hsn: '0902', price: 100, qty: 1 };

test('CURRENT BEHAVIOUR: invoice defaults HSN items to 18% GST', () => {
  const figures = invoice.computeInvoiceFigures({ items: [rice, ghee] });
  assert.deepEqual(figures.rows.map(row => row.gstPercent), [18, 18]);
  assert.equal(figures.tax, 421.2);
});

test('CURRENT BEHAVIOUR: invoice applies uncapped coupon to the tax-inclusive subtotal', () => {
  const figures = invoice.computeInvoiceFigures({ items: [rice], coupon: 'SAVE10' });
  assert.equal(figures.discount, 264.32);
  assert.equal(figures.total, 2378.88);
});

test('checkout caps SAVE10 at ₹150 and taxes the discounted rice at 5%', () => {
  const figures = pricing.computeTotals([rice], 'SAVE10');
  assert.equal(figures.discount, 150);
  assert.equal(figures.tax, 104.5);
  assert.equal(figures.total, 2194.5);
});

test('invoice matches checkout for an 18% item without a coupon', () => {
  const figures = invoice.computeInvoiceFigures({ items: [tea] });
  assert.equal(figures.tax, 18);
  assert.equal(figures.total, 118);
});
