const { PERMISSIONS } = require('../models/GroupMember');

const validateAddMembers = ({ memberID, groupID }) => {
  const errors = [];

  if (!memberID) {
    errors.push({ field: 'memberID', message: 'memberID is required' });
  } else if (!Array.isArray(memberID)) {
    errors.push({ field: 'memberID', message: 'memberID must be an array e.g. ["id1","id2"]' });
  } else if (memberID.length === 0) {
    errors.push({ field: 'memberID', message: 'memberID array must not be empty' });
  } else {
    const hasEmpty = memberID.some((id) => !id || !String(id).trim());
    if (hasEmpty) {
      errors.push({ field: 'memberID', message: 'memberID array must not contain empty values' });
    }
  }

  if (!groupID || !String(groupID).trim()) {
    errors.push({ field: 'groupID', message: 'groupID is required' });
  }

  return errors;
};

const validateUpdateMember = ({ memberRecordID, groupID }) => {
  const errors = [];

  if (!memberRecordID || !String(memberRecordID).trim()) {
    errors.push({ field: 'memberRecordID', message: 'memberRecordID is required' });
  }

  if (!groupID || !String(groupID).trim()) {
    errors.push({ field: 'groupID', message: 'groupID is required' });
  }

  return errors;
};

const validateDeleteMember = ({ memberRecordID }) => {
  const errors = [];

  if (!memberRecordID || !String(memberRecordID).trim()) {
    errors.push({ field: 'memberRecordID', message: 'memberRecordID is required' });
  }

  return errors;
};

const validatePromoteOrDemote = ({ targetMemberID, groupID }) => {
  const errors = [];

  if (!targetMemberID || !String(targetMemberID).trim()) {
    errors.push({ field: 'targetMemberID', message: 'targetMemberID is required' });
  }

  if (!groupID || !String(groupID).trim()) {
    errors.push({ field: 'groupID', message: 'groupID is required' });
  }

  return errors;
};

const validateUpdatePermissions = ({ targetMemberID, groupID, permissions }) => {
  const errors = [];

  if (!targetMemberID || !String(targetMemberID).trim()) {
    errors.push({ field: 'targetMemberID', message: 'targetMemberID is required' });
  }

  if (!groupID || !String(groupID).trim()) {
    errors.push({ field: 'groupID', message: 'groupID is required' });
  }

  if (!permissions) {
    errors.push({ field: 'permissions', message: 'permissions is required' });
  } else if (!Array.isArray(permissions)) {
    errors.push({ field: 'permissions', message: 'permissions must be an array' });
  } else {
    const invalid = permissions.filter((p) => !PERMISSIONS.includes(p));
    if (invalid.length) {
      errors.push({
        field:   'permissions',
        message: `Invalid permissions: ${invalid.join(', ')}. Allowed: ${PERMISSIONS.join(', ')}`,
      });
    }
  }

  return errors;
};

module.exports = {
  validateAddMembers,
  validateUpdateMember,
  validateDeleteMember,
  validatePromoteOrDemote,
  validateUpdatePermissions,
};
