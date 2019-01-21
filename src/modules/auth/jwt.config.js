import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import config from 'config';
import { getUserByEmail } from './users.dao';
import { jwt as jwtConfig } from '../../config/config';

const PUBLIC_KEY = jwtConfig.publicKey;

exports.AUTH_HEADER_SCHEME = 'JWT';

exports.jwtOptions = {
  secretOrKey: PUBLIC_KEY,
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme(exports.AUTH_HEADER_SCHEME),
  algorithms: 'RS512',
  ignoreExpiration: config.jwt.ignore_expiration,
};

exports.useJwtStrategy = () => {
  const strategy = exports.getJwtStrategy(exports.jwtOptions, exports.verifyCallback);
  passport.use(strategy);
};

exports.getJwtStrategy = (options, callback) => new JwtStrategy(options, callback);

exports.verifyCallback = async (user, done) => {
  const mongooseUser = await getUserByEmail(user.email);
  return done(null, mongooseUser);
};
