const axios = require('axios');

/**
 * Verify a Google ID token and return a normalised profile.
 *
 * @param {string} token - Google ID token received from the client
 * @returns {Promise<{providerId: string, email: string, name: string, avatar: string}>}
 * @throws {Error} If the token is invalid or the Google endpoint returns an error
 */
const verifyGoogleToken = async (token) => {
  try {
    const { data } = await axios.get('https://oauth2.googleapis.com/tokeninfo', {
      params: { id_token: token },
    });

    if (!data.sub) {
      throw new Error('Invalid Google token: missing subject identifier');
    }

    return {
      providerId: data.sub,
      email:      data.email || '',
      name:       data.name  || data.email || 'Google User',
      avatar:     data.picture || '',
    };
  } catch (err) {
    // Re-throw with a descriptive message; preserve original if already descriptive
    if (err.response) {
      throw new Error(`Google token verification failed: ${err.response.data?.error_description || err.response.data?.error || 'invalid token'}`);
    }
    throw err;
  }
};

/**
 * Verify a Facebook user access token and return a normalised profile.
 *
 * @param {string} token - Facebook user access token received from the client
 * @returns {Promise<{providerId: string, email: string, name: string, avatar: string}>}
 * @throws {Error} If the token is invalid or the Facebook endpoint returns an error
 */
const verifyFacebookToken = async (token) => {
  try {
    const { data } = await axios.get('https://graph.facebook.com/me', {
      params: {
        fields:       'id,name,email,picture',
        access_token: token,
      },
    });

    if (!data.id) {
      throw new Error('Invalid Facebook token: missing user ID');
    }

    return {
      providerId: data.id,
      email:      data.email  || '',
      name:       data.name   || 'Facebook User',
      // picture is nested: { data: { url } }
      avatar:     data.picture?.data?.url || '',
    };
  } catch (err) {
    if (err.response) {
      throw new Error(`Facebook token verification failed: ${err.response.data?.error?.message || 'invalid token'}`);
    }
    throw err;
  }
};

/**
 * Verify a Twitter (X) OAuth 2.0 user access token and return a normalised profile.
 * Requires the token to have the `users.read` and `tweet.read` OAuth 2.0 scopes.
 *
 * Note: Email is only returned if the app has been granted the `email` scope by Twitter.
 * TODO: Configure TWITTER_BEARER_TOKEN in .env for app-level API access if needed.
 *
 * @param {string} token - Twitter OAuth 2.0 user access token received from the client
 * @returns {Promise<{providerId: string, email: string, name: string, avatar: string}>}
 * @throws {Error} If the token is invalid or the Twitter endpoint returns an error
 */
const verifyTwitterToken = async (token) => {
  try {
    const { data } = await axios.get('https://api.twitter.com/2/users/me', {
      headers: { Authorization: `Bearer ${token}` },
      params:  { 'user.fields': 'id,name,profile_image_url' },
    });

    const twitterUser = data.data;
    if (!twitterUser?.id) {
      throw new Error('Invalid Twitter token: missing user data');
    }

    return {
      providerId: twitterUser.id,
      email:      twitterUser.email              || '',
      name:       twitterUser.name               || 'Twitter User',
      avatar:     twitterUser.profile_image_url  || '',
    };
  } catch (err) {
    if (err.response) {
      const detail = err.response.data?.detail || err.response.data?.title || 'invalid token';
      throw new Error(`Twitter token verification failed: ${detail}`);
    }
    throw err;
  }
};

/**
 * Verify a Microsoft (Outlook / Azure AD) user access token and return a normalised profile.
 * The token must have the `User.Read` Microsoft Graph scope.
 *
 * @param {string} token - Microsoft OAuth 2.0 user access token received from the client
 * @returns {Promise<{providerId: string, email: string, name: string, avatar: string}>}
 * @throws {Error} If the token is invalid or the Microsoft Graph endpoint returns an error
 */
const verifyOutlookToken = async (token) => {
  try {
    const { data } = await axios.get('https://graph.microsoft.com/v1.0/me', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!data.id) {
      throw new Error('Invalid Outlook token: missing user ID');
    }

    // Microsoft Graph returns email in `mail` or falls back to `userPrincipalName`
    const email = data.mail || data.userPrincipalName || '';

    return {
      providerId: data.id,
      email,
      name:   data.displayName || email || 'Outlook User',
      avatar: '',  // Profile photo requires a separate Graph API call
    };
  } catch (err) {
    if (err.response) {
      const detail = err.response.data?.error?.message || err.response.data?.error?.code || 'invalid token';
      throw new Error(`Outlook token verification failed: ${detail}`);
    }
    throw err;
  }
};

module.exports = { verifyGoogleToken, verifyFacebookToken, verifyTwitterToken, verifyOutlookToken };
