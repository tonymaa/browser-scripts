/**
 * Quick Login - 用户配置
 *
 * 修改此文件来添加/删除账号。
 * 修改后到 chrome://extensions 页面点击扩展的"刷新"按钮即可生效。
 */
const QUICK_LOGIN_CONFIG = {
  defaultPassword: 'Password$1234',

  /**
   * 按主机名 (window.location.host) 匹配用户列表。
   * 键名即为主机名，例如 '192.168.2.27'。
   */
  hosts: {
    '192.168.2.27': [
      {
        name: 'Wangyu',
        accountId: 'wangyu',
        vault: 'TmsoAxYNvhcgc3i/AKjzoGJWlWZ+8Rn8A9Tn/TCiVNjuRifPeA8G3dEyus6O8NFcKgcnuk8SPdK3R+A2pjmIj5GZtGFfMQDiZCOiwAV023sVCMqWQFfyD6+OCq3lGRuNkNitm+mdhrQaLqiq9Tm7jN+sBZUPpBclTPBpOFRnD0u/UU6nlONFyoTmeiNs97qk8JTxhvVljVSNSEJvRsN9tm4g2j62b4kGZh/pwPXsZvSvWa5QTNFUW7iYNLSnUfit1LXEjLyw1d4On21s6fEazkcX9bfJJ6u/L6VoMklMFo8oF0roUSXioBdH17BaNuNCS8VDMl3LSjNBaj4HzfGHaQ==',
      },
    ],
    '192.168.2.11': [
      {
        name: '管理员',
        accountId: 'admin',
        password: 'Password$1234',
        vault: '0RevY+UTEYTGSHG0vAK/3hjwxmhKes6MFLBZ6LfTDFAptD5gdRdXzGDnZYL7+z5gyB5IYdXln5yUjqoI/KZAFUTgvez0g23uTQGnl0X3aqInG1F9UcckD9Ho2X7igQj6/ZYkPDvq6HtJCT112cG+4xqsJeIHtN10aMM4pOFCCQNlpqvvXCFYDPFMqr98Y61ztNXlDuhdhFEe4/lUsx4UaYpn2nu/qm+Pl5gDiP4vgYkkL65s3uKjFyZMNhat9YJN3aFCmGgaHt6/WhZ/wlufnwL0f9gVWQCvYkIrlXNuzusmrTxLtkSycZVBtpbfYRE71fk6bBpzzyy6UzC+kKiaeg==',
      },
    ],
    '192.168.2.21': [
      {
        name: '管理员',
        accountId: 'admin',
        password: 'Password$1234',
        vault: 'thqVlPGmO8z53Ret3JjKgFcx6o4YfGqoCjSxT51O74bZFgzCtNPeW+VLamA/y9T3mmvFDkOmZHCi038RTp0Wp4ENVMQspd1pX2yZ6/idFx2QgpSyXQ2wMMwXr4i0+ixvOykNSZ/0eWidCRgMWzt6LZiOZFxKsNHk0zY+mw25EqxkkP4JmoklfSlJDr7p4Uqq6WB/Y7cDOtYVZsVh/dI21Gr90B6mgj54Xm2sU7hN0227U9ywLZ9HrDt3z3KxaTAWSbebFVkFU3x9XafLZlHL4ZSfZO7QufgaCkL8AAnKQDcbJUqyiW5vUAdUc4M4MeAXTQwv6lL/14U8Cf1sWMQC1A==',
      },
      {
        name: '管理员(MGF1_256)',
        accountId: 'admin',
        vault: 'PAJ4dBcpkeAI7ezBt+zgSfDkEsfoqKEPQFchq87nnH8kpxQi3OmpQwzE+jyIF+yC4Y9M4TNMG8SyD8rNurMe52PKds3VhSgwF0L82ApJ4EMxNBLHG02yzFo1K8sfGJYYPLF5zD70bWBFV+XQClk9A0Ftpgy0EiCnUfPS491PJN7Lz2pW2Ufy/LHN6wSl5f0Lt0DEYqwI9gHePdhP6csToA1A3ezAaP6YMmVG1IqqEp2y3dGVvEqQZfuzPtSCY22GLLeTw0BxMvaWa6sSxK1ariPbvPd5HO86ODzvK4A1sdTh8SBzUIggwdG3sMPWl+O5vjoXpUBOmXfUbPhP5h71zw==',
      },
    ],
    '192.168.0.110': [
      {
        name: 'Zhiming(MGF1_256)',
        accountId: 'zhiming',
        password: 'Password$1234',
        vault: 'MaTvLJGPrZnSzNfhfQpDULHWvdwDTOLD7zg7MZTz9qB8h69twySAIcOrkUwy4ozW58vsYXFSA3eEaOH1deOfUh1zwJHqNMq2409uwGd1aS0zQd7AGMHvwva8mAiZavFN/aF8rV6lcpsjP5aCSKEKIIs4HwVcCK0qBNe8Lb6BZ9PCJEZ7IYbCQNWK9rEgg8jlIVIiThIoi6wUVRMwSrjtnFT+eFqybf8pRUMsdMEo9iLcncyktQv4Umm3HtR+gFikMCTXA/hMSu3wQI/P6a+zx77XGu+n9olwJucpCfrrS1m2AwfoEutRWVVcmD8eZbY7K598Kw0SRzWN0KBYG6H4cg==',
      },
      {
        name: '管理员',
        accountId: 'admin',
        password: 'Password$1234',
        vault: 'thqVlPGmO8z53Ret3JjKgFcx6o4YfGqoCjSxT51O74bZFgzCtNPeW+VLamA/y9T3mmvFDkOmZHCi038RTp0Wp4ENVMQspd1pX2yZ6/idFx2QgpSyXQ2wMMwXr4i0+ixvOykNSZ/0eWidCRgMWzt6LZiOZFxKsNHk0zY+mw25EqxkkP4JmoklfSlJDr7p4Uqq6WB/Y7cDOtYVZsVh/dI21Gr90B6mgj54Xm2sU7hN0227U9ywLZ9HrDt3z3KxaTAWSbebFVkFU3x9XafLZlHL4ZSfZO7QufgaCkL8AAnKQDcbJUqyiW5vUAdUc4M4MeAXTQwv6lL/14U8Cf1sWMQC1A==',
      },
    ],
  },

  /**
   * 未匹配任何主机名时使用的默认用户列表。
   */
  defaultUsers: [
    {
      name: '管理员',
      accountId: 'admin',
      password: 'Password$1234',
      vault: 'ii6yw5jQAviHVP2xxL7g1h0uQjSfjM94iNIQmD1QnhX74BmeNTJ67CKjCq1jMNwfMlK4+prYXsCLnhx5UedUH0PaBZ0fnlXC54J2dgDfmuvNyv1qHZaBHnsrgDAiS4GVNkwncour2lTAwNn4f9vdWfnjvzc8TUcNWHihcEtiEUj7YSyijfNjvjv7A+usH2e65f+zFCDypkIGuo+wwz0+WFKpSSMJGsncwaKIucG1YI+3olR7lvGPVVb2BjfLcLT1eXV5EEP9H/VJxfzUELQSKFZZ0LsuVWwfzvZIZcmkx9oxn0eV5+9zbhma8ItYLxM0j6rU3zYlOc1Q1twmZgGpPQ==',
    },
    {
      name: 'Zhiming(MGF1_256)',
      accountId: 'zhiming',
      password: 'Password$1234',
      vault: 'MaTvLJGPrZnSzNfhfQpDULHWvdwDTOLD7zg7MZTz9qB8h69twySAIcOrkUwy4ozW58vsYXFSA3eEaOH1deOfUh1zwJHqNMq2409uwGd1aS0zQd7AGMHvwva8mAiZavFN/aF8rV6lcpsjP5aCSKEKIIs4HwVcCK0qBNe8Lb6BZ9PCJEZ7IYbCQNWK9rEgg8jlIVIiThIoi6wUVRMwSrjtnFT+eFqybf8pRUMsdMEo9iLcncyktQv4Umm3HtR+gFikMCTXA/hMSu3wQI/P6a+zx77XGu+n9olwJucpCfrrS1m2AwfoEutRWVVcmD8eZbY7K598Kw0SRzWN0KBYG6H4cg==',
    },
    {
      name: 'Zhenyu',
      accountId: 'zhenyu',
      password: 'Password$1234',
      vault: 'MaTvLJGPrZnSzNfhfQpDULHWvdwDTOLD7zg7MZTz9qB8h69twySAIcOrkUwy4ozW58vsYXFSA3eEaOH1deOfUh1zwJHqNMq2409uwGd1aS0zQd7AGMHvwva8mAiZavFN/aF8rV6lcpsjP5aCSKEKIIs4HwVcCK0qBNe8Lb6BZ9PCJEZ7IYbCQNWK9rEgg8jlIVIiThIoi6wUVRMwSrjtnFT+eFqybf8pRUMsdMEo9iLcncyktQv4Umm3HtR+gFikMCTXA/hMSu3wQI/P6a+zx77XGu+n9olwJucpCfrrS1m2AwfoEutRWVVcmD8eZbY7K598Kw0SRzWN0KBYG6H4cg==',
    },
    {
      name: 'Rongrong',
      accountId: 'rongrong',
      password: 'Password$1234',
      vault: 'Xt6DQb116oMideFa+z87Upv5jhAMR6ChrnCkAG7JDHYMfSu/DGvSHJz6tIvrj7eV0jE3ksGBJPnvp/OtxDbtMuWPJXZHFTCk0jx1s2xF6KDeg8Sm+gFM0tAgUN8/xlHHzDYKHOPdLWNb8fC/bb2lReNUs4mJxzfC9CfHWer9d7AnK71+tpUFgZASHxttIC3NS65D4CGMtPTjaIA+Qu5rQvWEfO1OcwIZpE/1eprlk/XNeMsp1wOs0NqwcuJD/hKvRsGqYK0FzZU/AR1552tP1B6IVYBhh5mGpuyFppvu6M2ckTkdIMsGwB8r3oawCVHTRtFEDm58xiVoSIa5f4fXcQ==',
    },
    {
      name: 'Yichun',
      accountId: 'yichun',
      password: 'Password$1234',
      vault: 'bn0GDFYvl0hTelADq5RfetjPqxJqffYdHJLXqJv4ZtIiTtpu/9Y44b0soLslkJF5yHVVzpSo6DFYd6JywHXUllvFtaRiCnAc/xyXD1GZfgXC8vKNrbPCclhdAsfyO2y71F2snl9LyNSAOY6wlwcoTNcIPDhYmeS2ZD3ZkeQib6+jfEyIzNJ7X6AMpE+rSEfZPRag3GxgCRH8KuWQaXjrbwwv+x+bw0ft3AYTIfO2QuKSNBcKdHx04gvCj53ecBWdBHMv+IpQuqzN2V0o3AXtwaFcSwYQGUvOwh2MlTzvVmVyZlFP05I6OAU+rcV7KIWCya6S2BQk9C+Hib65R7nTyw==',
    },
    {
      name: '管理员',
      accountId: 'admin',
      password: 'Password$1234',
      vault: 'ii6yw5jQAviHVP2xxL7g1h0uQjSfjM94iNIQmD1QnhX74BmeNTJ67CKjCq1jMNwfMlK4+prYXsCLnhx5UedUH0PaBZ0fnlXC54J2dgDfmuvNyv1qHZaBHnsrgDAiS4GVNkwncour2lTAwNn4f9vdWfnjvzc8TUcNWHihcEtiEUj7YSyijfNjvjv7A+usH2e65f+zFCDypkIGuo+wwz0+WFKpSSMJGsncwaKIucG1YI+3olR7lvGPVVb2BjfLcLT1eXV5EEP9H/VJxfzUELQSKFZZ0LsuVWwfzvZIZcmkx9oxn0eV5+9zbhma8ItYLxM0j6rU3zYlOc1Q1twmZgGpPQ==',
    },
  ],
};
