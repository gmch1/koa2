const Router = require('koa-router')
const router = new Router({ prefix: '/questions' })
const jwt = require('koa-jwt')
const { find, findById, delete: del, create, checkQuestioner, checkQuestionExist, update } = require('../controlers/question')
const { secret } = require('../config')
const auth = jwt({ secret })

router.get('/', find)
router.get('/:id', checkQuestionExist, findById)
router.post('/', auth, create)
router.patch('/:id', auth, checkQuestionExist, checkQuestioner, update)
router.delete('/:id', auth, checkQuestionExist, checkQuestioner, del)


module.exports = router     