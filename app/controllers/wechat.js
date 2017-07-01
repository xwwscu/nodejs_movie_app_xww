'use strict'

var wechat = require('../../wechat/g')
var reply = require('../../wx/reply')
var wx = require('../../wx/index')

exports.hear = function *(next) {
  this.middle = wechat(wx.wechatOptions.wechat, reply.reply)

  console.log(this.method)

  yield this.middle(next)
}
