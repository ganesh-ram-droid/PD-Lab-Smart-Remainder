require('dotenv').config();

const parseBoolean = (value, fallback) => {
  if (value === undefined) {
    return fallback;
  }

  return value === 'true';
};

const allowedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(',').map((origin) => origin.trim())
  : ['http://localhost:3000'];

module.exports = {
  apiVersion: process.env.API_VERSION || 'v1',
  requestLimit: '10kb',
  logFormat: process.env.LOG_FORMAT || 'dev',
  cors: {
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Origin is not allowed by CORS'));
    },
    credentials: parseBoolean(process.env.CORS_CREDENTIALS, true)
  }
};
