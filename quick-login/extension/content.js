/**
 * Quick Login - Content Script
 *
 * 从油猴脚本转换而来，主要改动：
 * - 使用本地打包的 node-forge（不再 eval + CDN 动态加载）
 * - 使用原生 atob + Uint8Array 替代 Buffer
 * - 优先从 chrome.storage.local 读取配置（popup 可视化编辑），config.js 作为兜底默认值
 */
(async function () {
  'use strict';

  // ========================
  // 配置：优先 storage，兜底 config.js
  // ========================
  function loadConfig() {
    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get('quickLoginConfig', (result) => {
          resolve(result.quickLoginConfig || QUICK_LOGIN_CONFIG);
        });
      } else {
        resolve(QUICK_LOGIN_CONFIG);
      }
    });
  }

  const cfg = await loadConfig();
  const DEFAULT_PASSWORD = cfg.defaultPassword;
  const host = window.location.host;
  const USERS = cfg.hosts[host] || cfg.defaultUsers;

  if (!USERS || USERS.length === 0) return;

  // ========================
  // Toast 提示
  // ========================
  function showToast(type, text) {
    const colorMap = {
      success: '#52c41a',
      error: '#ff4d4f',
      loading: '#1890ff',
    };

    const toast = document.createElement('div');
    toast.textContent = text;
    toast.style.cssText = `
      position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
      background: ${colorMap[type] || '#333'}; color: #fff;
      padding: 10px 20px; border-radius: 4px; font-size: 14px;
      z-index: 9999; box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      opacity: 0; transition: opacity 0.3s;
    `;
    document.body.appendChild(toast);
    setTimeout(() => (toast.style.opacity = 1), 10);

    const remove = () => {
      toast.style.opacity = 0;
      setTimeout(() => toast.remove(), 300);
    };

    if (type !== 'loading') {
      setTimeout(remove, 2000);
    }

    return remove;
  }

  // ========================
  // Base64 / Hex 工具（替代 Buffer）
  // ========================
  function base64UrlToBase64(base64Url) {
    return base64Url
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      .concat('='.repeat((4 - (base64Url.length % 4)) % 4));
  }

  function base64ToBytes(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  function bytesToHex(bytes) {
    return Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  // ========================
  // 公钥 & 加密
  // ========================
  let publicKeyCache;

  async function loadPublicKey() {
    if (publicKeyCache) return publicKeyCache;
    const response = await fetch('/public/iam/api/v1/.wellKnown/publicKey');
    if (!response.ok) throw new Error('Failed to fetch public key');
    const data = await response.json();
    publicKeyCache = JSON.parse(data?.data);
    return publicKeyCache;
  }

  async function jwkToPem(jwk) {
    if (jwk.kty !== 'RSA') throw new Error('Only RSA keys are supported');
    if (!jwk.n || !jwk.e) throw new Error('Missing modulus (n) or exponent (e) in JWK');

    const n = bytesToHex(base64ToBytes(base64UrlToBase64(jwk.n)));
    const e = bytesToHex(base64ToBytes(base64UrlToBase64(jwk.e)));

    const publicKey = forge.pki.setRsaPublicKey(
      new forge.jsbn.BigInteger(n, 16),
      new forge.jsbn.BigInteger(e, 16),
    );

    return forge.pki.publicKeyToPem(publicKey);
  }

  async function encrypt(encryptText, jwk) {
    const config = await loadSiteConfig();
    const padding = (config?.['RSA_ENCRYPTION_PADDING'] ?? 'MGF1_SHA256').toUpperCase();

    const publicKeyPem = await jwkToPem(jwk);
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);

    let encrypted;
    if (padding === 'MGF1' || padding === 'MGF1_SHA1') {
      encrypted = publicKey.encrypt(forge.util.encodeUtf8(encryptText), 'RSA-OAEP', {
        md: forge.md.sha1.create(),
        mgf1: { md: forge.md.sha1.create() },
      });
    } else if (padding === 'PKCS1') {
      encrypted = publicKey.encrypt(encryptText, 'RSAES-PKCS1-V1_5');
    } else {
      encrypted = publicKey.encrypt(forge.util.encodeUtf8(encryptText), 'RSA-OAEP', {
        md: forge.md.sha256.create(),
        mgf1: { md: forge.md.sha256.create() },
      });
    }
    return forge.util.encode64(encrypted);
  }

  // ========================
  // 站点配置 & CSRF
  // ========================
  let siteConfig;

  async function loadSiteConfig() {
    if (siteConfig) return siteConfig;
    const response = await fetch('/config.json');
    if (!response.ok) throw new Error('Failed to fetch config.json');
    siteConfig = await response.json();
    return siteConfig;
  }

  async function getCsrfTokenPrefix() {
    try {
      const config = await loadSiteConfig();
      return config?.CSRF_TOKEN_PREFIX || 'agp-cookie-csrf';
    } catch {
      return 'agp-cookie-csrf';
    }
  }

  async function getCSRF() {
    const cookies = document.cookie.split('; ');
    const csrfKey = await getCsrfTokenPrefix();
    for (const cookie of cookies) {
      const [key] = cookie.split('=');
      if (key === csrfKey) {
        return cookie.substring(key.length + 1, cookie.length);
      }
    }
    return '';
  }

  // ========================
  // 登录
  // ========================
  async function loginWithUser(user) {
    const hide = showToast('loading', '正在登录 ' + user.name);
    try {
      const pubKey = await loadPublicKey();
      let vault = user.vault;
      if (pubKey && user.password) {
        vault = await encrypt(user.password, pubKey);
      }
      const res = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': await getCSRF(),
        },
        body: JSON.stringify({
          userAccountId: user.accountId,
          vault,
          userDomainCode: user.domainCode ?? 'designer',
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.message || '请求失败');
      }
      hide();
      showToast('success', '登录成功');
      localStorage.setItem('isLogin', 'true');
      if (location.hash === '#/login') {
        window.location.href = '/#/console';
      }
    } catch (e) {
      hide();
      showToast('error', '登录失败：' + e.message);
    }
  }

  // ========================
  // 快捷键
  // ========================
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.altKey) && e.key === 'Enter') {
      loginWithUser(USERS[0]);
    } else if (e.altKey && e.key - 1 < USERS.length && e.key >= '1' && e.key <= '9') {
      loginWithUser(USERS[e.key - 1]);
    } else if (e.altKey && e.key.toLowerCase() === 'q') {
      const wrapper = document.getElementById('quick-login-fab-wrapper');
      if (wrapper) {
        const show = wrapper.style.display === 'none';
        wrapper.style.display = show ? 'flex' : 'none';
        localStorage.setItem('login-fabVisible', show ? 'true' : 'false');
      }
    }
  });

  // ========================
  // 悬浮按钮 (FAB) UI
  // ========================
  const ctrlDiv = document.createElement('div');
  ctrlDiv.id = 'quick-login-controller';
  ctrlDiv.innerHTML = `
<style>
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
#quick-login-fab-wrapper { position: fixed; top: 100px; left: 20px; z-index: 9999; display: flex; gap: 10px; }
#quick-login-fab { opacity: 0.75; width: 48px; height: 48px; border-radius: 50%; cursor: grab; background: #136fb736;
    box-shadow: 0 0px 8px rgb(189 245 255 / 98%), inset 0 3px 1px rgb(98 193 245 / 54%) !important;
    display: flex; align-items: center; justify-content: center; user-select: none; font-size: 2em; color: #fff; }
#quick-login-fab-wrapper:hover #quick-login-fab { opacity: 1 !important; }
#quick-login-fab-wrapper:hover .quick-login-fab-btns { display: flex; }
.quick-login-fab-btns { display: none; flex-direction: column; gap: 6px; top: 0; left: 60px; }
.quick-login-fab-btns button { text-align: left; padding: 4px 8px; font-size: 12px; background-color: white;
    border: 1px solid #ccc; border-radius: 6px; cursor: pointer; white-space: nowrap; box-shadow: 0 1px 4px rgba(0,0,0,0.1); }
</style>
<div id="quick-login-fab-wrapper">
  <div id="quick-login-fab">
    <svg style="transform: scale(0.7); opacity: 1" fill="#ecf9fd" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M512 590.75c-142.5 0-258.75-116.25-258.75-258.75s116.25-262.5 258.75-262.5 258.75 116.25 258.75 258.75-116.25 262.5-258.75 262.5zM512 144.5c-101.25 0-183.75 82.5-183.75 183.75s82.5 183.75 183.75 183.75 183.75-82.5 183.75-183.75-82.5-183.75-183.75-183.75z"></path><path d="M170.75 950.75c-18.75 0-37.5-15-37.5-37.5 0-7.5 0-11.25 0-15 0-210 172.5-382.5 382.5-382.5 22.5 0 37.5 15 37.5 37.5s-15 37.5-37.5 37.5c-168.75 0-307.5 138.75-307.5 307.5v11.25c0 22.5-18.75 41.25-37.5 41.25v0z"></path><path d="M853.25 947v0c-22.5 0-37.5-15-37.5-37.5v-11.25c0-168.75-138.75-307.5-307.5-307.5-22.5 0-37.5-15-37.5-37.5s15-37.5 37.5-37.5c210 0 382.5 172.5 382.5 382.5 0 3.75 0 7.5 0 11.25 0 22.5-15 37.5-37.5 37.5z"></path></svg>
  </div>
  <div class="quick-login-fab-btns">
    ${USERS.map((u, i) => `<button class="quick-login-btn" data-index="${i}">Alt + ${i + 1}. 快速登录 ${u.name}</button>`).join('')}
  </div>
</div>`;
  document.body.appendChild(ctrlDiv);

  // ========================
  // FAB 拖拽 & 位置持久化
  // ========================
  function saveFabPosition(left, top) {
    localStorage.setItem('login-fabPosition', JSON.stringify({ left, top }));
  }

  function loadFabPosition(wrapper) {
    const pos = JSON.parse(localStorage.getItem('login-fabPosition'));
    if (pos && typeof pos.left === 'number' && typeof pos.top === 'number') {
      wrapper.style.left = `${pos.left}px`;
      wrapper.style.top = `${pos.top}px`;
    } else {
      wrapper.style.left = '0px';
      wrapper.style.top = '50%';
    }

    const visible = localStorage.getItem('login-fabVisible') ?? 'false';
    wrapper.style.display = visible === 'false' ? 'none' : 'flex';
  }

  const wrapper = document.getElementById('quick-login-fab-wrapper');
  const fab = document.getElementById('quick-login-fab');
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  loadFabPosition(wrapper);

  fab.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - wrapper.offsetLeft;
    offsetY = e.clientY - wrapper.offsetTop;
    fab.style.cursor = 'grabbing';
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const halfWidth = wrapper.offsetWidth / 2;
    const halfHeight = wrapper.offsetHeight / 2;

    let newLeft = Math.max(-halfWidth, Math.min(e.clientX - offsetX, window.innerWidth - halfWidth));
    let newTop = Math.max(-halfHeight, Math.min(e.clientY - offsetY, window.innerHeight - halfHeight));

    wrapper.style.left = `${newLeft}px`;
    wrapper.style.top = `${newTop}px`;
    saveFabPosition(newLeft, newTop);
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    fab.style.cursor = 'grab';
  });

  document.querySelectorAll('.quick-login-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const idx = +e.target.getAttribute('data-index');
      loginWithUser(USERS[idx]);
    });
  });

  // ========================
  // 登录表单内嵌按钮
  // ========================
  function createQuickLoginButton() {
    const control = document.querySelector(
      '.next-icestark-form .next-icestark-form-item:last-child',
    );
    if (!control) return;

    const btn = document.createElement('button');
    btn.id = 'fillFormBtn';
    btn.className = 'next-icestark-btn next-icestark-large next-icestark-btn-primary';
    btn.style.cssText = `
      width: 100%; margin-top: 10px; background: rgb(82, 144, 237);
      border-radius: 8.9px; height: 45px;
      box-shadow: rgba(0,0,0,0.12) 0px 4.44748px 6.67122px -1.11187px, rgba(0,0,0,0.07) 0px 2.22374px 4.44748px -1.11187px;
    `;
    btn.innerText = `Quick Login - ${USERS[0].name}`;

    control.appendChild(btn);
    btn.addEventListener('click', () => loginWithUser(USERS[0]));
  }

  function checkElement(times = 40) {
    if (times <= 0) return;
    const control = document.querySelector(
      '.next-icestark-form .next-icestark-form-item:last-child',
    );
    if (control) {
      createQuickLoginButton();
    } else {
      setTimeout(() => checkElement(times - 1), 500);
    }
  }

  // ========================
  // 启动
  // ========================
  checkElement();
})();
