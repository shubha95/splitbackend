const validateCreateGroup = ({ groupName, description }) => {
  const errors = [];

  // ── groupName ─────────────────────────────────────────────
  if (!groupName || !String(groupName).trim()) {
    errors.push({ field: 'groupName', message: 'groupName is required' });
  } else {
    const name = String(groupName).trim();
    if (name.length < 2) {
      errors.push({ field: 'groupName', message: 'groupName must be at least 2 characters' });
    } else if (name.length > 100) {
      errors.push({ field: 'groupName', message: 'groupName must not exceed 100 characters' });
    }
  }

  // ── description (optional) ────────────────────────────────
  if (description !== undefined && String(description).trim().length > 500) {
    errors.push({ field: 'description', message: 'description must not exceed 500 characters' });
  }

  return errors;
};

const validateUpdateGroup = ({ groupName, description }) => {
  const errors = [];

  if (groupName !== undefined) {
    const name = String(groupName).trim();
    if (!name) {
      errors.push({ field: 'groupName', message: 'groupName cannot be empty' });
    } else if (name.length < 2) {
      errors.push({ field: 'groupName', message: 'groupName must be at least 2 characters' });
    } else if (name.length > 100) {
      errors.push({ field: 'groupName', message: 'groupName must not exceed 100 characters' });
    }
  }

  if (description !== undefined && String(description).trim().length > 500) {
    errors.push({ field: 'description', message: 'description must not exceed 500 characters' });
  }

  return errors;
};

const validateGetMyGroups = ({ pageNumber, itemNumber }) => {
  const errors = [];

  const page = Number(pageNumber);
  const item = Number(itemNumber);

  if (!pageNumber && pageNumber !== 0) {
    errors.push({ field: 'pageNumber', message: 'pageNumber is required' });
  } else if (!Number.isInteger(page) || page < 1) {
    errors.push({ field: 'pageNumber', message: 'pageNumber must be a positive integer' });
  }

  if (!itemNumber && itemNumber !== 0) {
    errors.push({ field: 'itemNumber', message: 'itemNumber is required' });
  } else if (!Number.isInteger(item) || item < 1 || item > 100) {
    errors.push({ field: 'itemNumber', message: 'itemNumber must be between 1 and 100' });
  }

  return errors;
};

module.exports = { validateCreateGroup, validateUpdateGroup, validateGetMyGroups };
