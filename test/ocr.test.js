const test = require('node:test');
const assert = require('node:assert/strict');
const { normalizeToolOutput } = require('../dist');

test('ocr normalizer: detects ocr payload and extracts key-values', () => {
  const result = normalizeToolOutput({ ocr: 'Invoice: INV-1\nDate: 2026-01-01\nAmt: 20' });

  assert.equal(result.meta.detected_type, 'ocr');
  assert.ok(result.summary.length > 0);
  assert.ok(Object.keys(result.important_fields).length > 0);
  assert.ok(result.warnings.length > 0);
});
