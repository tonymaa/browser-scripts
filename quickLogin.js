// ==UserScript==
// @name         Quick login plugin / 快速登录插件 (Pure JS)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  纯原生JS版快速登录插件
// @author       Tony Ma
// @match        *://*/*
// @grant        none
// @license MIT
// ==/UserScript==


(async function () {
    const DEFAULT_PASSWORD = 'Password$1234'
    // shortcut (ctrl + enter) or (alt + enter) could quickly log in USERS[0]
    // 快捷键(ctrl + enter) 或 (alt + enter) 可以快速登录USERS[0]
    let USERS = []
    switch (window.location.host) {
        case 'can specify host here': {
            USERS = [
                { name: "name", accountId: "accountId", vault: "encryped password", /*domainCode: 'optional, default to <designer>'*/ },
            ];
            break;
        }
        case '192.168.2.27': {
            USERS = [
                { name: "Wangyu", accountId: "wangyu", vault: "TmsoAxYNvhcgc3i/AKjzoGJWlWZ+8Rn8A9Tn/TCiVNjuRifPeA8G3dEyus6O8NFcKgcnuk8SPdK3R+A2pjmIj5GZtGFfMQDiZCOiwAV023sVCMqWQFfyD6+OCq3lGRuNkNitm+mdhrQaLqiq9Tm7jN+sBZUPpBclTPBpOFRnD0u/UU6nlONFyoTmeiNs97qk8JTxhvVljVSNSEJvRsN9tm4g2j62b4kGZh/pwPXsZvSvWa5QTNFUW7iYNLSnUfit1LXEjLyw1d4On21s6fEazkcX9bfJJ6u/L6VoMklMFo8oF0roUSXioBdH17BaNuNCS8VDMl3LSjNBaj4HzfGHaQ==", /*domainCode: 'optional, default to <designer>'*/ },
            ];
            break;
        }
        case '192.168.2.11': {
            USERS = [
                { name: "管理员", accountId: "admin", password: DEFAULT_PASSWORD, vault: "0RevY+UTEYTGSHG0vAK/3hjwxmhKes6MFLBZ6LfTDFAptD5gdRdXzGDnZYL7+z5gyB5IYdXln5yUjqoI/KZAFUTgvez0g23uTQGnl0X3aqInG1F9UcckD9Ho2X7igQj6/ZYkPDvq6HtJCT112cG+4xqsJeIHtN10aMM4pOFCCQNlpqvvXCFYDPFMqr98Y61ztNXlDuhdhFEe4/lUsx4UaYpn2nu/qm+Pl5gDiP4vgYkkL65s3uKjFyZMNhat9YJN3aFCmGgaHt6/WhZ/wlufnwL0f9gVWQCvYkIrlXNuzusmrTxLtkSycZVBtpbfYRE71fk6bBpzzyy6UzC+kKiaeg==", /*domainCode: 'optional, default to <designer>'*/ },
            ];
            break;
        }
        case '192.168.2.21': {
            USERS = [
                { name: "管理员", accountId: "admin", password: DEFAULT_PASSWORD, vault: "thqVlPGmO8z53Ret3JjKgFcx6o4YfGqoCjSxT51O74bZFgzCtNPeW+VLamA/y9T3mmvFDkOmZHCi038RTp0Wp4ENVMQspd1pX2yZ6/idFx2QgpSyXQ2wMMwXr4i0+ixvOykNSZ/0eWidCRgMWzt6LZiOZFxKsNHk0zY+mw25EqxkkP4JmoklfSlJDr7p4Uqq6WB/Y7cDOtYVZsVh/dI21Gr90B6mgj54Xm2sU7hN0227U9ywLZ9HrDt3z3KxaTAWSbebFVkFU3x9XafLZlHL4ZSfZO7QufgaCkL8AAnKQDcbJUqyiW5vUAdUc4M4MeAXTQwv6lL/14U8Cf1sWMQC1A==" },
                // MGF1-sha256
                { name: "管理员", accountId: "admin", vault: "PAJ4dBcpkeAI7ezBt+zgSfDkEsfoqKEPQFchq87nnH8kpxQi3OmpQwzE+jyIF+yC4Y9M4TNMG8SyD8rNurMe52PKds3VhSgwF0L82ApJ4EMxNBLHG02yzFo1K8sfGJYYPLF5zD70bWBFV+XQClk9A0Ftpgy0EiCnUfPS491PJN7Lz2pW2Ufy/LHN6wSl5f0Lt0DEYqwI9gHePdhP6csToA1A3ezAaP6YMmVG1IqqEp2y3dGVvEqQZfuzPtSCY22GLLeTw0BxMvaWa6sSxK1ariPbvPd5HO86ODzvK4A1sdTh8SBzUIggwdG3sMPWl+O5vjoXpUBOmXfUbPhP5h71zw==" },
            ];
            break;
        }
        default: USERS = [
            // { name: "管理员", accountId: "admin", vault: "thqVlPGmO8z53Ret3JjKgFcx6o4YfGqoCjSxT51O74bZFgzCtNPeW+VLamA/y9T3mmvFDkOmZHCi038RTp0Wp4ENVMQspd1pX2yZ6/idFx2QgpSyXQ2wMMwXr4i0+ixvOykNSZ/0eWidCRgMWzt6LZiOZFxKsNHk0zY+mw25EqxkkP4JmoklfSlJDr7p4Uqq6WB/Y7cDOtYVZsVh/dI21Gr90B6mgj54Xm2sU7hN0227U9ywLZ9HrDt3z3KxaTAWSbebFVkFU3x9XafLZlHL4ZSfZO7QufgaCkL8AAnKQDcbJUqyiW5vUAdUc4M4MeAXTQwv6lL/14U8Cf1sWMQC1A==" },
            { name: "Zhiming(MGF1_256)", accountId: "zhiming", password: DEFAULT_PASSWORD, vault: "MaTvLJGPrZnSzNfhfQpDULHWvdwDTOLD7zg7MZTz9qB8h69twySAIcOrkUwy4ozW58vsYXFSA3eEaOH1deOfUh1zwJHqNMq2409uwGd1aS0zQd7AGMHvwva8mAiZavFN/aF8rV6lcpsjP5aCSKEKIIs4HwVcCK0qBNe8Lb6BZ9PCJEZ7IYbCQNWK9rEgg8jlIVIiThIoi6wUVRMwSrjtnFT+eFqybf8pRUMsdMEo9iLcncyktQv4Umm3HtR+gFikMCTXA/hMSu3wQI/P6a+zx77XGu+n9olwJucpCfrrS1m2AwfoEutRWVVcmD8eZbY7K598Kw0SRzWN0KBYG6H4cg==" },
            { name: "管理员", accountId: "admin", password: DEFAULT_PASSWORD, vault: "ii6yw5jQAviHVP2xxL7g1h0uQjSfjM94iNIQmD1QnhX74BmeNTJ67CKjCq1jMNwfMlK4+prYXsCLnhx5UedUH0PaBZ0fnlXC54J2dgDfmuvNyv1qHZaBHnsrgDAiS4GVNkwncour2lTAwNn4f9vdWfnjvzc8TUcNWHihcEtiEUj7YSyijfNjvjv7A+usH2e65f+zFCDypkIGuo+wwz0+WFKpSSMJGsncwaKIucG1YI+3olR7lvGPVVb2BjfLcLT1eXV5EEP9H/VJxfzUELQSKFZZ0LsuVWwfzvZIZcmkx9oxn0eV5+9zbhma8ItYLxM0j6rU3zYlOc1Q1twmZgGpPQ==" },
            // { name: "Zhiming(PKCS1)", accountId: "zhiming", vault: "bn0GDFYvl0hTelADq5RfetjPqxJqffYdHJLXqJv4ZtIiTtpu/9Y44b0soLslkJF5yHVVzpSo6DFYd6JywHXUllvFtaRiCnAc/xyXD1GZfgXC8vKNrbPCclhdAsfyO2y71F2snl9LyNSAOY6wlwcoTNcIPDhYmeS2ZD3ZkeQib6+jfEyIzNJ7X6AMpE+rSEfZPRag3GxgCRH8KuWQaXjrbwwv+x+bw0ft3AYTIfO2QuKSNBcKdHx04gvCj53ecBWdBHMv+IpQuqzN2V0o3AXtwaFcSwYQGUvOwh2MlTzvVmVyZlFP05I6OAU+rcV7KIWCya6S2BQk9C+Hib65R7nTyw==" },
            // { name: "2.21 server MGF1-sha256管理员", accountId: "admin", vault: "PAJ4dBcpkeAI7ezBt+zgSfDkEsfoqKEPQFchq87nnH8kpxQi3OmpQwzE+jyIF+yC4Y9M4TNMG8SyD8rNurMe52PKds3VhSgwF0L82ApJ4EMxNBLHG02yzFo1K8sfGJYYPLF5zD70bWBFV+XQClk9A0Ftpgy0EiCnUfPS491PJN7Lz2pW2Ufy/LHN6wSl5f0Lt0DEYqwI9gHePdhP6csToA1A3ezAaP6YMmVG1IqqEp2y3dGVvEqQZfuzPtSCY22GLLeTw0BxMvaWa6sSxK1ariPbvPd5HO86ODzvK4A1sdTh8SBzUIggwdG3sMPWl+O5vjoXpUBOmXfUbPhP5h71zw==" },
            { name: "Zhenyu", accountId: "zhenyu", password: DEFAULT_PASSWORD, vault: "MaTvLJGPrZnSzNfhfQpDULHWvdwDTOLD7zg7MZTz9qB8h69twySAIcOrkUwy4ozW58vsYXFSA3eEaOH1deOfUh1zwJHqNMq2409uwGd1aS0zQd7AGMHvwva8mAiZavFN/aF8rV6lcpsjP5aCSKEKIIs4HwVcCK0qBNe8Lb6BZ9PCJEZ7IYbCQNWK9rEgg8jlIVIiThIoi6wUVRMwSrjtnFT+eFqybf8pRUMsdMEo9iLcncyktQv4Umm3HtR+gFikMCTXA/hMSu3wQI/P6a+zx77XGu+n9olwJucpCfrrS1m2AwfoEutRWVVcmD8eZbY7K598Kw0SRzWN0KBYG6H4cg==" },
            { name: "Rongrong", accountId: "rongrong", password: DEFAULT_PASSWORD, vault: "Xt6DQb116oMideFa+z87Upv5jhAMR6ChrnCkAG7JDHYMfSu/DGvSHJz6tIvrj7eV0jE3ksGBJPnvp/OtxDbtMuWPJXZHFTCk0jx1s2xF6KDeg8Sm+gFM0tAgUN8/xlHHzDYKHOPdLWNb8fC/bb2lReNUs4mJxzfC9CfHWer9d7AnK71+tpUFgZASHxttIC3NS65D4CGMtPTjaIA+Qu5rQvWEfO1OcwIZpE/1eprlk/XNeMsp1wOs0NqwcuJD/hKvRsGqYK0FzZU/AR1552tP1B6IVYBhh5mGpuyFppvu6M2ckTkdIMsGwB8r3oawCVHTRtFEDm58xiVoSIa5f4fXcQ==" },
            { name: "Yichun", accountId: "yichun", password: DEFAULT_PASSWORD, vault: "bn0GDFYvl0hTelADq5RfetjPqxJqffYdHJLXqJv4ZtIiTtpu/9Y44b0soLslkJF5yHVVzpSo6DFYd6JywHXUllvFtaRiCnAc/xyXD1GZfgXC8vKNrbPCclhdAsfyO2y71F2snl9LyNSAOY6wlwcoTNcIPDhYmeS2ZD3ZkeQib6+jfEyIzNJ7X6AMpE+rSEfZPRag3GxgCRH8KuWQaXjrbwwv+x+bw0ft3AYTIfO2QuKSNBcKdHx04gvCj53ecBWdBHMv+IpQuqzN2V0o3AXtwaFcSwYQGUvOwh2MlTzvVmVyZlFP05I6OAU+rcV7KIWCya6S2BQk9C+Hib65R7nTyw==" },
            { name: "管理员", accountId: "admin", password: DEFAULT_PASSWORD, vault: "ii6yw5jQAviHVP2xxL7g1h0uQjSfjM94iNIQmD1QnhX74BmeNTJ67CKjCq1jMNwfMlK4+prYXsCLnhx5UedUH0PaBZ0fnlXC54J2dgDfmuvNyv1qHZaBHnsrgDAiS4GVNkwncour2lTAwNn4f9vdWfnjvzc8TUcNWHihcEtiEUj7YSyijfNjvjv7A+usH2e65f+zFCDypkIGuo+wwz0+WFKpSSMJGsncwaKIucG1YI+3olR7lvGPVVb2BjfLcLT1eXV5EEP9H/VJxfzUELQSKFZZ0LsuVWwfzvZIZcmkx9oxn0eV5+9zbhma8ItYLxM0j6rU3zYlOc1Q1twmZgGpPQ==" },
            // 可添加更多用户
        ]
    }

    function showToast(type, text) {
        const colorMap = {
            success: '#52c41a',
            error: '#ff4d4f',
            loading: '#1890ff'
        };

        const toast = document.createElement('div');
        toast.textContent = text;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${colorMap[type] || '#333'};
            color: #fff;
            padding: 10px 20px;
            border-radius: 4px;
            font-size: 14px;
            z-index: 9999;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            opacity: 0;
            transition: opacity 0.3s;
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

    let publicKeyCache
    async function loadPublicKey() {
        if (publicKeyCache) return publicKeyCache
        return await fetch('/public/iam/api/v1/.wellKnown/publicKey')
            .then(async response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json()
                console.log('resp>>>', data)
                publicKeyCache = JSON.parse(data?.data)
                console.log('publicKeyCache', publicKeyCache)
                return JSON.parse(data?.data)
            }).catch(error => {
                console.error('Failed to fetch public key:', error);
            });
    }


    let siteConfig
    async function loadSiteConfig() {
        if(siteConfig) return siteConfig;
        await fetch('/config.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(config => {
                siteConfig = config
                return config;
            })
            .catch(error => {
                console.error('Failed to fetch config.json:', error);
                return siteConfig;
            });
    }

    async function getCsrfTokenPrefix() {
        const config = await loadSiteConfig();
        const defaultPrefix = 'agp-cookie-csrf';
        return config?.CSRF_TOKEN_PREFIX || defaultPrefix;
    }


    // 将 JWK 格式导入为 CryptoKey
    async function importPublicKey(jwk, padding = 'MGF1_SHA256') {
        const alg = {
            name: padding.startsWith('PKCS1') ? 'RSAES-PKCS1-v1_5' : 'RSA-OAEP',
            hash: padding.endsWith('SHA1') ? 'SHA-1' : 'SHA-256',
        };

        return await crypto.subtle.importKey(
            'jwk',
            jwk,
            alg,
            false, // 不可导出
            ['encrypt'],
        );
    }

// 加密函数
    async function encryptByPadding(encryptText, jwk, padding = 'MGF1_SHA256') {
        const key = await importPublicKey(jwk, padding);
        const enc = new TextEncoder().encode(encryptText);

        const algo =
            padding.startsWith('PKCS1')
                ? { name: 'RSAES-PKCS1-v1_5' }
                : { name: 'RSA-OAEP' };

        const encrypted = await crypto.subtle.encrypt(algo, key, enc);
        return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
    }

// 对外暴露主函数
    async function encrypt(encryptText, jwk) {
        const config = await loadSiteConfig()
        const padding = (config?.['RSA_ENCRYPTION_PADDING'] ?? 'MGF1_SHA256').toUpperCase();

        if (padding === 'MGF1' || padding === 'MGF1_SHA1') {
            return await encryptByPadding(encryptText, jwk, 'MGF1_SHA1');
        } else if (padding === 'PKCS1') {
            return await encryptByPadding(encryptText, jwk, 'PKCS1');
        } else {
            // 默认 MGF1 + SHA256
            return await encryptByPadding(encryptText, jwk, 'MGF1_SHA256');
        }
    }

    async function getCSRF() {
        const cookies = document.cookie.split('; ');
        const csrfKey = await getCsrfTokenPrefix()
        loadSiteConfig('csrfKey>>', csrfKey)
        for (const cookie of cookies) {
            const [key, value] = cookie.split('=');
            if (key === csrfKey) {
                return cookie.substring(key.length + 1, cookie.length);
            }
        }
        return '';
    }


    async function loginWithUser(user) {
        const hide = showToast('loading', '正在登录 ' + user.name);
        try {
            const pubKey = await loadPublicKey()
            let vault = user.vault
            if (pubKey && user.password) {
                vault = await encrypt(user.password, pubKey)
            }
            const res = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': await getCSRF() },
                body: JSON.stringify({
                    userAccountId: user.accountId,
                    vault,
                    userDomainCode: user.domainCode ?? 'designer'
                })
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

    // 快捷键支持
    document.addEventListener('keydown', function (e) {
        if ((e.ctrlKey || e.altKey) && e.key === 'Enter') {
            loginWithUser(USERS[0]);
        } else if (e.altKey && (e.key - 1) < USERS.length) {
            loginWithUser(USERS[e.key - 1]);
        } else if (e.altKey && (e.key.toLowerCase() === 'q')) {
            const wrapper = document.getElementById('quick-login-fab-wrapper');
            if (wrapper) {
                if (wrapper.style.display === 'none') {
                    wrapper.style.display = 'flex';
                    localStorage.setItem('login-fabVisible', 'true');
                } else {
                    wrapper.style.display = 'none';
                    localStorage.setItem('login-fabVisible', 'false');
                }
            }
        }
    });



    // 添加悬浮控制面板
    const ctrlDiv = document.createElement('div');
    ctrlDiv.id = 'quick-login-controller';
    ctrlDiv.innerHTML = `
<style>
/* 同你原来的悬浮按钮样式 */
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
    <svg style="transform: scale(0.7); opacity: 1" fill="#ecf9fd" t="1745546148895" class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M512 590.75c-142.5 0-258.75-116.25-258.75-258.75s116.25-262.5 258.75-262.5 258.75 116.25 258.75 258.75-116.25 262.5-258.75 262.5zM512 144.5c-101.25 0-183.75 82.5-183.75 183.75s82.5 183.75 183.75 183.75 183.75-82.5 183.75-183.75-82.5-183.75-183.75-183.75z"></path><path d="M170.75 950.75c-18.75 0-37.5-15-37.5-37.5 0-7.5 0-11.25 0-15 0-210 172.5-382.5 382.5-382.5 22.5 0 37.5 15 37.5 37.5s-15 37.5-37.5 37.5c-168.75 0-307.5 138.75-307.5 307.5v11.25c0 22.5-18.75 41.25-37.5 41.25v0z"></path><path d="M853.25 947v0c-22.5 0-37.5-15-37.5-37.5v-11.25c0-168.75-138.75-307.5-307.5-307.5-22.5 0-37.5-15-37.5-37.5s15-37.5 37.5-37.5c210 0 382.5 172.5 382.5 382.5 0 3.75 0 7.5 0 11.25 0 22.5-15 37.5-37.5 37.5z"></path></svg>
  </div>
  <div class="quick-login-fab-btns">
    ${USERS.map((u, i) => `<button class="quick-login-btn" data-index="${i}">Alt + ${i + 1}. 快速登录 ${u.name}</button>`).join('')}
  </div>
</div>
    `;
    document.body.appendChild(ctrlDiv);

    function saveFabPosition(left, top) {
        localStorage.setItem('login-fabPosition', JSON.stringify({ left, top }));
    }

    function loadFabPosition() {
        const pos = JSON.parse(localStorage.getItem('login-fabPosition'));
        if (pos && typeof pos.left === 'number' && typeof pos.top === 'number') {
            wrapper.style.left = `${pos.left}px`;
            wrapper.style.top = `${pos.top}px`;
        } else {
            wrapper.style.left = `0px`;
            wrapper.style.top = `50%`;
        }


        // 加载显示/隐藏状态
        const visible = localStorage.getItem('login-fabVisible') ?? 'false';
        if (visible === 'false') {
            wrapper.style.display = 'none';
        } else {
            wrapper.style.display = 'flex';
        }
    }

    const wrapper = document.getElementById('quick-login-fab-wrapper');
    const fab = document.getElementById('quick-login-fab');
    let isDragging = false, offsetX = 0, offsetY = 0;

    loadFabPosition();

    fab.addEventListener('mousedown', e => {
        isDragging = true;
        offsetX = e.clientX - wrapper.offsetLeft;
        offsetY = e.clientY - wrapper.offsetTop;
        fab.style.cursor = 'grabbing';
    });
    document.addEventListener('mousemove', e => {
        if (isDragging) {
            const halfWidth = wrapper.offsetWidth / 2;
            const halfHeight = wrapper.offsetHeight / 2;

            let newLeft = e.clientX - offsetX;
            let newTop = e.clientY - offsetY;

            newLeft = Math.max(-halfWidth, Math.min(newLeft, window.innerWidth - halfWidth));
            newTop = Math.max(-halfHeight, Math.min(newTop, window.innerHeight - halfHeight));

            wrapper.style.left = `${newLeft}px`;
            wrapper.style.top = `${newTop}px`;
            saveFabPosition(newLeft, newTop);
        }
    });
    document.addEventListener('mouseup', () => {
        isDragging = false;
        fab.style.cursor = 'grab';
    });

    document.querySelectorAll('.quick-login-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            const idx = +e.target.getAttribute('data-index');
            loginWithUser(USERS[idx]);
        });
    });

    // 插入 Quick Login 按钮
    function createQuickLoginButton() {
        const control = document.querySelector('.next-icestark-form .next-icestark-form-item:last-child');
        const btn = document.createElement('button');
        btn.id = 'fillFormBtn';
        btn.className = 'next-icestark-btn next-icestark-large next-icestark-btn-primary';
        btn.style.cssText = `
            width: 100%;
            margin-top: 10px;
            background: rgb(82, 144, 237);
            border-radius: 8.9px;
            height: 45px;
            box-shadow: rgba(0,0,0,0.12) 0px 4.44748px 6.67122px -1.11187px, rgba(0,0,0,0.07) 0px 2.22374px 4.44748px -1.11187px;
        `;
        btn.innerText = `Quick Login - ${USERS[0].name}`;

        control.appendChild(btn);

        btn.addEventListener('click', () => loginWithUser(USERS[0]));
    }

    function checkElement(times = 40) {
        if (times <= 0) return;
        const control = document.querySelector('.next-icestark-form .next-icestark-form-item:last-child');
        if (control) {
            createQuickLoginButton();
        } else {
            setTimeout(() => checkElement(times - 1), 500);
        }
    }

    checkElement();
})();
