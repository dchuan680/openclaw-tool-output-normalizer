const test = require('node:test');
const assert = require('node:assert/strict');
const { normalizeToolOutput } = require('../dist');

test('web normalizer: detects payload and warns when short', () => {
  const result = normalizeToolOutput({ title: 'T', url: 'https://a.com', content: 'Navigation\nshort' });

  assert.equal(result.meta.detected_type, 'web');
  assert.ok(result.summary.length > 0);
  assert.ok(Object.prototype.hasOwnProperty.call(result.important_fields, 'title'));
  assert.ok(result.warnings.length > 0);
});
