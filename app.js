import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import path from 'path';
import authStrategy from './_passport-config.js';
import usersRouter from './_user-route.js';
import baseRouter from './routes/index.js';

// enables ENV variables to be present under command proccess.env
// require('dotenv').config();

// enables express.js on the app and defines the port
const app = express();
const port = process.env.PORT || 5000;

app.set('views', path.join('views'));
app.set('view engine', 'hbs');

// enables CORS - cross origin resource sharing -
// makes possible requesting resources from another domain
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const secret = 'l0r1&ti3u';
app.use(
  session({
    secret,
    resave: true,
    saveUninitialized: true,
  })
);

app.use(cookieParser(secret));
app.use(passport.initialize());
app.use(passport.session());
authStrategy(passport);

// mongoose helps us connect to our MongoDB database
const uri = 'mongodb://127.0.0.1:27017/PassportJS';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Routes
app.use('/', baseRouter);
app.use('/users', usersRouter(passport));

// starts the server, and listens for changes on predefined port
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
