const test = require('node:test');
const assert = require('node:assert/strict');
const { normalizeToolOutput } = require('../dist');

test('json normalizer: detects json and returns compact structure', () => {
  const result = normalizeToolOutput({
    id: 'u1',
    name: 'Alice',
    status: 'ok',
    items: new Array(20).fill({ value: 'x'.repeat(100) })
  });

  assert.equal(result.meta.detected_type, 'json');
  assert.ok(result.summary.length > 0);
  assert.ok(Object.keys(result.important_fields).length > 0);
  assert.ok(typeof result.meta.token_before === 'number');
  assert.ok(typeof result.meta.token_after === 'number');
  assert.ok(result.meta.token_after <= result.meta.token_before);
});
