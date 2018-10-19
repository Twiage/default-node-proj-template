/* eslint-disable import/prefer-default-export */
import mongoose from 'mongoose';

let User;

export const getUserByEmail = email => getUserModel().findOne({ email: email.toLowerCase() });

const getUserModel = () => {
  if (!User) {
    User = mongoose.model('User');
  }
  return User;
};
