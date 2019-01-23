const path = require('path');
const isDev = think.env === 'development';
const wechat = require('think-wechat');
module.exports = [
  {
    handle: 'meta', // 中间件处理函数
    options: { // 当前中间件需要的配置
      logRequest: isDev,
      sendResponseTime: isDev
    }
  },
  {
    handle: 'resource',
    enable: isDev, // 是否开启当前中间件
    options: {
      root: path.join(think.ROOT_PATH, 'www'),
      publicPath: /^\/(static|upload|favicon\.ico)/
    }
  },
  {
    handle: 'trace',
    enable: !think.isCli,
    options: {
      debug: isDev
    }
  },
  {
    handle: wechat,
    match: '/home/wechat',
    options: async() => {
      await think.timeout(1000);
      return {
        token: think.config('setup.wx_Token'),
        appid: think.config('setup.wx_AppID'),
        encodingAESKey: '',
        checkSignature: true // 可选，默认为true。由于微信公众平台接口调试工具在明文模式下不发送签名，所以如要使用该测试工具，请将其设置为false
      };
    }
  },
  {
    handle: 'payload',
    options: {
      uploadDir: path.join(think.ROOT_PATH, 'runtime/data')
    }
  },
  {
    handle: 'router',
    options: {
      optimizeHomepageRouter: false
    }
  },
  'cwlogic',
  // 'logic',
  'controller'
];
