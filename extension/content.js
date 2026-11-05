(() => {
  "use strict";

  // Remove formatting prefixes only; preserve text and emoji inside the title.
  const prefix = /^[\u200B-\u200F\u202A-\u202E\u2060-\u206F\uFEFF]+/u;
  const clean = () => {
    const title = document.title;
    const readable = title.replace(prefix, "");
    if (readable && readable !== title) document.title = readable;
  };

  // Feishu updates titles dynamically, including after navigation within a page.
  new MutationObserver(clean).observe(document.head, {
    subtree: true,
    childList: true,
    characterData: true,
  });
  clean();
})();
