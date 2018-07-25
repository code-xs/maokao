/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'https://r5lkfvll.qcloud.la';
var qcloud = require('./vendor/wafer2-client-sdk/index');
var config = require('./config');

var tunnel = {
  tunnelServer:{
   tunnelObj:null,
  },

  createTunnel:function(){
    if (this.tunnelServer.tunnelObj == null){
      var that = this;
      var tunnel = new qcloud.Tunnel('https://199447.qcloud.la/tunnel');
      tunnel.on('connect', () => that.tunnelConnect());
      tunnel.on('close', () => that.tunnelDisconnect());
      tunnel.on('reconnecting', () => that.tunnelReconnecting());
      tunnel.on('reconnect', () => that.tunnelReconnect());
      tunnel.on('error', error => that.tunnelError());
      this.tunnelServer.tunnelObj = tunnel;
    }
    console.log(this.tunnelServer.tunnelObj);
    return this.tunnelServer.tunnelObj;
  },

  closeTunnel: function () {
    if (this.tunnelServer.tunnelObj != null){
      this.tunnelServer.tunnelObj.close();
      this.tunnelServer.tunnelObj = null;
    }
  },

  sendMessage:function(type, who){
    tunnel.emit('speak', { word: type, who: { nickName: who } });
  },

  tunnelConnect:function(){
    console.log('WebSocket 信道已连接')
  },
  tunnelDisconnect: function () {
    console.log('WebSocket 信道已断开')
  },
  tunnelReconnecting: function () {
    console.log('WebSocket 信道正在重连...')
  },
  tunnelReconnect:function(){
    console.log('WebSocket 信道重连成功')
  },
  tunnelError: function () {
    console.error('信道发生错误：', error)
  },
};

module.exports = tunnel;