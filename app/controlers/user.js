const jsonwebtoken = require('jsonwebtoken')
const User = require('../models/user')
const { secret } = require('../config')

class UserCtrl {

    async find(ctx) {
        const { per_page = 10 } = ctx.query
        const page = Math.max(1, ctx.query.page * 1) - 1
        const perPage = Math.max(1, per_page * 1)
        ctx.body = await User.find({
            name: new RegExp(ctx.query.q)
        }).limit(perPage).skip(page * perPage)
    }

    async findById(ctx) {
        const { fields = '' } = ctx.query
        // 查询两个字段之间要加一个   " +"
        const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('')
        const populateStr = fields.split(';').filter(f => f).map(f => {
            if (f === 'educations') {
                return 'employments.job,employments.company'
            }
            if (f === 'educations') {
                return 'educations.major,educations.school'
            }
            return f
        })
        const user = await User.findById(ctx.params.id).select(selectFields)
            .populate(populateStr)
        if (!user) {
            ctx.throw(404, '用户不存在')
        } else {
            ctx.body = user
        }
    }

    async create(ctx) {
        ctx.verifyParams({
            name: { type: 'string', required: true },
            password: { type: 'string', required: true }
        })
        const { name } = ctx.request.body
        const repestedUser = await User.findOne({ name })
        if (repestedUser) {
            ctx.throw(409, '存在重复用户名')
        }
        const user = await new User(ctx.request.body).save()
        ctx.body = user
    }

    async update(ctx) {
        ctx.verifyParams({
            name: { type: 'string', required: false },
            password: { type: 'string', required: false },
            avatar_url: { type: 'string', required: false },
            gender: { type: 'string', required: false },
            headline: { type: 'string', required: false },
            locations: { type: 'array', itemType: 'string', required: false },
            business: { type: 'string', required: false },
            employments: { type: 'array', itemType: 'object', required: false },
            educations: { type: 'array', itemType: 'object', required: false },

        })
        let user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body)
        if (!user) {
            ctx.throw(404)
        }
        const { _id } = ctx.state.user
        user = await User.findById({ _id })
        ctx.body = user
    }

    async delete(ctx) {
        const user = await User.findByIdAndDelete(ctx.params.id)
        if (user) {
            ctx.status = 204
        } else {
            ctx.throw(404, '用户不存在')
        }
    }

    async checkOwner(ctx, next) {
        if (ctx.params.id !== ctx.state.user._id) {
            ctx.throw(403, '没有权限')
        }
        await next()
    }

    async login(ctx) {
        ctx.verifyParams({
            name: { type: 'string', required: false },
            password: { type: 'string', required: false }
        })
        const user = await User.findOne(ctx.request.body)
        if (!user) {
            ctx.throw(401, '用户名或密码错误')
        }
        const { _id, name } = user
        const token = jsonwebtoken.sign({ _id, name }, secret, { expiresIn: '1d' })
        ctx.body = { token }
    }

    async listFollowing(ctx) {
        const user = await User.findById(ctx.params.id).select('+following').populate('following')
        if (!user) {
            ctx.throw(404, '用户不存在')
        }
        ctx.body = user.following
    }

    async follow(ctx) {
        const me = await User.findById(ctx.state.user._id).select('+following')
        if (!(me.following.map(id => id.toString()).includes(ctx.params.id))) {
            me.following.push(ctx.params.id)
            me.save()
        }
        ctx.status = 204
    }

    async checkUserExist(ctx, next) {
        const user = await User.findById(ctx.params.id)
        if (!user) { ctx.throw(404, '用户不存在') }
        await next()
    }

    async follower(ctx) {
        const user = await User.find({ following: ctx.params.id })
        ctx.body = user
    }

    async unFollow(ctx) {
        const me = await User.findById(ctx.state.user._id).select('+following')
        const index = me.following.map(id => id.toString()).indexOf(ctx.params.id)
        if (index > -1) {
            me.following.splice(index, 1)
            me.save()
        }
        ctx.status = 204
    }
    //判断话题是否存在,存在则返回用户关注的话题
    async listFollowingTopics(ctx) {
        const user = await User.findById(ctx.params.id).select('+followingTopics').populate('followingTopics')
        if (!user) {
            ctx.throw(404, '用户不存在')
        }
        ctx.body = user.followingTopics
    }
    //关注话题
    async followTopic(ctx) {
        const me = await User.findById(ctx.state.user._id).select('+followingTopics')
        if (!(me.followingTopics.map(id => id.toString()).includes(ctx.params.id))) {
            me.followingTopics.push(ctx.params.id)
            me.save()
        }
        ctx.status = 204
    }
    //取消关注话题
    async unFollowTopic(ctx) {
        const me = await User.findById(ctx.state.user._id).select('+followingTopics')
        const index = me.followingTopics.map(id => id.toString()).indexOf(ctx.params.id)
        if (index > -1) {
            me.followingTopics.splice(index, 1)
            me.save()
        }
        ctx.status = 204
    }
}

module.exports = new UserCtrl()
