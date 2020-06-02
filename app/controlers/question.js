const Question = require('../models/question')

class QuestionCtl {
    async find(ctx) {
        const { per_page = 10 } = ctx.query
        const page = Math.max(1, ctx.query.page * 1) - 1
        const perPage = Math.max(1, per_page * 1)
        const q = new RegExp(ctx.query.q)
        ctx.body = await Question
            .find({ $or: [{ title: q }, { description: q }] })
            .limit(perPage).skip(page * perPage)
    }
    async findById(ctx) {
        const { fields = '' } = ctx.query
        const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('')
        const question = await Question.findById(ctx.params.id).select(selectFields).populate('+ questioner + topics')
        ctx.body = question
    }
    async create(ctx) {
        ctx.verifyParams({
            title: { type: 'string', required: true },
            description: { type: 'string', required: false },
            img: { type: 'string', required: false },
        })
        const question = await new Question({ ...ctx.request.body, questioner: ctx.state.user._id }).save()
        ctx.body = question
    }
    async update(ctx) {
        ctx.verifyParams({
            title: { type: 'string', required: true },
            description: { type: 'string', required: false },
            img: { type: 'string', required: false },
        })
        await ctx.state.question.update(ctx.request.body)
        const question = await Question.findById(ctx.params.id)
        ctx.body = question
    }
    //判断问题是否存在
    async checkQuestionExist(ctx, next) {
        const question = await Question.findById(ctx.params.id).select('+questioner')
        if (!question) { ctx.throw(404, '问题不存在') }
        ctx.state.question = question
        await next()
    }

    async delete(ctx) {
        const question = await Question.findByIdAndRemove(ctx.params.id)
        if (question) {
            ctx.status = 204
        } else {
            ctx.throw(404, '问题不存在')
        }
    }

    // 鉴权
    async checkQuestioner(ctx, next) {
        const { question } = ctx.state
        if (question.questioner.toString() !== ctx.state.user._id) {
            ctx.throw(403, '没有权限')
        }
        await next()
    }
}

module.exports = new QuestionCtl()