const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp'); // Prevent parameter pollution

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const messagesRouter = require('./routes/messageRoutes');

const app = express();

app.options('*', cors());

// 1) GLOBAL MIDDLEWARES

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour',
});

app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

// Serving static files
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/messages', messagesRouter);

app.all('*', (req, res, next) => {
  // const err = new Error(
  //   `Can't find ${req.method} for ${req.url} on this server!`,
  // );
  // err.status = 'fail';
  // err.statusCode = 404;

  next(
    new AppError(
      `Can't find ${req.method} for ${req.url} on this server!`,
      404,
    ),
  );
});

app.use(globalErrorHandler);

// 4) START SERVER
module.exports = app;
