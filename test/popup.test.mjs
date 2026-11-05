import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { HOST_PATTERNS } from '../extension/tabs.mjs';
let sequence = 0;
async function mount({ granted = false, allow = true, tabs = [] } = {}) {
  const nodes = Object.fromEntries(['#heading','#scope','#close-tabs','#status','#limit'].map(id => [id, {textContent:'',disabled:true,dataset:{},addEventListener(type,fn){this[type]=fn;}}]));
  let permission = granted, removed = 0, requests = 0;
  globalThis.document = {documentElement:{},querySelector:id=>nodes[id]};
  Object.defineProperty(globalThis,'navigator',{value:{language:'zh-CN'},configurable:true});
  globalThis.chrome = {
    permissions:{contains:async()=>permission,request:async args=>{assert.deepEqual(args,{origins:HOST_PATTERNS}); requests++;permission=allow;return allow;}},
    tabs:{query:async()=>tabs,remove:async ids=>{removed+=ids.length;tabs=tabs.filter(t=>!ids.includes(t.id));}},
  };
  await import(`../extension/popup.mjs?test=${sequence++}`);
  return {nodes,click:()=>nodes['#close-tabs'].click(),get removed(){return removed},get requests(){return requests}};
}
test('first use requests permission without closing tabs', async()=>{
  const ui=await mount({tabs:[{id:1,url:'https://a.feishu.cn/'}]});
  assert.equal(ui.nodes['#close-tabs'].textContent,'启用一键关闭');
  await ui.click();
  assert.equal(ui.requests,1);assert.equal(ui.removed,0);
  assert.equal(ui.nodes['#close-tabs'].textContent,'关闭飞书标签（1）');
  await ui.click();
  assert.equal(ui.removed,1);assert.equal(ui.requests,1);
  assert.equal(ui.nodes['#status'].textContent,'已关闭 1 个标签。');
});
test('permission denial leaves a retry button and closes nothing', async()=>{
  const ui=await mount({allow:false});await ui.click();
  assert.equal(ui.removed,0);assert.equal(ui.nodes['#close-tabs'].disabled,false);
  assert.match(ui.nodes['#status'].textContent,/未授予权限/);
});
test('empty state disables closing without asking for permission again', async()=>{
  const ui=await mount({granted:true});
  assert.equal(ui.nodes['#close-tabs'].textContent,'没有已加载的飞书标签');
  assert.equal(ui.nodes['#close-tabs'].disabled,true);assert.equal(ui.requests,0);
});
test('optional host permissions exactly match tab detection scope',()=>{
  const manifest=JSON.parse(readFileSync(new URL('../extension/manifest.json',import.meta.url)));
  assert.deepEqual(manifest.optional_host_permissions,HOST_PATTERNS);
  assert.equal(manifest.permissions,undefined);
  assert.equal(manifest.action.default_popup,'popup.html');
});
