const mongoose = require('mongoose')
const { Schema, model } = mongoose

const userSchema = new Schema({
    __v: { type: Number, select: false },
    name: { type: String, required: true },
    password: { type: String, required: true, select: false },
    gender: { type: String, enum: ['male', 'female', 'none'], default: 'none', required: true },
    avatar_url: { type: String },
    headline: { type: String },
    locations: { type: [{ type: String }], select: false },
    business: { type: String, select: false },
    employments: {
        type: [{
            company: { type: String },
            job: { type: String }
        }], select: false
    },
    educations: {
        type: [{
            school: { type: String },
            major: { type: String },
            dipolam: { type: Number, enum: [1, 2, 3, 4, 5] },
            entrance_year: { type: Number },
            graduation_year: { type: Number }

        }], select: false
    },
    following: {
        type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        select: false
    }
})

module.exports = model('User', userSchema)