const Router = require('koa-router')
const router = new Router({ prefix: '/users' })
const jwt = require('koa-jwt')
const { find, findById, create, update, delete: del, login, checkOwner,
    listFollowing, follow, unFollow, follower, checkUserExist,
    followTopic, unFollowTopic, listFollowingTopics, listQuestion
} = require('../controlers/user')
const { checkTopicExist } = require('../controlers/topic')
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
router.put('/follow/:id', auth, checkUserExist, follow)
router.delete('/unfollow/:id', auth, checkUserExist, unFollow)
router.put('/followTopics/:id', auth, checkTopicExist, followTopic)
router.delete('/unfollowTopics/:id', auth, checkTopicExist, unFollowTopic)
router.get('/followingTopics/:id', listFollowingTopics)
router.get('/:id/questions', listQuestion)



module.exports = router     