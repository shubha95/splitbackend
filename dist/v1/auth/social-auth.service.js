"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialAuthService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
let SocialAuthService = class SocialAuthService {
    async verifyGoogleToken(token) {
        try {
            const { data } = await axios_1.default.get('https://oauth2.googleapis.com/tokeninfo', {
                params: { id_token: token },
            });
            if (!data.sub)
                throw new Error('Invalid Google token: missing subject identifier');
            return {
                providerId: data.sub,
                email: data.email || '',
                name: data.name || data.email || 'Google User',
                avatar: data.picture || '',
            };
        }
        catch (err) {
            if (err.response) {
                const detail = err.response.data?.error_description ||
                    err.response.data?.error ||
                    'invalid token';
                throw new Error(`Google token verification failed: ${detail}`);
            }
            throw err;
        }
    }
    async verifyFacebookToken(token) {
        try {
            const { data } = await axios_1.default.get('https://graph.facebook.com/me', {
                params: { fields: 'id,name,email,picture', access_token: token },
            });
            if (!data.id)
                throw new Error('Invalid Facebook token: missing user ID');
            return {
                providerId: data.id,
                email: data.email || '',
                name: data.name || 'Facebook User',
                avatar: data.picture?.data?.url || '',
            };
        }
        catch (err) {
            if (err.response) {
                throw new Error(`Facebook token verification failed: ${err.response.data?.error?.message || 'invalid token'}`);
            }
            throw err;
        }
    }
    async verifyTwitterToken(token) {
        try {
            const { data } = await axios_1.default.get('https://api.twitter.com/2/users/me', {
                headers: { Authorization: `Bearer ${token}` },
                params: { 'user.fields': 'id,name,profile_image_url' },
            });
            const twitterUser = data.data;
            if (!twitterUser?.id)
                throw new Error('Invalid Twitter token: missing user data');
            return {
                providerId: twitterUser.id,
                email: twitterUser.email || '',
                name: twitterUser.name || 'Twitter User',
                avatar: twitterUser.profile_image_url || '',
            };
        }
        catch (err) {
            if (err.response) {
                const detail = err.response.data?.detail || err.response.data?.title || 'invalid token';
                throw new Error(`Twitter token verification failed: ${detail}`);
            }
            throw err;
        }
    }
    async verifyOutlookToken(token) {
        try {
            const { data } = await axios_1.default.get('https://graph.microsoft.com/v1.0/me', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!data.id)
                throw new Error('Invalid Outlook token: missing user ID');
            const email = data.mail || data.userPrincipalName || '';
            return {
                providerId: data.id,
                email,
                name: data.displayName || email || 'Outlook User',
                avatar: '',
            };
        }
        catch (err) {
            if (err.response) {
                const detail = err.response.data?.error?.message ||
                    err.response.data?.error?.code ||
                    'invalid token';
                throw new Error(`Outlook token verification failed: ${detail}`);
            }
            throw err;
        }
    }
};
exports.SocialAuthService = SocialAuthService;
exports.SocialAuthService = SocialAuthService = __decorate([
    (0, common_1.Injectable)()
], SocialAuthService);
//# sourceMappingURL=social-auth.service.js.map