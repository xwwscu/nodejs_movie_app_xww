'use strict'

var Koa = require('koa')
var fs = require('fs')
var mongoose = require('mongoose')

var dbUrl = 'mongodb://localhost/imooc'

mongoose.connect(dbUrl)

// models loading
var models_path = __dirname + '/app/models'
var walk = function(path) {
  fs
    .readdirSync(path)
    .forEach(function(file) {
      var newPath = path + '/' + file
      var stat = fs.statSync(newPath)

      if (stat.isFile()) {
        if (/(.*)\.(js|coffee)/.test(file)) {
          require(newPath)
        }
      }
      else if (stat.isDirectory()) {
        walk(newPath)
      }
    })
}
walk(models_path)

var menu = require('./wx/menu')
var wx = require('./wx/index')
var wechatApi = wx.getWechat()

wechatApi.deleteMenu().then(function() {
  return wechatApi.createMenu(menu)
})
.then(function(msg) {
  console.log(msg)
})

var app = new Koa()
var Router = require('koa-router')
var session = require('koa-session')
var bodyParser = require('koa-bodyparser')
var router = new Router()
var User = mongoose.model('User')
var views = require('koa-views')
var moment = require('moment')

app.use(views(__dirname + '/app/views', {
  extension: 'jade',
  locals: {
    moment: moment
  }
}))

app.keys = ['imooc']
app.use(session(app))
app.use(bodyParser())

app.use(function *(next) {
  var user = this.session.user

  if (user && user._id) {
    this.session.user = yield User.findOne({_id: user._id}).exec()
    this.state.user = this.session.user
  }
  else {
    this.state.user = null
  }

  yield next
})

require('./config/routes')(router)

app
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(1234)
console.log('Listening: 1234')

