const { validateCreateGroup, validateUpdateGroup, validateGetMyGroups } = require('../validations/groupValidation');
const { createGroup, updateGroup, deleteGroup, getMyGroups }           = require('../services/groupService');
const { sendSuccess, sendError }                   = require('../utils/responseHelper');

exports.getMyGroups = async (req, res) => {
  try {
    if (!req.body || typeof req.body !== 'object') {
      return sendError(res, 400, 'Request body must be a valid JSON object');
    }

    const { pageNumber, itemNumber } = req.body;

    const errors = validateGetMyGroups({ pageNumber, itemNumber });
    if (errors.length) {
      return sendError(res, 422, 'Validation failed', errors);
    }

    const result = await getMyGroups({ userId: req.user.id, pageNumber, itemNumber });
    return sendSuccess(res, 200, 'Groups fetched successfully', result);
  } catch (err) {
    return sendError(res, 500, 'Internal server error');
  }
};

exports.createGroup = async (req, res) => {
  try {
    if (!req.body || typeof req.body !== 'object') {
      return sendError(res, 400, 'Request body must be a valid JSON object');
    }

    const { groupName, description } = req.body;

    const errors = validateCreateGroup({ groupName, description });
    if (errors.length) {
      return sendError(res, 422, 'Validation failed', errors);
    }

    // createdBy and groupAdmin both come from the verified JWT token
    const result = await createGroup({ groupName, description, userId: req.user.id });
    return sendSuccess(res, 201, 'Group created successfully', result);
  } catch (err) {
    return sendError(res, 500, 'Internal server error');
  }
};

exports.updateGroup = async (req, res) => {
  try {
    if (!req.body || typeof req.body !== 'object') {
      return sendError(res, 400, 'Request body must be a valid JSON object');
    }

    const { groupID, groupName, description } = req.body;

    if (!groupID) {
      return sendError(res, 400, 'groupID is required in request body', [{ field: 'groupID', message: 'groupID is required' }]);
    }

    if (groupName === undefined && description === undefined) {
      return sendError(res, 400, 'Provide at least one field to update: groupName or description');
    }

    const errors = validateUpdateGroup({ groupName, description });
    if (errors.length) {
      return sendError(res, 422, 'Validation failed', errors);
    }

    const result = await updateGroup({ groupID, userId: req.user.id, groupName, description });
    return sendSuccess(res, 200, 'Group updated successfully', result);
  } catch (err) {
    if (err.statusCode === 404) {
      return sendError(res, 404, err.message);
    }
    return sendError(res, 500, 'Internal server error');
  }
};

exports.deleteGroup = async (req, res) => {
  try {
    if (!req.body || typeof req.body !== 'object') {
      return sendError(res, 400, 'Request body must be a valid JSON object');
    }

    const { groupID } = req.body;

    if (!groupID) {
      return sendError(res, 400, 'groupID is required in request body', [{ field: 'groupID', message: 'groupID is required' }]);
    }

    const result = await deleteGroup({ groupID, userId: req.user.id });
    return sendSuccess(res, 200, 'Group deleted successfully', result);
  } catch (err) {
    if (err.statusCode === 400) return sendError(res, 400, err.message);
    if (err.statusCode === 404) return sendError(res, 404, err.message);
    return sendError(res, 500, 'Internal server error');
  }
};
