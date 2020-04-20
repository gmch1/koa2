const Router = require('koa-router')
const router = new Router({ prefix: '/topics' })
const jwt = require('koa-jwt')
const { create, update, find, findById, listTopicFollower, checkTopicExist } = require('../controlers/topic')
const { secret } = require('../config')
const auth = jwt({ secret })

router.get('/', find)
router.get('/:id', checkTopicExist, findById)
router.post('/', auth, create)
router.patch('/:id', auth, checkTopicExist, update)
router.get('/:id/followers', checkTopicExist, listTopicFollower)


module.exports = router     