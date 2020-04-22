const Comment = require('../models/comment')

class CommentStr {
    async find(ctx) {
        const { per_page = 10 } = ctx.query
        const page = Math.max(1, ctx.query.page * 1) - 1
        const perPage = Math.max(1, per_page * 1)
        const q = new RegExp(ctx.query.q)
        const { questionId, answerId } = ctx.params
        // 如果存在rootcommentId则说明是二级评论
        const { rootCommentId } = ctx.query

        ctx.body = await Comment
            .find({ content: q, questionId, answerId, rootCommentId })
            .limit(perPage).skip(page * perPage)
            .populate('commentator replyTo')
    }
    async findById(ctx) {
        const { fields = '' } = ctx.query
        const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('')
        const comment = await Comment.findById(ctx.params.id).select(selectFields).populate('+ commentator ')
        ctx.body = comment
    }
    async create(ctx) {
        ctx.verifyParams({
            content: { type: 'string', required: true },
            rootCommentId: { type: 'string', required: false },
            replyTo: { type: 'string', required: false },
        })
        const commentator = ctx.state.user._id
        const { questionId, answerId } = ctx.params
        const comment = await new Comment({ ...ctx.request.body, commentator, questionId, answerId }).save()
        ctx.body = comment
    }
    async update(ctx) {
        ctx.verifyParams({
            content: { type: 'string', required: true },
        })
        const { content } = request.body
        await ctx.state.comment.update({ content })
        const comment = await Comment.findById(ctx.params.id)
        ctx.body = comment
    }
    //判断答案是否存在
    async checkCommentExist(ctx, next) {
        const comment = await Comment.findById(ctx.params.id).select('+commentator')
        if (!comment) { ctx.throw(404, '评论不存在') }
        //只有路由中包含questionid时,才检查这一项,此处中间件在user中用于点赞逻辑
        if (ctx.params.questionId && ctx.params.questionId !== comment.questionId) {
            ctx.throw(404, '该问题下无此评论')
        }
        if (ctx.params.answerId && ctx.params.answerId !== comment.answerId) {
            ctx.throw(404, '该回答下无此评论')
        }
        ctx.state.comment = comment
        await next()
    }

    async delete(ctx) {
        const comment = await Comment.findByIdAndRemove(ctx.params.id)
        if (comment) {
            ctx.status = 204
        } else {
            ctx.throw(404, '问题不存在')
        }
    }

    // 鉴权
    async checkCommentator(ctx, next) {
        const { comment } = ctx.state
        if (comment.commentator.toString() !== ctx.state.user._id) {
            ctx.throw(403, '没有权限')
        }
        await next()
    }
}

module.exports = new CommentStr()