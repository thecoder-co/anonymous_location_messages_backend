const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Message = require('../models/messageModel');
const factory = require('./handlerFactory');
const APIFeatures = require('../utils/apiFeatures');

// /tours-within/:distance/center/:latlng
// /tours-within/233/center/34.111745,-118.113491
exports.getMessagesWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng } = req.params;
  const [lat, lng] = latlng.split(',');

  const radius = distance / 6378.1;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitutr and longitude in the format lat,lng.',
        400,
      ),
    );
  }

  const features = new APIFeatures(
    Message.find({
      location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
    }),
    req.query,
  )
    .filter()
    .sort()
    .paginate();

  const messages = await features.query;

  res.status(200).json({
    status: 'success',
    results: messages.length,
    data: {
      data: messages,
    },
  });
});

// /message-bounds/southwest/:southwest/notheast/:northeast
exports.getMessagesBounds = catchAsync(async (req, res, next) => {
  const { southwest, northeast } = req.params;

  const southwestBound = southwest.split(',');
  const northeastBound = northeast.split(',');

  if (!southwestBound || !northeastBound) {
    next(
      new AppError(
        'Please provide southwest and northeast in the format lat,lng.',
        400,
      ),
    );
  }

  const features = new APIFeatures(
    Message.find({
      location: { $geoWithin: { $box: [southwestBound, northeastBound] } },
    }),
    req.query,
  )
    .filter()
    .sort()
    .paginate();

  const messages = await features.query;

  res.status(200).json({
    status: 'success',
    results: messages.length,
    data: {
      data: messages,
    },
  });
});

exports.sendMessage = catchAsync(async (req, res, next) => {
  const { latlng } = req.query;

  const [lat, lng] = latlng.split(',');

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitutr and longitude in the format lat,lng.',
        400,
      ),
    );
  }

  const messages = await Message.create({
    ...req.body,
    location: { coordinates: [lng, lat] },
  });

  res.status(200).json({
    status: 'success',

    data: {
      data: messages,
    },
  });
});

exports.getAllMessage = factory.getAll(Message);
exports.getMessage = factory.getOne(Message);
exports.updateMessage = factory.updateOne(Message);
