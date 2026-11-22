const assert = require('node:assert/strict');
const test = require('node:test');
const invoice = require('../lib/invoice');
const pricing = require('../lib/pricing');

const rice = { id: 1, name: 'Rice', sku: 'RICE', hsn: '1006', price: 2240, qty: 1 };
const ghee = { id: 2, name: 'Ghee', hsn: '0405', price: 100, qty: 1 };
const tea = { id: 3, name: 'Tea', hsn: '0902', price: 100, qty: 1 };

test('invoice resolves 5% and 12% GST by HSN', () => {
  const figures = invoice.computeInvoiceFigures({ items: [rice, ghee] });
  assert.deepEqual(figures.rows.map(row => row.gstPercent), [5, 12]);
  assert.equal(figures.tax, 124);
});

test('invoice caps SAVE10 and applies it before GST', () => {
  const figures = invoice.computeInvoiceFigures({ items: [rice], coupon: 'SAVE10' });
  assert.equal(figures.discount, 150);
  assert.equal(figures.total, 2194.5);
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

test('invoice matches checkout totals, GST split and line taxes for a capped mixed-slab order', () => {
  const items = [rice, ghee, tea];
  const coupon = 'SAVE10';
  const billed = pricing.computeTotals(items, coupon);
  const figures = invoice.computeInvoiceFigures({ items, coupon, ...billed });

  for (const field of ['subtotal', 'discount', 'tax', 'cgst', 'sgst', 'total']) {
    assert.equal(figures[field], billed[field], field);
  }
  assert.deepEqual(figures.rows.map(row => row.lineTax), billed.lines.map(line => line.tax));
  assert.deepEqual(figures.rows.map(row => row.gstPercent), [5, 12, 18]);
});
