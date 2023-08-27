const mongoose = require('mongoose');

// const User = require('./userModels');
// const validator = require('validator');

const messageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: [true, 'Message can not be empty'],
      trim: true,
    },
    location: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

messageSchema.index({ location: '2dsphere' });

// reviewSchema.pre(/^find/, async function (next) {
//   // this.populate({
//   //   path: 'tour',
//   //   select: 'name',
//   // }).populate({
//   //   path: 'user',
//   //   select: 'name photo',
//   // });

//   this.populate({
//     path: 'user',
//     select: 'name photo',
//   });
//   next();
// });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
