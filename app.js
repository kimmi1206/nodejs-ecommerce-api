require('dotenv').config();
require('express-async-errors');

// express
const express = require('express');
const app = express();

// middleware modules
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// database
const connectDB = require('./db/connect');

// Routers
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');

// Use Middleware
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.static('./public'));
app.use(cors());

// Routes
app.get('/', (req, res) => {
  res.send('e-commerce-api');
});

app.get('/api/v1', (req, res) => {
  console.log(req.signedCookies);
  // res.send('e-commerce-api');
});

// Routes Middleware
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// Server
const port = process.env.PORT || 5000;

const start = async () => {
  try {
    const connection = await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`Server is listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
