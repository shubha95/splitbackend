const validateAddExpense = ({ price, description }) => {
  const errors = [];

  // ── price ─────────────────────────────────────────────────
  if (price === undefined || price === null || String(price).trim() === '') {
    errors.push({ field: 'price', message: 'price is required' });
  } else if (isNaN(Number(price))) {
    errors.push({ field: 'price', message: 'price must be a valid number' });
  } else if (Number(price) < 0) {
    errors.push({ field: 'price', message: 'price must be greater than or equal to 0' });
  }

  // ── description ───────────────────────────────────────────
  if (!description || !String(description).trim()) {
    errors.push({ field: 'description', message: 'description is required' });
  } else if (String(description).trim().length > 500) {
    errors.push({ field: 'description', message: 'description must not exceed 500 characters' });
  }

  return errors;
};

const validateUpdateExpense = ({ price, description }) => {
  const errors = [];

  if (price !== undefined && price !== null) {
    if (isNaN(Number(price))) {
      errors.push({ field: 'price', message: 'price must be a valid number' });
    } else if (Number(price) < 0) {
      errors.push({ field: 'price', message: 'price must be greater than or equal to 0' });
    }
  }

  if (description !== undefined && String(description).trim().length > 500) {
    errors.push({ field: 'description', message: 'description must not exceed 500 characters' });
  }

  return errors;
};

const validateGetExpenses = ({ pageNumber, itemNumber }) => {
  const errors = [];

  if (pageNumber === undefined || pageNumber === null || String(pageNumber).trim() === '') {
    errors.push({ field: 'pageNumber', message: 'pageNumber is required' });
  } else if (!Number.isInteger(Number(pageNumber)) || Number(pageNumber) < 1) {
    errors.push({ field: 'pageNumber', message: 'pageNumber must be a positive integer starting from 1' });
  }

  if (itemNumber === undefined || itemNumber === null || String(itemNumber).trim() === '') {
    errors.push({ field: 'itemNumber', message: 'itemNumber is required' });
  } else if (!Number.isInteger(Number(itemNumber)) || Number(itemNumber) < 1) {
    errors.push({ field: 'itemNumber', message: 'itemNumber must be a positive integer' });
  } else if (Number(itemNumber) > 100) {
    errors.push({ field: 'itemNumber', message: 'itemNumber must not exceed 100 per page' });
  }

  return errors;
};

module.exports = { validateAddExpense, validateUpdateExpense, validateGetExpenses };
