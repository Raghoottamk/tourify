const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// unhandeled routes
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fails',
    message: `can't find ${req.originalUrl} on the server`,
  });
});

// 3) ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
