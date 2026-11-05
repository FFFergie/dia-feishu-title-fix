import { test } from 'node:test';
import assert from 'node:assert/strict';
import { HOST_PATTERNS, isFeishuUrl, findFeishuTabs, closeFeishuTabs } from '../extension/tabs.mjs';

test('matches exact Feishu and Lark hosts, not deceptive URLs or unrelated pages', () => {
  for (const domain of ['feishu.cn','feishu.link','feishuapp.com','larkoffice.com','larksuite.com']) {
    assert.equal(isFeishuUrl(`https://${domain}/`), true);
    assert.equal(isFeishuUrl(`https://team.${domain}/anything`), true);
  }
  for (const url of ['https://feishu.cn.example.com/', 'https://notfeishu.cn/', 'https://example.com/?next=https://feishu.cn', 'chrome://extensions/', 'file:///feishu.cn', 'invalid']) {
    assert.equal(isFeishuUrl(url), false, url);
  }
  assert.equal(HOST_PATTERNS.length, 5);
});

test('finds matching tabs across windows, including pinned tabs, without a tabs permission', async () => {
  const api = { tabs: { query: async query => {
    assert.deepEqual(query, { url: HOST_PATTERNS });
    return [{id:1,windowId:1,url:'https://a.feishu.cn/docx/a'}, {id:2,windowId:2,pinned:true,url:'https://b.feishu.link/app/x'}, {id:3,url:'https://example.com/'}];
  } } };
  assert.deepEqual((await findFeishuTabs(api)).map(t=>t.id), [1,2]);
});

test('closing re-queries current tabs and preserves unrelated tabs', async () => {
  let tabs=[{id:1,url:'https://a.feishu.cn/wiki/a'},{id:2,url:'https://example.com/'},{id:3,url:'https://b.larkoffice.com/docx/b'}];
  const api={tabs:{query:async()=>tabs,remove:async ids=>{assert.deepEqual(ids,[1,3]);tabs=tabs.filter(t=>!ids.includes(t.id));}}};
  assert.deepEqual(await closeFeishuTabs(api), {closed:2,remaining:0});
  assert.deepEqual(tabs.map(t=>t.id),[2]);
});

test('empty matches do not call remove', async () => {
  const api={tabs:{query:async()=>[],remove:async()=>assert.fail('unexpected remove')}};
  assert.deepEqual(await closeFeishuTabs(api),{closed:0,remaining:0});
});

test('reports tabs that remain open and propagates API failures', async () => {
  const tabs=[{id:1,url:'https://a.feishu.cn/'}];
  assert.deepEqual(await closeFeishuTabs({tabs:{query:async()=>tabs,remove:async()=>{}}}),{closed:0,remaining:1});
  await assert.rejects(closeFeishuTabs({tabs:{query:async()=>tabs,remove:async()=>{throw new Error('denied')}}}),/denied/);
});
