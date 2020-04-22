const mongoose = require('mongoose')
const { Schema, model } = mongoose

const questionSchema = new Schema({
    __v: { type: String, select: false },
    title: { type: String, required: true },
    description: { type: String },
    questioner: { type: Schema.Types.ObjectId, ref: 'User', required: true, select: false },
    topics: { type: Schema.Types.ObjectId, ref: 'Topic', select: false }
}, { timestamps: true })

module.exports = model('Question', questionSchema)