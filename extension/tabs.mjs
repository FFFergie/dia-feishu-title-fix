export const FEISHU_DOMAINS = Object.freeze([
  'feishu.cn', 'feishu.link', 'feishuapp.com', 'larkoffice.com', 'larksuite.com',
]);
export const HOST_PATTERNS = FEISHU_DOMAINS.map(domain => `https://*.${domain}/*`);

export function isFeishuUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && FEISHU_DOMAINS.some(domain =>
      url.hostname === domain || url.hostname.endsWith(`.${domain}`));
  } catch {
    return false;
  }
}

export async function findFeishuTabs(api = chrome) {
  const tabs = await api.tabs.query({ url: HOST_PATTERNS });
  return tabs.filter(tab => Number.isInteger(tab.id) && isFeishuUrl(tab.url));
}

export async function closeFeishuTabs(api = chrome) {
  const tabs = await findFeishuTabs(api);
  if (!tabs.length) return { closed: 0, remaining: 0 };
  await api.tabs.remove(tabs.map(tab => tab.id));
  const remaining = await findFeishuTabs(api);
  const stillOpen = new Set(remaining.map(tab => tab.id));
  return { closed: tabs.filter(tab => !stillOpen.has(tab.id)).length, remaining: remaining.length };
}
