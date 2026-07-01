const { firestore, auth } = require('../models');

const getFirestore = () => firestore;

const getAuth = () => auth;

module.exports = {
  getFirestore,
  getAuth
};
