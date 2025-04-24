// ==UserScript==
// @name         lowcodeLoginScript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://ecq.lowcode.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      https://cdn.bootcss.com/jquery/2.2.1/jquery.js
// @require      https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js
// ==/UserScript==


(function () {
    'use strict';
    // 1. 动态加载 Antd 的 JS 和 CSS
    function loadAntd(callback) {
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/antd/5.23.3/antd.min.css';
        document.head.appendChild(cssLink);

        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/antd/5.23.3/antd.min.js';
        script.onload = callback;
        document.body.appendChild(script);
    }

    // 2. 主逻辑：需要 antd 载入完毕后再运行

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

        return remove; // loading 类型的可以手动关闭
    }

    const handleLogin = () => {
        const hide = showToast('loading', '正在登录...');
        axios.post("https://ecq.lowcode.com/login", {
            userAccountId: "zhiming",
            vault: "bn0GDFYvl0hTelADq5RfetjPqxJqffYdHJLXqJv4ZtIiTtpu/9Y44b0soLslkJF5yHVVzpSo6DFYd6JywHXUllvFtaRiCnAc/xyXD1GZfgXC8vKNrbPCclhdAsfyO2y71F2snl9LyNSAOY6wlwcoTNcIPDhYmeS2ZD3ZkeQib6+jfEyIzNJ7X6AMpE+rSEfZPRag3GxgCRH8KuWQaXjrbwwv+x+bw0ft3AYTIfO2QuKSNBcKdHx04gvCj53ecBWdBHMv+IpQuqzN2V0o3AXtwaFcSwYQGUvOwh2MlTzvVmVyZlFP05I6OAU+rcV7KIWCya6S2BQk9C+Hib65R7nTyw==",
            userDomainCode: "designer"
        }).then(() => {
            hide();
            showToast('success', '登录成功');
            localStorage.setItem('isLogin', 'true');
            if (location.hash === '#/login') {
                window.location.href = '/#/console';
            }
        }).catch((e) => {
            hide();
            showToast('error', '登录失败：' + (e?.response?.data?.message || '请稍后再试'));
        });
    };


    // 快捷键：Ctrl + Enter 触发登录
    document.addEventListener("keydown", (e) => {
        if (e.ctrlKey && e.key === "Enter") {
            handleLogin();
        }
    });

    // 插入按钮
    function createQuickLoginButton() {
        const $control = $("div.next-icestark-form-item-control:last");
        if ($control.length === 0) {
            setTimeout(checkElement, 500);
            return;
        }

        const $btn = $(`
        <button id="fillFormBtn"
          class="next-icestark-btn next-icestark-large next-icestark-btn-primary"
          style="width: 100%; margin-top: 10px; background: rgb(82, 144, 237);
                 border-radius: 8.9px; height: 45px;
                 box-shadow: rgba(0, 0, 0, 0.12) 0px 4.44748px 6.67122px -1.11187px,
                             rgba(0, 0, 0, 0.07) 0px 2.22374px 4.44748px -1.11187px;">
          Quick Login
        </button>
      `);

        $control.append($btn);
        $("#fillFormBtn").on("click", handleLogin);
    }

    function checkElement() {
        if ($("div.next-icestark-form-item-control:last").length > 0) {
            createQuickLoginButton();
        } else {
            setTimeout(checkElement, 500);
        }
    }

    checkElement();
})();
