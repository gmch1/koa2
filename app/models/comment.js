const mongoose = require('mongoose')
const { Schema, model } = mongoose

const commentSchema = new Schema({
    __v: { type: String, select: false },
    content: { type: String, required: true },
    commentator: { type: Schema.Types.ObjectId, ref: 'User', required: true, select: false },
    questionId: { type: String, required: true },
    voteCount: { type: Number, required: true, default: 0 },
    answerId: { type: String, required: true },
    rootCommentId: { type: String },
    replyTo: { type: Schema.Types.ObjectId, ref: 'User' },

}, { timestamps: true })

module.exports = model('Comment', commentSchema)