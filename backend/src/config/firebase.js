const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

const logger = require('../utils/logger');

const getServiceAccountFromBase64 = () => {
  if (!process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    return null;
  }

  const decoded = Buffer.from(
    process.env.FIREBASE_SERVICE_ACCOUNT_BASE64,
    'base64'
  ).toString('utf8');

  return JSON.parse(decoded);
};

const getServiceAccountFromPath = () => {
  if (!process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    return null;
  }

  const credentialPath = path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
  const credentialJson = fs.readFileSync(credentialPath, 'utf8');

  return JSON.parse(credentialJson);
};

const buildFirebaseOptions = () => {
  const serviceAccount =
    getServiceAccountFromBase64() || getServiceAccountFromPath();

  const options = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
  };

  if (serviceAccount) {
    options.credential = admin.credential.cert(serviceAccount);
  } else {
    options.credential = admin.credential.applicationDefault();
  }

  return options;
};

const initializeFirebase = () => {
  if (admin.apps.length) {
    return admin.app();
  }

  try {
    const firebaseApp = admin.initializeApp(buildFirebaseOptions());
    logger.info('Firebase Admin SDK initialized.');
    return firebaseApp;
  } catch (error) {
    logger.error('Firebase Admin SDK initialization failed.', error);
    throw error;
  }
};

const firebaseApp = initializeFirebase();
const firestore = admin.firestore(firebaseApp);
const auth = admin.auth(firebaseApp);

module.exports = {
  admin,
  firebaseApp,
  firestore,
  auth
};
