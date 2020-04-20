const Router = require('koa-router')
const router = new Router()
const { index, upload } = require('../controlers/home')

router.get('/', index)
router.post('/upload', upload)

module.exports = router