import express from 'express';
import { v4 as uuid } from 'uuid';
import createHttpError from 'http-errors';
import User from './_user-schema.js';

export default (passport) => {
  const router = express.Router();

  router.route('/signup').post(async (req, res, next) => {
    const password = req.body.password;
    const username = req.body.username;
    const handle = `@${uuid()}`;
    const email = req.body.email;

    try {
      const existenceCheck = await User.findOne({ email }).exec();

      if (existenceCheck) {
        const userExists = createHttpError(
          400,
          'User with that email already exists'
        );
        return next(userExists);
      }

      const newUser = await User.create({
        password,
        username,
        handle,
        email,
      });

      return res.format({
        'application/json': () => {
          res.status(200);
          return res.send({
            ...newUser,
          });
        },
      });
    } catch (error) {
      return next(error);
    }
  });

  router.route('/login').post(function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
      console.log('MMMM', err, user, info);
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(500).json('User does not exist');
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        res.status(200).json('Successfully authenticated');
        console.log(req.user);
      });
    })(req, res, next);
  });

  router.route('/user').get((req, res) => {});

  // export default module.exports = router;
  return router;
};
