// ==UserScript==
// @name         Quick login plugin / 快速登录插件
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include      *
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      https://cdn.bootcss.com/jquery/2.2.1/jquery.js
// @require      https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js
// @license MIT
// ==/UserScript==


(function () {
    const USERS = [
        { name: "Zhiming", accountId: "zhiming", vault: "bn0GDFYvl0hTelADq5RfetjPqxJqffYdHJLXqJv4ZtIiTtpu/9Y44b0soLslkJF5yHVVzpSo6DFYd6JywHXUllvFtaRiCnAc/xyXD1GZfgXC8vKNrbPCclhdAsfyO2y71F2snl9LyNSAOY6wlwcoTNcIPDhYmeS2ZD3ZkeQib6+jfEyIzNJ7X6AMpE+rSEfZPRag3GxgCRH8KuWQaXjrbwwv+x+bw0ft3AYTIfO2QuKSNBcKdHx04gvCj53ecBWdBHMv+IpQuqzN2V0o3AXtwaFcSwYQGUvOwh2MlTzvVmVyZlFP05I6OAU+rcV7KIWCya6S2BQk9C+Hib65R7nTyw==" },
        { name: "Alice", accountId: "alice", vault: "bn0GDFYvl0hTelADq5RfetjPqxJqffYdHJLXqJv4ZtIiTtpu/9Y44b0soLslkJF5yHVVzpSo6DFYd6JywHXUllvFtaRiCnAc/xyXD1GZfgXC8vKNrbPCclhdAsfyO2y71F2snl9LyNSAOY6wlwcoTNcIPDhYmeS2ZD3ZkeQib6+jfEyIzNJ7X6AMpE+rSEfZPRag3GxgCRH8KuWQaXjrbwwv+x+bw0ft3AYTIfO2QuKSNBcKdHx04gvCj53ecBWdBHMv+IpQuqzN2V0o3AXtwaFcSwYQGUvOwh2MlTzvVmVyZlFP05I6OAU+rcV7KIWCya6S2BQk9C+Hib65R7nTyw==" },
        // 可添加更多用户
    ];

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

    function loginWithUser(user) {
        const hide = showToast('loading', '正在登录' + user.name);
        axios.post("/login", {
            userAccountId: user.accountId,
            vault: user.vault,
            userDomainCode: user.domainCode ?? "designer"
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
    }

    // 快捷键支持 Ctrl + Enter 登录第一个用户
    document.addEventListener('keydown', function (e) {
        if (e.ctrlKey && e.key === 'Enter') {
            loginWithUser(USERS[0]);
        }
    });

    // 添加悬浮控制面板
    const ctrlDiv = document.createElement('div');
    ctrlDiv.id = 'css-controller';
    ctrlDiv.innerHTML = `
<style>
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
#css-fab-wrapper {
  position: fixed;
  top: 100px;
  left: 20px;
  z-index: 9999;
  display: flex;
  gap: 10px;
}
#css-fab {
  opacity: 0.75;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  cursor: grab;
  background: #136fb736;
  box-shadow: 0 0px 8px rgb(189 245 255 / 98%), inset 0 3px 1px rgb(98 193 245 / 54%) !important;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  font-size: 2em;
  color: #fff;
}
#css-fab-wrapper:hover .fab-btns {
  display: flex;
}
.fab-btns {
  display: none;
  flex-direction: column;
  gap: 6px;
  top: 0;
  left: 60px;
}
.fab-btns button {
  padding: 4px 8px;
  font-size: 12px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
}
</style>
<div id="css-fab-wrapper">
  <div id="css-fab">
    <svg style="transform: scale(0.7)" fill="#ecf9fd" t="1745546148895" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1647"><path d="M512 590.75c-142.5 0-258.75-116.25-258.75-258.75s116.25-262.5 258.75-262.5 258.75 116.25 258.75 258.75-116.25 262.5-258.75 262.5zM512 144.5c-101.25 0-183.75 82.5-183.75 183.75s82.5 183.75 183.75 183.75 183.75-82.5 183.75-183.75-82.5-183.75-183.75-183.75z" p-id="1648"></path><path d="M170.75 950.75c-18.75 0-37.5-15-37.5-37.5 0-7.5 0-11.25 0-15 0-210 172.5-382.5 382.5-382.5 22.5 0 37.5 15 37.5 37.5s-15 37.5-37.5 37.5c-168.75 0-307.5 138.75-307.5 307.5v11.25c0 22.5-18.75 41.25-37.5 41.25v0z" p-id="1649"></path><path d="M853.25 947v0c-22.5 0-37.5-15-37.5-37.5v-11.25c0-168.75-138.75-307.5-307.5-307.5-22.5 0-37.5-15-37.5-37.5s15-37.5 37.5-37.5c210 0 382.5 172.5 382.5 382.5 0 3.75 0 7.5 0 11.25 0 22.5-15 37.5-37.5 37.5z" p-id="1650"></path></svg>
  </div>
  <div class="fab-btns">
    ${USERS.map((u, i) => `<button class="quick-login-btn" data-index="${i}">快速登录-${u.name}</button>`).join('')}
  </div>
</div>`;
    document.body.appendChild(ctrlDiv);

    function saveFabPosition(left, top) {
        localStorage.setItem('login-fabPosition', JSON.stringify({ left, top }));
    }

    function loadFabPosition() {
        const pos = JSON.parse(localStorage.getItem('login-fabPosition'));
        if (pos && typeof pos.left === 'number' && typeof pos.top === 'number') {
            wrapper.style.left = `${pos.left}px`;
            wrapper.style.top = `${pos.top}px`;
        }
    }

    // 拖动逻辑
    const wrapper = document.getElementById('css-fab-wrapper');
    const fab = document.getElementById('css-fab');
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

            const maxLeft = window.innerWidth - halfWidth;
            const maxTop = window.innerHeight - halfHeight;

            let newLeft = e.clientX - offsetX;
            let newTop = e.clientY - offsetY;

            newLeft = Math.max(-halfWidth, Math.min(newLeft, maxLeft));
            newTop = Math.max(-halfHeight, Math.min(newTop, maxTop));

            wrapper.style.left = `${newLeft}px`;
            wrapper.style.top = `${newTop}px`;

            saveFabPosition(newLeft, newTop); // 保存位置
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        fab.style.cursor = 'grab';
    });

    // 按钮事件绑定
    document.querySelectorAll('.quick-login-btn').forEach(btn => {
        btn.addEventListener('click', e => {
            const idx = +e.target.getAttribute('data-index');
            loginWithUser(USERS[idx]);
        });
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
          Quick Login - ${USERS[0].name}
        </button>
      `);

        $control.append($btn);
        $("#fillFormBtn").on("click", () => loginWithUser(USERS[0]));
    }

    function checkElement(times = 40) {
        if (times <= 0) return
        if ($("div.next-icestark-form-item-control:last").length > 0) {
            createQuickLoginButton();
        } else {
            setTimeout(() => checkElement(times - 1), 500);
        }
    }

    checkElement();
})();
