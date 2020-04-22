const Router = require('koa-router')
const router = new Router({ prefix: '/users' })
const jwt = require('koa-jwt')
const { find, findById, create, update, delete: del, login, checkOwner,
    listFollowing, follow, unFollow, follower, checkUserExist,
    followTopic, unFollowTopic, listFollowingTopics, listQuestion,
    likeAnswer, listLikingAnswers, unlikeAnswer,
    dislikeAnswer, listDislikingAnswers, undislikeAnswer,
    collectAnswer, unCollectAnswer, listCollectingAnswers
} = require('../controlers/user')

const { checkTopicExist } = require('../controlers/topic')
const { checkAnswerExist } = require('../controlers/answer')

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

router.put('/likingAnswer/:id', auth, checkAnswerExist, likeAnswer, undislikeAnswer)
router.delete('/likingAnswer/:id', auth, checkAnswerExist, unlikeAnswer)
router.get('/likingAnswer/:id', listLikingAnswers)

router.put('/dislikingAnswer/:id', auth, checkAnswerExist, dislikeAnswer, unlikeAnswer)
router.delete('/dislikingAnswer/:id', auth, checkAnswerExist, undislikeAnswer)
router.get('/dislikingAnswer/:id', listDislikingAnswers)

router.put('/collectingAnswer/:id', auth, checkAnswerExist, collectAnswer)
router.delete('/collectingAnswer/:id', auth, checkAnswerExist, unCollectAnswer)
router.get('/collectingAnswer/:id', listCollectingAnswers)

module.exports = router     