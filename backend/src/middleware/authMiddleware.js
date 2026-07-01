const authService = require('../services/authService');
const userModel = require('../models/userModel');
const AppError = require('../utils/AppError');

const getBearerToken = (req) => {
  const authHeader = req.headers.authorization || '';

  if (!authHeader.startsWith('Bearer ')) {
    return null;
  }

  return authHeader.split(' ')[1];
};

const authenticate = async (req, res, next) => {
  try {
    const token = getBearerToken(req);

    if (!token) {
      throw new AppError('Authorization token is required.', 401);
    }

    const decodedToken = await authService.verifyIdToken(token);
    const profile = await userModel.getUserProfileByUid(decodedToken.uid);

    if (!profile || !profile.isActive) {
      throw new AppError('Authenticated user profile is inactive or unavailable.', 401);
    }

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      token: decodedToken,
      profile
    };

    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  authenticate
};
