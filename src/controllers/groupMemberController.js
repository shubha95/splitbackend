const {
  validateAddMembers,
  validateUpdateMember,
  validateDeleteMember,
  validatePromoteOrDemote,
  validateUpdatePermissions,
} = require('../validations/groupMemberValidation');

const {
  addMembers,
  updateMember,
  deleteMember,
  promoteToAdmin,
  demoteToMember,
  updatePermissions,
} = require('../services/groupMemberService');

const { sendSuccess, sendError } = require('../utils/responseHelper');

exports.addMembers = async (req, res) => {
  try {
    if (!req.body || typeof req.body !== 'object') {
      return sendError(res, 400, 'Request body must be a valid JSON object');
    }

    const { memberID, groupID } = req.body;

    const errors = validateAddMembers({ memberID, groupID });
    if (errors.length) {
      return sendError(res, 422, 'Validation failed', errors);
    }

    const result = await addMembers({ memberID, groupID, groupAddedBy: req.user.id });
    return sendSuccess(res, 201, 'Members added successfully', result);
  } catch (err) {
    if (err.statusCode === 403) return sendError(res, 403, err.message);
    return sendError(res, 500, 'Internal server error');
  }
};

exports.updateMember = async (req, res) => {
  try {
    if (!req.body || typeof req.body !== 'object') {
      return sendError(res, 400, 'Request body must be a valid JSON object');
    }

    const { memberRecordID, groupID } = req.body;

    const errors = validateUpdateMember({ memberRecordID, groupID });
    if (errors.length) {
      return sendError(res, 422, 'Validation failed', errors);
    }

    const result = await updateMember({ memberRecordID, groupID, groupAddedBy: req.user.id });
    return sendSuccess(res, 200, 'Member updated successfully', result);
  } catch (err) {
    if (err.statusCode === 404) return sendError(res, 404, err.message);
    return sendError(res, 500, 'Internal server error');
  }
};

exports.deleteMember = async (req, res) => {
  try {
    if (!req.body || typeof req.body !== 'object') {
      return sendError(res, 400, 'Request body must be a valid JSON object');
    }

    const { memberRecordID } = req.body;

    const errors = validateDeleteMember({ memberRecordID });
    if (errors.length) {
      return sendError(res, 422, 'Validation failed', errors);
    }

    const result = await deleteMember({ memberRecordID, requesterId: req.user.id });
    return sendSuccess(res, 200, 'Member removed successfully', result);
  } catch (err) {
    if (err.statusCode === 403) return sendError(res, 403, err.message);
    if (err.statusCode === 404) return sendError(res, 404, err.message);
    return sendError(res, 500, 'Internal server error');
  }
};

exports.promoteToAdmin = async (req, res) => {
  try {
    if (!req.body || typeof req.body !== 'object') {
      return sendError(res, 400, 'Request body must be a valid JSON object');
    }

    const { targetMemberID, groupID } = req.body;

    const errors = validatePromoteOrDemote({ targetMemberID, groupID });
    if (errors.length) {
      return sendError(res, 422, 'Validation failed', errors);
    }

    const result = await promoteToAdmin({ targetMemberID, groupID, requesterId: req.user.id });
    return sendSuccess(res, 200, 'Member promoted to admin successfully', result);
  } catch (err) {
    if (err.statusCode === 403) return sendError(res, 403, err.message);
    if (err.statusCode === 404) return sendError(res, 404, err.message);
    return sendError(res, 500, 'Internal server error');
  }
};

exports.demoteToMember = async (req, res) => {
  try {
    if (!req.body || typeof req.body !== 'object') {
      return sendError(res, 400, 'Request body must be a valid JSON object');
    }

    const { targetMemberID, groupID } = req.body;

    const errors = validatePromoteOrDemote({ targetMemberID, groupID });
    if (errors.length) {
      return sendError(res, 422, 'Validation failed', errors);
    }

    const result = await demoteToMember({ targetMemberID, groupID, requesterId: req.user.id });
    return sendSuccess(res, 200, 'Admin demoted to member successfully', result);
  } catch (err) {
    if (err.statusCode === 403) return sendError(res, 403, err.message);
    if (err.statusCode === 404) return sendError(res, 404, err.message);
    return sendError(res, 500, 'Internal server error');
  }
};

exports.updatePermissions = async (req, res) => {
  try {
    if (!req.body || typeof req.body !== 'object') {
      return sendError(res, 400, 'Request body must be a valid JSON object');
    }

    const { targetMemberID, groupID, permissions } = req.body;

    const errors = validateUpdatePermissions({ targetMemberID, groupID, permissions });
    if (errors.length) {
      return sendError(res, 422, 'Validation failed', errors);
    }

    const result = await updatePermissions({ targetMemberID, groupID, permissions, requesterId: req.user.id });
    return sendSuccess(res, 200, 'Permissions updated successfully', result);
  } catch (err) {
    if (err.statusCode === 403) return sendError(res, 403, err.message);
    if (err.statusCode === 404) return sendError(res, 404, err.message);
    return sendError(res, 500, 'Internal server error');
  }
};
