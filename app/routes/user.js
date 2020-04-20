const Router = require('koa-router')
const router = new Router({ prefix: '/users' })
const jwt = require('koa-jwt')
const { find, findById, create, update, delete: del, login, checkOwner, listFollowing, follow, unFollow, follower } = require('../controlers/user')
const { secret } = require('../config')
const auth = jwt({ secret })

router.get('/', find)
router.post('/', create)
router.delete('/:id', auth, checkOwner, del)
router.patch('/:id', auth, checkOwner, update)
router.get('/:id', findById)
router.post('/login', login)
router.get('/:id/following', listFollowing)
router.get('/:id/follower', follower)
router.put('/follow/:id', auth, follow)
router.delete('/unfollow/:id', auth, unFollow)


module.exports = router     