import assert from 'node:assert/strict';
import test from 'node:test';

import { escapeHTML } from './html.ts';

test('escapes HTML special characters', () => {
  assert.equal(escapeHTML('foo & bar'), 'foo &amp; bar');
  assert.equal(escapeHTML('<none>'), '&lt;none&gt;');
  assert.equal(escapeHTML('"quoted"'), '&quot;quoted&quot;');
  assert.equal(
    escapeHTML('Error: HTTP Error 526 for https://example.com: <none>'),
    'Error: HTTP Error 526 for https://example.com: &lt;none&gt;',
  );
});

test('handles empty or default strings', () => {
  assert.equal(escapeHTML(''), '');
  assert.equal(escapeHTML(undefined), '');
});
