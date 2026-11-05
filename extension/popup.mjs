import { HOST_PATTERNS, findFeishuTabs, closeFeishuTabs } from './tabs.mjs';

const zh = navigator.language.toLowerCase().startsWith('zh');
const words = zh ? {
  heading: '飞书标签', scope: '当前配置的所有窗口，包含固定标签',
  enable: '启用一键关闭', loading: '正在读取…', closing: '正在关闭…',
  close: n => `关闭全部飞书标签（${n}）`, empty: '没有飞书标签',
  permission: '首次使用需允许访问飞书相关站点。',
  denied: '未授予权限。标题修复仍正常运行。',
  done: n => `已关闭 ${n} 个标签。`,
  remaining: n => `仍有 ${n} 个飞书标签未关闭。`,
  error: '操作失败，请重新打开插件后重试。',
} : {
  heading: 'Feishu tabs', scope: 'All windows in this profile, including pinned tabs',
  enable: 'Enable one-click close', loading: 'Loading…', closing: 'Closing…',
  close: n => `Close all Feishu tabs (${n})`, empty: 'No Feishu tabs',
  permission: 'First use requires access to Feishu-related sites.',
  denied: 'Permission not granted. Title fixing still works.',
  done: n => `Closed ${n} tabs.`,
  remaining: n => `${n} Feishu tabs remain open.`,
  error: 'Unable to complete the action. Reopen the extension to retry.',
};
const button = document.querySelector('#close-tabs');
const status = document.querySelector('#status');
let granted = false;
document.documentElement.lang = zh ? 'zh-CN' : 'en';
document.querySelector('#heading').textContent = words.heading;
document.querySelector('#scope').textContent = words.scope;
function message(text, error = false) {
  status.textContent = text;
  status.dataset.error = String(error);
}
async function refresh() {
  granted = await chrome.permissions.contains({ origins: HOST_PATTERNS });
  if (!granted) {
    button.textContent = words.enable;
    button.disabled = false;
    return;
  }
  const tabs = await findFeishuTabs();
  button.textContent = tabs.length ? words.close(tabs.length) : words.empty;
  button.disabled = tabs.length === 0;
}
button.addEventListener('click', async () => {
  button.disabled = true;
  try {
    if (!granted) {
      // Request directly inside the click gesture. Granting never closes tabs.
      const allowed = await chrome.permissions.request({ origins: HOST_PATTERNS });
      await refresh();
      message(allowed ? '' : words.denied);
      return;
    }
    button.textContent = words.closing;
    message('');
    const result = await closeFeishuTabs();
    await refresh();
    message(result.remaining ? `${words.done(result.closed)} ${words.remaining(result.remaining)}` : words.done(result.closed), result.remaining > 0);
  } catch {
    message(words.error, true);
    try { await refresh(); } catch { button.textContent = words.error; }
  }
});
button.textContent = words.loading;
try {
  await refresh();
  if (!granted) message(words.permission);
} catch {
  button.textContent = words.error;
  message(words.error, true);
}
