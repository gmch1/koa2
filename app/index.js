const Koa = require('koa')
const Router = require('koa-router')
const app = new Koa()
const routing = require('./routes')
const error = require('koa-json-error')
const bodyparser = require('koa-bodyparser')
const parameter = require('koa-parameter')
const mongoose = require('mongoose')
const { connectionStr } = require('./config')

mongoose.connect(connectionStr, { useNewUrlParser: true, useUnifiedTopology: true }, () => { console.log('mongodb is connecting') })
mongoose.connection.on('error', console.error)

app.use(error({
    postFormat: (e, { stack, ...rest }) => process.env.NODE_ENV === 'production' ? rest : { ...rest, stack }
}))
app.use(bodyparser())
app.use(parameter(app))
routing(app)

app.listen(3000, (err) => {
    console.log('runnig')
})
