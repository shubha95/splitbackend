const { validateRegisterInput, validateLoginInput, validateChangePassword, validateGetUsers } = require('../validations/authValidation');
const { registerUser, loginUser, changePassword, getUsers, logoutUser }                      = require('../services/authService');
const { sendSuccess, sendError }                   = require('../utils/responseHelper');
const { verifyGoogleToken, verifyFacebookToken, verifyTwitterToken, verifyOutlookToken } = require('../services/socialAuthService');
const { generateToken, getTokenExpiry } = require('../utils/tokenHelper');
const User = require('../models/User');

const SOCIAL_PROVIDERS = {
  google:   verifyGoogleToken,
  facebook: verifyFacebookToken,
  twitter:  verifyTwitterToken,
  outlook:  verifyOutlookToken,
};

exports.register = async (req, res) => {
  try {
    if (!req.body || typeof req.body !== 'object') {
      return sendError(res, 400, 'Request body must be a valid JSON object');
    }

    const { userName, emailId, password, address } = req.body;

    const errors = validateRegisterInput({ userName, emailId, password });
    if (errors.length) {
      return sendError(res, 422, 'send json is wrong', errors);
    }

    const result = await registerUser({ userName, emailId, password, address });
    return sendSuccess(res, 201, 'Account created successfully', result);
  } catch (err) {
    if (err.statusCode === 409) {
      return sendError(res, 409, err.message, [{ field: err.field, message: err.message }]);
    }
    return sendError(res, 500, 'Internal server error');
  }
};

exports.changePassword = async (req, res) => {
  try {
    if (!req.body || typeof req.body !== 'object') {
      return sendError(res, 400, 'Request body must be a valid JSON object');
    }

    const { emailId, newPassword } = req.body;

    const errors = validateChangePassword({ emailId, newPassword });
    if (errors.length) {
      return sendError(res, 422, 'Validation failed', errors);
    }

    await changePassword({ emailId, newPassword });
    return sendSuccess(res, 200, 'Password updated successfully. Please login with your new password.');
  } catch (err) {
    if (err.statusCode === 404) return sendError(res, 404, err.message, [{ field: 'emailId', message: err.message }]);
    return sendError(res, 500, 'Internal server error');
  }
};

exports.getMe = async (req, res) => {
  try {
    return sendSuccess(res, 200, 'User fetched successfully', {
      id:       req.user.id,
      userName: req.user.userName,
      emailId:  req.user.emailId,
    });
  } catch (err) {
    return sendError(res, 500, 'Internal server error');
  }
};

exports.logout = async (req, res) => {
  try {
    await logoutUser({ userId: req.user.id });
    return sendSuccess(res, 200, 'Logged out successfully');
  } catch (err) {
    if (err.statusCode === 404) return sendError(res, 404, err.message);
    return sendError(res, 500, 'Internal server error');
  }
};

exports.getUsers = async (req, res) => {
  try {
    if (!req.body || typeof req.body !== 'object') {
      return sendError(res, 400, 'Request body must be a valid JSON object');
    }

    const { pageNumber, itemNumber, search } = req.body;

    const errors = validateGetUsers({ pageNumber, itemNumber });
    if (errors.length) {
      return sendError(res, 422, 'Validation failed', errors);
    }

    const result = await getUsers({ pageNumber, itemNumber, search });
    return sendSuccess(res, 200, 'Users fetched successfully', result);
  } catch (err) {
    return sendError(res, 500, 'Internal server error');
  }
};

exports.login = async (req, res) => {
  try {
    if (!req.body || typeof req.body !== 'object') {
      return sendError(res, 400, 'Request body must be a valid JSON object');
    }

    const { emailId, password } = req.body;

    const errors = validateLoginInput({ emailId, password });
    if (errors.length) {
      return sendError(res, 422, 'Validation failed', errors);
    }

    const result = await loginUser({ emailId, password });
    return sendSuccess(res, 200, 'Login successful', result);
  } catch (err) {
    if (err.statusCode === 401) {
      return sendError(res, 401, err.message);
    }
    console.error('[login]', err.message);
    return sendError(res, 500, 'Internal server error');
  }
};

exports.socialLogin = async (req, res) => {
  try {
    if (!req.body || typeof req.body !== 'object') {
      return sendError(res, 400, 'Request body must be a valid JSON object');
    }

    const { provider, token } = req.body;

    // 1. Validate provider
    const verifyToken = SOCIAL_PROVIDERS[provider];
    if (!verifyToken) {
      return sendError(res, 400, 'Invalid provider. Must be one of: google, facebook, twitter, outlook');
    }

    // 2. Verify the provider token — throws on invalid token
    let profile;
    try {
      profile = await verifyToken(token);
    } catch (verifyErr) {
      return sendError(res, 401, verifyErr.message);
    }

    // 3. Find or create the user from the social profile
    const user = await User.findOrCreateSocialUser({
      provider,
      providerId: profile.providerId,
      email:      profile.email,
      name:       profile.name,
      avatar:     profile.avatar,
    });

    // 4. Sign JWT using the exact same pattern as the existing login flow
    const jwtToken    = generateToken({ user: { id: user.id, email: user.email } });
    const tokenExpiry = getTokenExpiry();

    user.awsToken    = jwtToken;
    user.tokenExpiry = tokenExpiry;
    await user.save();

    // 5. Return the exact same response shape as the existing login response
    return sendSuccess(res, 200, 'Login successful', {
      user: {
        id:       user.id,
        userName: user.name,
        emailId:  user.email,
        address:  user.address || '',
      },
      token:       jwtToken,
      tokenExpiry,
    });
  } catch (err) {
    console.error('[socialLogin]', err.message);
    return sendError(res, 500, 'Internal server error');
  }
};
