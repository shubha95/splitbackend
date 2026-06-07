const mongoose = require('mongoose');

// Subdocument for each linked social provider
const ProviderSchema = new mongoose.Schema(
  {
    name:       { type: String, enum: ['google', 'facebook', 'twitter', 'outlook'] },
    providerId: { type: String },
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  // Not required so social-only users can be created without a password
  password: {
    type: String,
    default: null,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  address: {
    type: String,
    require: true
  },
  awsToken: {
    type: String,
    default: null,
  },
  tokenExpiry: {
    type: Date,
    default: null,
  },
  providers: {
    type: [ProviderSchema],
    default: [],
  },
  avatar: {
    type: String,
    default: '',
  },
});

/**
 * Find an existing user by social provider, or create one.
 *
 * @param {object} params
 * @param {string} params.provider   - One of: google | facebook | twitter | outlook
 * @param {string} params.providerId - The provider's unique user ID
 * @param {string} params.email      - The user's email from the provider (may be empty)
 * @param {string} params.name       - The user's display name from the provider
 * @param {string} params.avatar     - Avatar URL from the provider
 * @returns {Promise<Document>} The existing or newly created user document
 */
UserSchema.statics.findOrCreateSocialUser = async function ({ provider, providerId, email, name, avatar }) {
  // 1. Existing user with this exact provider + providerId
  let user = await this.findOne({ providers: { $elemMatch: { name: provider, providerId } } });
  if (user) return user;

  // 2. Existing user with matching email — link the new provider
  if (email) {
    user = await this.findOne({ email: email.trim().toLowerCase() });
    if (user) {
      user.providers.push({ name: provider, providerId });
      if (avatar && !user.avatar) user.avatar = avatar;
      await user.save();
      return user;
    }
  }

  // 3. Brand-new user — create from social profile
  // Fallback email for providers that don't expose one (e.g. Twitter without email scope)
  const fallbackEmail = email
    ? email.trim().toLowerCase()
    : `${providerId}@${provider}.social`;

  user = new this({
    name:      name || 'Social User',
    email:     fallbackEmail,
    providers: [{ name: provider, providerId }],
    avatar:    avatar || '',
    address:   '',
  });
  await user.save();
  return user;
};

module.exports = mongoose.model('User', UserSchema);