const Answer = require('../models/answer')

class AnswerCtr {
    async find(ctx) {
        const { per_page = 10 } = ctx.query
        const page = Math.max(1, ctx.query.page * 1) - 1
        const perPage = Math.max(1, per_page * 1)
        const q = new RegExp(ctx.query.q)
        ctx.body = await Answer
            .find({ content: q, questionId: ctx.params.questionId })
            .limit(perPage).skip(page * perPage)
    }
    async findById(ctx) {
        const { fields = '' } = ctx.query
        const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('')
        const answer = await Answer.findById(ctx.params.id).select(selectFields).populate('+ answerer ')
        ctx.body = answer
    }
    async create(ctx) {
        ctx.verifyParams({
            content: { type: 'string', required: true },
        })
        const answerer = ctx.state.user
        const { questionId } = ctx.params
        const answer = await new Answer({ ...ctx.request.body, answerer, questionId }).save()
        ctx.body = answer
    }
    async update(ctx) {
        ctx.verifyParams({
            content: { type: 'string', required: true },
        })
        await ctx.state.answer.update(ctx.request.body)
        const answer = await Answer.findById(ctx.params.id)
        ctx.body = answer
    }
    //判断答案是否存在
    async checkAnswerExist(ctx, next) {
        const answer = await Answer.findById(ctx.params.id).select('+answerer')
        if (!answer) { ctx.throw(404, '答案不存在') }
        //只有路由中包含questionid时,才检查这一项,此处中间件在user中用于点赞逻辑
        if (ctx.params.questionId && ctx.params.questionId !== answer.questionId) {
            ctx.throw(404, '该问题下无此答案')
        }
        ctx.state.answer = answer
        await next()
    }

    async delete(ctx) {
        const answer = await Answer.findByIdAndRemove(ctx.params.id)
        if (answer) {
            ctx.status = 204
        } else {
            ctx.throw(404, '问题不存在')
        }
    }

    // 鉴权
    async checkAnswerer(ctx, next) {
        const { answer } = ctx.state
        if (answer.answerer.toString() !== ctx.state.user._id) {
            ctx.throw(403, '没有权限')
        }
        await next()
    }
}

module.exports = new AnswerCtr()