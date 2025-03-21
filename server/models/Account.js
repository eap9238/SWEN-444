const crypto = require('crypto');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

// mongoose.Types.ObjectID is a function that
// converts string ID to real mongo ID
const convertID = mongoose.Types.ObjectId;

mongoose.Promise = global.Promise;

let AccountModel = {};
const iterations = 10000;
const saltLength = 64;
const keyLength = 64;

const AccountSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: /^[A-Za-z0-9_\-.]{1,16}$/,
  },
  salt: {
    type: Buffer,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  type: {
    type: String,
    default: "Free",
  },
  language: {
    type: String,
    default: "English",
    required: true,
  },
  class: {
    type: String,
  },
  friends: {
    type: [String],
    value: [],
    default: ["5ca3fd10f65f4e00166394e1", "5ca3fd2fc666690016995ab2"],
  },
});

AccountSchema.statics.toAPI = doc => ({
  // _id is built into your mongo document and is guaranteed to be unique
  username: doc.username,
  createdDate: doc.createdDate,
  _id: doc._id,
  type: doc.type,
  language: doc.language,
  friends: doc.friends,
});

const validatePassword = (doc, password, callback) => {
  const pass = doc.password;

  return crypto.pbkdf2(password, doc.salt, iterations, keyLength, 'RSA-SHA512', (err, hash) => {
    if (hash.toString('hex') !== pass) {
      return callback(false);
    }
    return callback(true);
  });
};

AccountSchema.statics.changePassword = (username, password, callback) =>
AccountModel.findByUsername(username, (err, doc) =>
crypto.pbkdf2(password, doc.salt, iterations, keyLength, 'RSA-SHA512', (erro, hash) => {
  if (erro) {
    callback(erro);
  }

  doc.password = (hash.toString('hex'));
  // doc.setAttribute(password, hash.toString('hex'));

  doc.save((error) => {
    if (error) {
      callback(error);
    }
  });
}));

AccountSchema.statics.findByUsername = (name, callback) => {
  const search = {
    username: name,
  };

  return AccountModel.findOne(search, callback);
};

AccountSchema.statics.findAllAccounts = (docType, callback) => {
  const search = {
    type: docType,
  };

  return AccountModel.find(search).select('username _id language').exec(callback);
  //return AccountModel.find().select('username _id language').exec(callback);
};

AccountSchema.statics.findFriendAccounts = (docFriends, callback) => {
  const search = {
    _id: { $in: docFriends},
  };

  return AccountModel.find(search).select('username _id language').exec(callback);
};

AccountSchema.statics.generateHash = (password, callback) => {
  const salt = crypto.randomBytes(saltLength);

  crypto.pbkdf2(password, salt, iterations, keyLength, 'RSA-SHA512', (err, hash) =>
    callback(salt, hash.toString('hex'))
  );
};

AccountSchema.statics.authenticate = (username, password, callback) =>
AccountModel.findByUsername(username, (err, doc) => {
  if (err) {
    return callback(err);
  }

  if (!doc) {
    return callback();
  }

  return validatePassword(doc, password, (result) => {
    if (result === true) {
      return callback(null, doc);
    }

    return callback();
  });
});

AccountModel = mongoose.model('Account', AccountSchema);

module.exports.AccountModel = AccountModel;
module.exports.AccountSchema = AccountSchema;
