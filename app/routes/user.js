const Router = require('koa-router')
const router = new Router({ prefix: '/users' })
const { find, findById, create, update, delete:del } = require('../controlers/user')



router.get('/', find)
router.post('/', create)
router.delete('/:id', del)
router.put('/:id', update)
router.get('/:id', findById)

module.exports = router