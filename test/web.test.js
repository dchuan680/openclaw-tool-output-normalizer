const test = require('node:test');
const assert = require('node:assert/strict');
const { normalizeToolOutput } = require('../dist');

test('web normalizer: detects payload and warns when short', () => {
  const result = normalizeToolOutput({ title: 'T', url: 'https://a.com', content: 'Navigation\nshort' });

  assert.equal(result.meta.detected_type, 'web');
  assert.ok(result.summary.length > 0);
  assert.ok(Object.keys(result.important_fields).length > 0);
  assert.ok(typeof result.meta.token_before === 'number');
  assert.ok(typeof result.meta.token_after === 'number');
  assert.ok(result.warnings.length > 0);
});
