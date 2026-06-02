const validateRegisterInput = ({ userName, emailId, password }) => {
  const errors = [];

  // ── userName ──────────────────────────────────────────────
  if (!userName || !String(userName).trim()) {
    errors.push({ field: 'userName', message: 'userName is required' });
  } else {
    const name = String(userName).trim();
    if (name.length < 2) {
      errors.push({ field: 'userName', message: 'userName must be at least 2 characters' });
    } else if (name.length > 30) {
      errors.push({ field: 'userName', message: 'userName must not exceed 30 characters' });
    } else if (!/^[a-zA-Z0-9_ ]+$/.test(name)) {
      errors.push({
        field: 'userName',
        message: 'userName can only contain letters, numbers, spaces, and underscores',
      }); 
    }
  }

  // ── emailId ───────────────────────────────────────────────
  if (!emailId || !String(emailId).trim()) {
    errors.push({ field: 'emailId', message: 'emailId is required' });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(emailId).trim())) {
    errors.push({ field: 'emailId', message: 'Please provide a valid email address' });
  }

  // ── password ──────────────────────────────────────────────
  if (!password || !String(password)) {
    errors.push({ field: 'password', message: 'password is required' });
  } else {
    const pwd = String(password);
    if (pwd.length < 8)
      errors.push({ field: 'password', message: 'password must be at least 8 characters' });
    if (!/[A-Z]/.test(pwd))
      errors.push({ field: 'password', message: 'password must contain at least one uppercase letter' });
    if (!/[a-z]/.test(pwd))
      errors.push({ field: 'password', message: 'password must contain at least one lowercase letter' });
    if (!/[0-9]/.test(pwd))
      errors.push({ field: 'password', message: 'password must contain at least one number' });
    if (!/[@$!%*?&#^()_\-+=]/.test(pwd))
      errors.push({ field: 'password', message: 'password must contain at least one special character (@$!%*?&)' });
  }

  return errors;
};

const validateLoginInput = ({ emailId, password }) => {
  const errors = [];

  if (!emailId || !String(emailId).trim())
    errors.push({ field: 'emailId', message: 'emailId is required' });

  if (!password || !String(password).trim())
    errors.push({ field: 'password', message: 'password is required' });

  return errors;
};

const validateChangePassword = ({ emailId, newPassword }) => {
  const errors = [];

  if (!emailId || !String(emailId).trim()) {
    errors.push({ field: 'emailId', message: 'emailId is required' });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(emailId).trim())) {
    errors.push({ field: 'emailId', message: 'Please provide a valid email address' });
  }

  if (!newPassword || !String(newPassword)) {
    errors.push({ field: 'newPassword', message: 'newPassword is required' });
  } else {
    const pwd = String(newPassword);
    if (pwd.length < 8)
      errors.push({ field: 'newPassword', message: 'newPassword must be at least 8 characters' });
    if (!/[A-Z]/.test(pwd))
      errors.push({ field: 'newPassword', message: 'newPassword must contain at least one uppercase letter' });
    if (!/[a-z]/.test(pwd))
      errors.push({ field: 'newPassword', message: 'newPassword must contain at least one lowercase letter' });
    if (!/[0-9]/.test(pwd))
      errors.push({ field: 'newPassword', message: 'newPassword must contain at least one number' });
    if (!/[@$!%*?&#^()_\-+=]/.test(pwd))
      errors.push({ field: 'newPassword', message: 'newPassword must contain at least one special character (@$!%*?&)' });
  }

  return errors;
};

const validateGetUsers = ({ pageNumber, itemNumber }) => {
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

module.exports = { validateRegisterInput, validateLoginInput, validateChangePassword, validateGetUsers };
