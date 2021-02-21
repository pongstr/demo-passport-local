import User from './_user-schema.js';
import bcrypt from 'bcrypt';
import * as passportLocal from 'passport-local';

const localStrategy = passportLocal.Strategy;

export default (passport) => {
  console.log('tle');
  passport.use(
    new localStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      (email, password, done) => {
        console.log('!!!', email, password);
        User.findOne({ email: email.toLowerCase() })
          .exec()
          .then((user) => {
            if (!user) {
              return done(null, false, {
                message: 'User with that email does not exist',
              });
            }
            bcrypt.compare(password, user.password, (err) => {
              if (err) {
                return done(null, false, { message: 'Incorrect password' });
              }
              return done(null, user);
            });

            // return done(null, user);
          })
          .catch((err) => {
            return done(err);
          });
      }
    )
  );
  passport.serializeUser((req, user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findOne({ _id: id }, (err, user) => {
      done(err, user);
    });
  });
};
