const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'extension/content.js'), 'utf8');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'extension/manifest.json')));

// Minimal title/observer harness: each write schedules a mutation callback.
function page(initial) {
  let title = initial, writes = 0, callback, pending = false;
  const document = {
    head: {},
    get title() { return title; },
    set title(value) { title = value; writes++; pending = true; },
  };
  vm.runInNewContext(source, {
    document,
    MutationObserver: class {
      constructor(fn) { callback = fn; }
      observe(target) { assert.equal(target, document.head); }
    },
  });
  function flush() {
    let rounds = 0;
    while (pending) {
      assert.ok(++rounds < 10, 'title updates must converge');
      pending = false;
      callback();
    }
  }
  flush();
  return {
    get title() { return title; },
    get writes() { return writes; },
    update(value) { document.title = value; flush(); },
  };
}

test('cleans the observed U+202C failure on initial load', () => {
  assert.equal(page('\u202c项目笔记 - 飞书云文档').title, '项目笔记 - 飞书云文档');
});
test('handles mixed formatting prefixes and subsequent title changes', () => {
  const p = page('\u200c\ufeff\u2061\u202c项目笔记');
  assert.equal(p.title, '项目笔记');
  p.update('\u202c新的标题');
  assert.equal(p.title, '新的标题');
  p.update('正常标题');
  assert.equal(p.title, '正常标题');
});
test('preserves internal formatting, emoji, punctuation, and visible text', () => {
  const title = '家庭 👨‍👩‍👧‍👦 · 中文 / العربية a\u200db';
  assert.equal(page('\u202c' + title).title, title);
  assert.equal(page(title).writes, 0);
});
test('does not replace empty or entirely invisible titles with an empty result', () => {
  for (const title of ['', '\u202c\u200b']) {
    const p = page(title);
    assert.equal(p.title, title);
    assert.equal(p.writes, 0);
  }
});
test('cleaning converges after one correction', () => {
  const p = page('\u202cTitle');
  assert.equal(p.writes, 1);
  p.update('\u202cChanged');
  assert.equal(p.writes, 3);
});
test('manifest explicitly identifies Dia and limits matching to Feishu documents', () => {
  assert.match(manifest.name, /Dia/);
  assert.equal(manifest.manifest_version, 3);
  assert.deepEqual(manifest.content_scripts[0].matches, ['base','docx','docs','wiki','sheets','slides'].map(p => `https://*.feishu.cn/${p}/*`));
  assert.equal(manifest.content_scripts[0].run_at, 'document_end');
  assert.equal(manifest.permissions, undefined);
  assert.equal(manifest.background, undefined);
  assert.equal(manifest.content_scripts[0].all_frames, undefined);
  assert.equal(manifest.version, JSON.parse(fs.readFileSync(path.join(root,'package.json'))).version);
});
test('release ZIP contains only the extension and license, with exact source bytes', () => {
  execFileSync('python3', ['scripts/package.py'], { cwd: root });
  execFileSync('python3', ['-c', `
import json, pathlib, zipfile
root = pathlib.Path('.')
v = json.loads((root/'extension/manifest.json').read_text())['version']
with zipfile.ZipFile(root/'dist'/f'dia-feishu-title-fix-{v}.zip') as z:
    assert set(z.namelist()) == {'manifest.json', 'content.js', 'LICENSE'}
    for name in ('manifest.json', 'content.js'):
        assert z.read(name) == (root/'extension'/name).read_bytes()
    assert z.read('LICENSE') == (root/'LICENSE').read_bytes()
`], { cwd: root });
});
