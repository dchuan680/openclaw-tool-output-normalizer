const test = require('node:test');
const assert = require('node:assert/strict');
const { normalizeToolOutput } = require('../dist');

test('table normalizer: detects table and summarizes shape', () => {
  const bigRows = Array.from({ length: 40 }, (_, i) => [`name-${i}`, i, `note-${'x'.repeat(30)}`]);
  const result = normalizeToolOutput({
    headers: ['name', 'score', 'notes'],
    rows: bigRows
  });

  assert.equal(result.meta.detected_type, 'table');
  assert.ok(result.summary.length > 0);
  assert.ok(Object.prototype.hasOwnProperty.call(result.important_fields, 'row_count'));
  assert.ok(result.meta.token_after <= result.meta.token_before);
});

test('table normalizer: warns for empty table', () => {
  const result = normalizeToolOutput({ headers: [], rows: [] });
  assert.ok(result.warnings.length > 0);
});
