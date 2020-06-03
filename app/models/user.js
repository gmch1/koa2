const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    __v: { type: Number, select: false },
    name: { type: String, required: true },
    password: { type: String, required: true, select: false },
    gender: {
      type: String,
      enum: ['male', 'female', 'none'],
      default: 'none',
      required: true,
    },
    avatar_url: { type: String },
    headline: { type: String },
    locations: { type: [{ type: Schema.Types.ObjectId, ref: 'Topic' }] },
    business: { type: Schema.Types.ObjectId, ref: 'Topic' },
    employments: {
      type: [
        {
          company: { type: Schema.Types.ObjectId, ref: 'Topic' },
          job: { type: Schema.Types.ObjectId, ref: 'Topic' },
        },
      ],
    },
    educations: {
      type: [
        {
          school: { type: Schema.Types.ObjectId, ref: 'Topic' },
          major: { type: Schema.Types.ObjectId, ref: 'Topic' },
          dipolam: { type: Number, enum: [1, 2, 3, 4, 5] },
          entrance_year: { type: Number },
          graduation_year: { type: Number },
        },
      ],
    },
    following: {
      type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    },
    followingTopics: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Topic' }],
    },
    likingAnswers: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
    },
    dislikingAnswers: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
    },
    collectingAnswers: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
    },
  },
  { timestamps: true }
);

module.exports = model('User', userSchema);
