const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/userRouter');
const videoRouter = require('./routes/videoRouter.js');
const likeRouter = require('./routes/likeRouter.js');
const app = express();
const AppError = require('./utils/appError.js');
const globalErrorHandler = require('./controllers/errorController.js');
const db = require('./models');
// MIDDLEWARES
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
  next();
});

// Sequalize
// Routers Middleware
app.use('/api/v1/users', userRouter);
app.use('/api/v1/videos', videoRouter);
app.use('/api/v1/likes', likeRouter);

app.all('/{*any}', (req, res, next) => {
  // If i pass anything to next it will propagate it to global error handling middleware
  next(new AppError(`Can not find ${req.originalUrl} on this server!`, 404));
});

// Error handling middleware
app.use(globalErrorHandler);
db.sequelize.sync({ force: false }).then(() => {
  console.log('Database synced');
});

app.listen(process.env.APP_PORT, () => {
  console.log(`Server is running on port ${process.env.APP_PORT}`);
});

module.exports = app;
