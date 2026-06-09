import { Injectable } from '@nestjs/common';
import axios from 'axios';

export interface SocialProfile {
  providerId: string;
  email: string;
  name: string;
  avatar: string;
}

@Injectable()
export class SocialAuthService {
  /**
   * Verify a Google ID token via Google's tokeninfo endpoint.
   * @param token - Google ID token from the client
   * @returns Normalised social profile
   * @throws Error if the token is invalid or expired
   */
  async verifyGoogleToken(token: string): Promise<SocialProfile> {
    try {
      const { data } = await axios.get('https://oauth2.googleapis.com/tokeninfo', {
        params: { id_token: token },
      });

      if (!data.sub) throw new Error('Invalid Google token: missing subject identifier');

      return {
        providerId: data.sub,
        email:      data.email   || '',
        name:       data.name    || data.email || 'Google User',
        avatar:     data.picture || '',
      };
    } catch (err: any) {
      if (err.response) {
        const detail =
          err.response.data?.error_description ||
          err.response.data?.error ||
          'invalid token';
        throw new Error(`Google token verification failed: ${detail}`);
      }
      throw err;
    }
  }

  /**
   * Verify a Facebook user access token.
   * @param token - Facebook user access token from the client
   * @returns Normalised social profile
   * @throws Error if the token is invalid
   */
  async verifyFacebookToken(token: string): Promise<SocialProfile> {
    try {
      const { data } = await axios.get('https://graph.facebook.com/me', {
        params: { fields: 'id,name,email,picture', access_token: token },
      });

      if (!data.id) throw new Error('Invalid Facebook token: missing user ID');

      return {
        providerId: data.id,
        email:      data.email                || '',
        name:       data.name                 || 'Facebook User',
        avatar:     data.picture?.data?.url   || '',
      };
    } catch (err: any) {
      if (err.response) {
        throw new Error(
          `Facebook token verification failed: ${err.response.data?.error?.message || 'invalid token'}`,
        );
      }
      throw err;
    }
  }

  /**
   * Verify a Twitter (X) OAuth 2.0 user access token.
   * Requires users.read scope on the token.
   * @param token - Twitter OAuth 2.0 user access token from the client
   * @returns Normalised social profile
   * @throws Error if the token is invalid
   */
  async verifyTwitterToken(token: string): Promise<SocialProfile> {
    try {
      const { data } = await axios.get('https://api.twitter.com/2/users/me', {
        headers: { Authorization: `Bearer ${token}` },
        params:  { 'user.fields': 'id,name,profile_image_url' },
      });

      const twitterUser = data.data;
      if (!twitterUser?.id) throw new Error('Invalid Twitter token: missing user data');

      return {
        providerId: twitterUser.id,
        email:      twitterUser.email             || '',
        name:       twitterUser.name              || 'Twitter User',
        avatar:     twitterUser.profile_image_url || '',
      };
    } catch (err: any) {
      if (err.response) {
        const detail =
          err.response.data?.detail || err.response.data?.title || 'invalid token';
        throw new Error(`Twitter token verification failed: ${detail}`);
      }
      throw err;
    }
  }

  /**
   * Verify a Microsoft (Outlook / Azure AD) user access token via Microsoft Graph.
   * Requires User.Read scope on the token.
   * @param token - Microsoft OAuth 2.0 user access token from the client
   * @returns Normalised social profile
   * @throws Error if the token is invalid
   */
  async verifyOutlookToken(token: string): Promise<SocialProfile> {
    try {
      const { data } = await axios.get('https://graph.microsoft.com/v1.0/me', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!data.id) throw new Error('Invalid Outlook token: missing user ID');

      const email = data.mail || data.userPrincipalName || '';

      return {
        providerId: data.id,
        email,
        name:   data.displayName || email || 'Outlook User',
        avatar: '',
      };
    } catch (err: any) {
      if (err.response) {
        const detail =
          err.response.data?.error?.message ||
          err.response.data?.error?.code ||
          'invalid token';
        throw new Error(`Outlook token verification failed: ${detail}`);
      }
      throw err;
    }
  }
}
