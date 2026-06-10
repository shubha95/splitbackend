export interface CurrentUserPayload {
    id: string;
    userName: string;
    emailId: string;
    token: string;
}
export declare const CurrentUser: (...dataOrPipes: unknown[]) => ParameterDecorator;
