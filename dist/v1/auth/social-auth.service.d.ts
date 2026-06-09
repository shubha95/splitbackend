export interface SocialProfile {
    providerId: string;
    email: string;
    name: string;
    avatar: string;
}
export declare class SocialAuthService {
    verifyGoogleToken(token: string): Promise<SocialProfile>;
    verifyFacebookToken(token: string): Promise<SocialProfile>;
    verifyTwitterToken(token: string): Promise<SocialProfile>;
    verifyOutlookToken(token: string): Promise<SocialProfile>;
}
