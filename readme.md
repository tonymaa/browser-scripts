## 1. 安装
### greasyfork安装
* 自动加载css：https://greasyfork.org/zh-CN/scripts/533808-%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BDcss-js
* 快速登录：https://greasyfork.org/zh-CN/scripts/533913-quick-login-plugin-%E5%BF%AB%E9%80%9F%E7%99%BB%E5%BD%95%E6%8F%92%E4%BB%B6

## 2. 配置
### quickLogin.js 额外配置
进入油猴主页，编辑
![img.png](readme.assets/img4.png)
修改USERS变量，添加账号
![img_1.png](readme.assets/img_1.png)

### autoLoadDynamicCss.js 额外配置
配置nginx
```nginx
       location /site-resources {
            alias E:/site-resources/;

            # 启用 CORS 头部
            add_header Access-Control-Allow-Origin *;
            add_header Access-Control-Allow-Methods 'GET, OPTIONS';
            add_header Access-Control-Allow-Headers *;

            # 如果你还想支持 OPTIONS 预检请求（某些 fetch 会触发）
            if ($request_method = OPTIONS ) {
                add_header Access-Control-Max-Age 1728000;
                add_header Content-Type 'text/plain charset=UTF-8';
                add_header Content-Length 0;
                return 204;
            }
        }
```

## 3. UI
### quickLogin.js
![img.png](readme.assets/img.png)


### autoLoadDynamicCss.js
![img.png](readme.assets/img2.png)

![img_1.png](readme.assets/img3.png)

