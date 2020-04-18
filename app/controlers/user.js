const db = [{ name: 'zhangsan' }]
const User = require('../models/user')

class UserCtrl {
    async find(ctx) {
        ctx.body = await User.find()
    }
    async findById(ctx) {

        const user = await User.findById(ctx.params.id)
        if (!user) {
            ctx.throw(404, '用户不存在')
        } else {
            ctx.body = user
        }
    }
    async create(ctx) {
        ctx.verifyParams({
            name: { type: 'string', required: true },
            age: { type: 'number', required: false }
        })
        const user = await new User(ctx.request.body).save()
        ctx.body = user
    }
    async update(ctx) {
        const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body)
        if (!user) {
            ctx.throw(404)
        }

        ctx.body = user

    }
    async delete(ctx) {
        const user = await User.findByIdAndDelete(ctx.params.id)
        if (user) {
            ctx.status = 204
        } else {
            ctx.throw(404,'用户不存在')
        }
    }
}

module.exports = new UserCtrl()
