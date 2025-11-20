// ==UserScript==
// @name         Bilibili Music Mode
// @namespace    http://tampermonkey.net/
// @version      2025-11-20
// @description  Bilibili Music Mode / 切换web版bilibili为音乐播放模式
// @author       You
// @match        https://www.bilibili.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 读取模式，默认是 videoMode
    let playerMode = localStorage.getItem('playerMode') || 'videoMode';

    // 样式定义
    const musicStyle = `
.video-tag-container,
.bpx-player-sending-bar,
.strip-ad-inner,
.up-panel-container,
.slide-gg,
.fixed-sidenav-storage,
.video-info-meta,
.recommend-list-v1,
.ad-report,
.danmaku-box,
.recommend-list-container,
.video-desc-container,
.left-entry{
    display: none !important;
}
.right-entry-item--upload{
    display: none !important;
}
.video-toolbar-container{
    opacity: 0 !important;
}
.bpx-player-video-wrap video{
    display: none !important;
}

.player-wrap{
    height: 100px !important;
}
.bpx-player-primary-area{
    height: 100px !important;
}
.bpx-player-top-left-follow{
    display: none !important;
}
.video-info-title h1{
    font-size: 14px !important;
}
.vip-wrap, .right-entry--message, .header-avatar-wrap{
    display: none !important;
}
.bpx-player-video-area{
    background-color: white !important;
}
#commentapp{
    display: none !important;
}
    `;

    const videoStyle = `
/* 这里可以添加 videoMode 的样式，如果需要的话 */
    `;

    // 移除旧样式
    const removeStyles = () => {
        const existingStyles = document.querySelectorAll('style');
        existingStyles.forEach(style => {
            if (style.innerText.includes('video-tag-container')) {
                style.remove();
            }
        });
    };

    const applyStyles = (mode) => {
        removeStyles();
        const style = document.createElement('style');
        style.innerText = mode === 'musicMode' ? musicStyle : videoStyle;
        document.head.appendChild(style);
    };

    // 应用初始样式
    applyStyles(playerMode);

    // 创建悬浮按钮
    const button = document.createElement('button');
    button.innerText = playerMode === 'musicMode' ? '切换到视频模式' : '切换到音乐模式';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.zIndex = '9999';
    button.style.padding = '10px';
    button.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    document.body.appendChild(button);

    // 切换模式的函数
    const toggleMode = () => {
        playerMode = playerMode === 'musicMode' ? 'videoMode' : 'musicMode';
        localStorage.setItem('playerMode', playerMode);
        applyStyles(playerMode);
        button.innerText = playerMode === 'musicMode' ? '切换到视频模式' : '切换到音乐模式';
    };

    // 按钮点击事件
    button.addEventListener('click', toggleMode);

    // 快捷键切换
    document.addEventListener('keydown', (event) => {
        if (event.altKey && event.key === 'z') {
            toggleMode();
        }
    });
})();
