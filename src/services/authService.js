const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateToken, getTokenExpiry } = require('../utils/tokenHelper');

const SALT_ROUNDS = 10;

const registerUser = async ({ userName, emailId, password, address }) => {
  const normalizedEmail = emailId.trim().toLowerCase();
  const trimmedName     = userName.trim();
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    const err = new Error('An account with this email already exists');
    err.statusCode = 409;
    err.field = 'emailId';
    throw err;
  }

  const salt           = await bcrypt.genSalt(SALT_ROUNDS);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = new User({
    name:     trimmedName,
    email:    normalizedEmail,
    password: hashedPassword,
    address:  address ? String(address).trim() : '',
  });

  await user.save();

  return {
    user: {
      id:        user.id,
      userName:  user.name,
      emailId:   user.email,
      address:   user.address,
      createdAt: user.date,
    },
  };
};

const loginUser = async ({ emailId, password }) => {
  const normalizedEmail = String(emailId).trim().toLowerCase();

  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  const token       = generateToken({ user: { id: user.id, email: user.email } });
  const tokenExpiry = getTokenExpiry();

  user.awsToken    = token;
  user.tokenExpiry = tokenExpiry;
  await user.save();

  return {
    user: {
      id:      user.id,
      userName: user.name,
      emailId:  user.email,
      address:  user.address,
    },
    token,
    tokenExpiry,
  };
};

const getUsers = async ({ pageNumber, itemNumber, search }) => {
  const page  = Number(pageNumber);
  const limit = Number(itemNumber);
  const skip  = (page - 1) * limit;

  const filter = {};
  if (search && String(search).trim()) {
    const regex = new RegExp(String(search).trim(), 'i');
    filter.$or = [{ name: regex }, { email: regex }];
  }

  const [users, total] = await Promise.all([
    User.find(filter)
      .select('-password -awsToken -tokenExpiry -__v')
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments(filter),
  ]);

  return {
    total,
    pageNumber:  page,
    itemNumber:  limit,
    totalPages:  Math.ceil(total / limit),
    users: users.map((u) => ({
      id:        u._id,
      userName:  u.name,
      emailId:   u.email,
      address:   u.address,
      createdAt: u.date,
    })),
  };
};

const changePassword = async ({ emailId, newPassword }) => {
  const normalizedEmail = String(emailId).trim().toLowerCase();

  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    const err = new Error('No account found with this email address');
    err.statusCode = 404;
    throw err;
  }

  const salt       = await bcrypt.genSalt(SALT_ROUNDS);
  user.password    = await bcrypt.hash(newPassword, salt);
  user.awsToken    = null;
  user.tokenExpiry = null;
  await user.save();
};

const logoutUser = async ({ userId }) => {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  user.awsToken    = null;
  user.tokenExpiry = null;
  await user.save();
};

module.exports = { registerUser, loginUser, getUsers, changePassword, logoutUser };
