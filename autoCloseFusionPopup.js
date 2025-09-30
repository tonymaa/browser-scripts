// ==UserScript==
// @name         关闭弹窗（纯原生版）
// @namespace    http://tampermonkey.net/
// @version      2025-04-25
// @description  try to take over the world!
// @author       You
// @match        https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const needToCloseDialogsTitle = [
        'Open Draft Revision?', 'Save Draft'
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

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function startDetect() {
        while (true) {
            await sleep(500);
            // 查找所有的弹窗元素
            const dialogs = document.querySelectorAll('.next-dialog');
            if (dialogs.length > 0) {
                dialogs.forEach(dialog => {
                    const titleElement = dialog.querySelector('.next-message-title');
                    if (titleElement) {
                        const title = titleElement.innerText.trim();
                        if (needToCloseDialogsTitle.includes(title)) {
                            showToast('success', `已关闭弹窗【${title}】`);
                            const closeButton = dialog.querySelector('.next-dialog-close');
                            if (closeButton) {
                                closeButton.click();
                            }
                        }
                    }
                });
            }
        }
    }

    startDetect();
})();
