'use strict'

var path = require('path')
var util = require('../libs/util')
var Wechat = require('../wechat/wechat')
var wechat_file = path.join(__dirname, '../config/wechat.txt')
var wechat_ticket_file = path.join(__dirname, '../config/wechat_ticket.txt')

var config = {
  wechat: {
    // test
    appID: 'wxe9e2ec8d631c277d',
    appSecret: 'ebacae6574a8aa091684c937edf6f48d',
    token: 'imoocisareallyamzingplacetolearn',
    getAccessToken: function() {
      return util.readFileAsync(wechat_file)
    },
    saveAccessToken: function(data) {
      data = JSON.stringify(data)

      return util.writeFileAsync(wechat_file, data)
    },
    getTicket: function() {
      return util.readFileAsync(wechat_ticket_file)
    },
    saveTicket: function(data) {
      data = JSON.stringify(data)

      return util.writeFileAsync(wechat_ticket_file, data)
    }
  }
}

exports.wechatOptions = config


exports.getWechat = function() {
  var wechatApi = new Wechat(config.wechat)

  return wechatApi
}
