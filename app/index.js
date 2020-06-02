const Koa = require('koa')
const Router = require('koa-router')
const app = new Koa()
const routing = require('./routes')
const error = require('koa-json-error')
const koabody = require('koa-body')
const path = require('path')
const koaStatci = require('koa-static')
const parameter = require('koa-parameter')
const mongoose = require('mongoose')
const { connectionStr } = require('./config')

mongoose.connect(connectionStr, { useNewUrlParser: true, useUnifiedTopology: true }, () => { console.log('mongodb is connecting') })
mongoose.connection.on('error', console.error)
mongoose.set('useFindAndModify', false)


app.use(koaStatci(path.join(__dirname, '/public')))
app.use(error({
    postFormat: (e, { stack, ...rest }) => process.env.NODE_ENV === 'production' ? rest : { ...rest, stack }
}))
app.use(koabody({
    multipart: true,
    formidable: {
        uploadDir: path.join(__dirname, '/public/uploads'),
        keepExtensions: true
    }
}))
app.use(parameter(app))
routing(app)

app.listen(3003, (err) => {
    console.log('runnig')
})
