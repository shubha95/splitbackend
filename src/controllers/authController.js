const { validateRegisterInput, validateLoginInput, validateChangePassword, validateGetUsers } = require('../validations/authValidation');
const { registerUser, loginUser, changePassword, getUsers, logoutUser }                      = require('../services/authService');
const { sendSuccess, sendError }                   = require('../utils/responseHelper');

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
