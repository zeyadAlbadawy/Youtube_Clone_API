const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/userRouter');
const videoRouter = require('./routes/videoRouter.js');
const likeRouter = require('./routes/likeRouter.js');
const commentRouter = require('./routes/commentRouter.js');
const channelRouter = require('./routes/channelRouter.js');
const app = express();
const AppError = require('./utils/appError.js');
const globalErrorHandler = require('./controllers/errorController.js');
const db = require('./models');
const cloudinary = require('cloudinary').v2;

// Cloudainary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});

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
app.use('/api/v1/comments', commentRouter);
app.use('/api/v1/channels', channelRouter);
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
