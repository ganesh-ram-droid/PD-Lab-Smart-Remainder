const authService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');
const response = require('../utils/response');

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);

  return response.success(res, {
    statusCode: 201,
    message: 'User registered successfully.',
    data: result
  });
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);

  return response.success(res, {
    statusCode: 200,
    message: 'User logged in successfully.',
    data: result
  });
});

const getProfile = asyncHandler(async (req, res) => {
  const profile = await authService.getProfile(req.user.uid);

  return response.success(res, {
    statusCode: 200,
    message: 'User profile fetched successfully.',
    data: profile
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  const profile = await authService.updateProfile(req.user.uid, req.body);

  return response.success(res, {
    statusCode: 200,
    message: 'User profile updated successfully.',
    data: profile
  });
});

const logout = asyncHandler(async (req, res) => {
  const result = await authService.logout(req.user.uid);

  return response.success(res, {
    statusCode: 200,
    message: 'User logged out successfully.',
    data: result
  });
});

const deleteAccount = asyncHandler(async (req, res) => {
  const profile = await authService.deleteAccount(req.user.uid);

  return response.success(res, {
    statusCode: 200,
    message: 'User account deleted successfully.',
    data: profile
  });
});

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  logout,
  deleteAccount
};
