// ==UserScript==
// @name         Always Interactive Designer
// @namespace    http://tampermonkey.net/
// @version      2025-09-30
// @description  try to take over the world!
// @author       You
// @match        https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==
// 更新 localStorage 中的 isInteractive
function alwaysInteractive() {
    const urlParams = new URLSearchParams(window.location.search);
    const applicationId = urlParams.get('applicationId');
    if (!applicationId) {
        return;
    }
    // 获取现有的 isInteractive 数据
    let existingData = localStorage.getItem('isInteractive');
    let appList = existingData ? JSON.parse(existingData) : [];

    // 检查 applicationId 是否已经存在
    const exists = appList.some(item => item[0] === applicationId);

    // 如果不存在，添加新的 applicationId
    if (!exists) {
        appList.push([applicationId, true]);
        localStorage.setItem('isInteractive', JSON.stringify(appList));
    }
}
(function() {
    'use strict';
    alwaysInteractive();
    // Your code here...
})();