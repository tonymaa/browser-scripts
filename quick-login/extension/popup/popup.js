/* Quick Login - Popup Logic */
(() => {
  'use strict';

  // ========================
  // State
  // ========================
  const STORAGE_KEY = 'quickLoginConfig';
  let config = null;
  let selectedHost = '__default__';
  let editingIndex = -1; // -1 = adding new, >= 0 = editing

  // ========================
  // DOM refs
  // ========================
  const $ = (id) => document.getElementById(id);
  const hostSelect = $('host-select');
  const userList = $('user-list');
  const formOverlay = $('form-overlay');
  const formTitle = $('form-title');
  const formError = $('form-error');
  const inputDefaultPw = $('input-default-pw');

  // ========================
  // Storage helpers
  // ========================
  function loadFromStorage() {
    return new Promise((resolve) => {
      chrome.storage.local.get(STORAGE_KEY, (result) => {
        if (chrome.runtime.lastError) {
          console.error('load error:', chrome.runtime.lastError);
          resolve(null);
        } else {
          resolve(result[STORAGE_KEY] || null);
        }
      });
    });
  }

  function saveToStorage(cfg) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [STORAGE_KEY]: cfg }, () => {
        if (chrome.runtime.lastError) {
          console.error('save error:', chrome.runtime.lastError);
        }
        resolve();
      });
    });
  }

  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  // ========================
  // Config accessors
  // ========================
  function getUsers() {
    if (selectedHost === '__default__') return config.defaultUsers;
    return config.hosts[selectedHost] || [];
  }

  function setUsers(users) {
    if (selectedHost === '__default__') {
      config.defaultUsers = users;
    } else {
      config.hosts[selectedHost] = users;
    }
  }

  // ========================
  // Render
  // ========================
  function render() {
    renderHostSelect();
    renderUserList();
    inputDefaultPw.value = config.defaultPassword || '';
  }

  function renderHostSelect() {
    hostSelect.innerHTML = '';

    const defaultOpt = document.createElement('option');
    defaultOpt.value = '__default__';
    defaultOpt.textContent = '📋 默认用户（所有站点）';
    defaultOpt.selected = selectedHost === '__default__';
    hostSelect.appendChild(defaultOpt);

    Object.keys(config.hosts).forEach((host) => {
      const opt = document.createElement('option');
      opt.value = host;
      opt.textContent = '🖥 ' + host;
      opt.selected = selectedHost === host;
      hostSelect.appendChild(opt);
    });
  }

  function renderUserList() {
    const users = getUsers();

    if (!users || users.length === 0) {
      userList.innerHTML = '<div class="empty-state">暂无用户，点击下方添加</div>';
      return;
    }

    userList.innerHTML = users
      .map(
        (u, i) => `
        <div class="user-card" data-index="${i}">
          <div class="user-info">
            <div class="user-name">${esc(u.name)}</div>
            <div class="user-account">${esc(u.accountId)}${u.domainCode ? ' · ' + esc(u.domainCode) : ''}</div>
            ${
              u.vault
                ? `<div class="user-vault-preview" title="${esc(u.vault)}">vault: ${esc(u.vault.substring(0, 30))}…</div>`
                : u.password
                  ? `<div class="user-vault-preview">password: ${esc(u.password.substring(0, 20))}…</div>`
                  : '<div class="user-vault-preview" style="color:#ff4d4f">⚠ 无密码也无 Vault</div>'
            }
          </div>
          <div class="user-actions">
            <button class="btn-icon btn-login" data-index="${i}" title="用此用户登录当前标签页">🔑</button>
            <button class="btn-icon btn-edit" data-index="${i}" title="编辑">✏️</button>
            <button class="btn-icon danger btn-delete" data-index="${i}" title="删除">🗑</button>
          </div>
        </div>`,
      )
      .join('');

    userList.querySelectorAll('.btn-login').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        loginUser(+btn.dataset.index);
      });
    });
    userList.querySelectorAll('.btn-edit').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        showForm(+btn.dataset.index);
      });
    });
    userList.querySelectorAll('.btn-delete').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteUser(+btn.dataset.index);
      });
    });
  }

  // ========================
  // Trigger login in current tab
  // ========================
  function loginUser(index) {
    const users = getUsers();
    const user = users[index];
    if (!user) return;
    if (!user.password && !user.vault) {
      alert('此用户既无密码也无 Vault，无法登录');
      return;
    }

    // Write a one-shot signal to storage. The content script on the active tab
    // watches for this and runs loginWithUser, then clears the signal.
    const payload = {
      host: selectedHost,
      user: {
        name: user.name,
        accountId: user.accountId,
        password: user.password,
        vault: user.vault,
        domainCode: user.domainCode,
      },
      ts: Date.now(),
    };

    chrome.storage.local.set({ quickLoginPendingLogin: payload }, () => {
      if (chrome.runtime.lastError) {
        alert('触发登录失败：' + chrome.runtime.lastError.message);
      } else {
        window.close();
      }
    });
  }

  function esc(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ========================
  // User CRUD
  // ========================
  function showForm(index) {
    editingIndex = index;
    const users = getUsers();
    const user =
      index >= 0 && users[index]
        ? users[index]
        : { name: '', accountId: '', password: '', vault: '', domainCode: '' };

    formTitle.textContent = index >= 0 ? '编辑用户' : '添加用户';
    $('input-name').value = user.name || '';
    $('input-accountId').value = user.accountId || '';
    $('input-password').value = user.password || '';
    $('input-vault').value = user.vault || '';
    $('input-domainCode').value = user.domainCode || '';
    formError.style.display = 'none';
    formOverlay.style.display = 'block';
  }

  function hideForm() {
    formOverlay.style.display = 'none';
    editingIndex = -1;
  }

  function saveUser() {
    const name = $('input-name').value.trim();
    const accountId = $('input-accountId').value.trim();
    const password = $('input-password').value.trim();
    const vault = $('input-vault').value.trim();
    const domainCode = $('input-domainCode').value.trim();

    if (!name || !accountId) {
      formError.textContent = '名称和账号 ID 为必填项';
      formError.style.display = 'block';
      return;
    }

    if (!password && !vault) {
      formError.textContent = '密码和 Vault 至少填写一项';
      formError.style.display = 'block';
      return;
    }

    const user = { name, accountId, vault };
    if (password) user.password = password;
    if (domainCode) user.domainCode = domainCode;

    const users = [...getUsers()];
    if (editingIndex >= 0) {
      users[editingIndex] = user;
    } else {
      users.push(user);
    }
    setUsers(users);
    hideForm();
    persist();
    render();
  }

  function deleteUser(index) {
    const users = getUsers();
    const user = users[index];
    if (!confirm(`确定删除用户「${user.name}」(${user.accountId})？`)) return;
    setUsers([...users.slice(0, index), ...users.slice(index + 1)]);
    persist();
    render();
  }

  // ========================
  // Host management
  // ========================
  function addHost() {
    const host = prompt('请输入主机名（如 192.168.1.1 或 example.com）：');
    if (!host || !host.trim()) return;
    const trimmed = host.trim();
    if (config.hosts[trimmed]) {
      alert('该主机已存在');
      return;
    }
    config.hosts[trimmed] = [];
    selectedHost = trimmed;
    persist();
    render();
  }

  function deleteHost() {
    if (selectedHost === '__default__') {
      alert('无法删除默认配置');
      return;
    }
    if (!confirm(`确定删除主机「${selectedHost}」及其所有用户配置？`)) return;
    delete config.hosts[selectedHost];
    selectedHost = '__default__';
    persist();
    render();
  }

  // ========================
  // Import / Export / Reset
  // ========================
  function exportConfig() {
    const json = JSON.stringify(config, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quick-login-config.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function importConfig() {
    $('file-import').click();
  }

  function handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const imported = JSON.parse(evt.target.result);
        if (typeof imported !== 'object' || !imported.defaultUsers) {
          throw new Error('格式不正确');
        }
        config = imported;
        selectedHost = '__default__';
        persist();
        render();
      } catch (err) {
        alert('导入失败：' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  function resetConfig() {
    if (!confirm('确定重置为默认配置？当前所有修改将丢失。')) return;
    config = deepClone(QUICK_LOGIN_CONFIG);
    selectedHost = '__default__';
    persist();
    render();
  }

  function saveDefaultPassword() {
    config.defaultPassword = inputDefaultPw.value.trim() || 'Password$1234';
    persist();
  }

  function persist() {
    saveToStorage(config);
  }

  // ========================
  // Init
  // ========================
  async function init() {
    try {
      const stored = await loadFromStorage();
      config = stored || deepClone(QUICK_LOGIN_CONFIG);

      // 默认选中当前标签页对应的主机（若有），否则用"默认用户"
      const currentHost = await getCurrentTabHost();
      if (currentHost && config.hosts[currentHost]) {
        selectedHost = currentHost;
      }

      render();
    } catch (e) {
      console.error('init failed:', e);
      alert('初始化失败：' + e.message);
    }
  }

  // 读取当前活动标签页的 host
  function getCurrentTabHost() {
    return new Promise((resolve) => {
      try {
        if (!chrome.tabs || !chrome.tabs.query) return resolve(null);
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (chrome.runtime.lastError || !tabs || !tabs[0]) return resolve(null);
          try {
            const url = new URL(tabs[0].url || '');
            resolve(url.host || null);
          } catch {
            resolve(null);
          }
        });
      } catch {
        resolve(null);
      }
    });
  }

  // ========================
  // Event bindings
  // ========================
  hostSelect.addEventListener('change', () => {
    selectedHost = hostSelect.value;
    renderUserList();
  });

  $('btn-add-host').addEventListener('click', addHost);
  $('btn-del-host').addEventListener('click', deleteHost);
  $('btn-add-user').addEventListener('click', () => showForm(-1));
  $('btn-save-user').addEventListener('click', saveUser);
  $('btn-cancel-user').addEventListener('click', hideForm);
  $('btn-import').addEventListener('click', importConfig);
  $('btn-export').addEventListener('click', exportConfig);
  $('btn-reset').addEventListener('click', resetConfig);
  $('file-import').addEventListener('change', handleImport);
  inputDefaultPw.addEventListener('change', saveDefaultPassword);

  formOverlay.addEventListener('click', (e) => {
    if (e.target === formOverlay) hideForm();
  });

  init();
})();
