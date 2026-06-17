export declare class PresenceService {
    private readonly sockets;
    add(userId: string, socketId: string): boolean;
    remove(userId: string, socketId: string): boolean;
    isOnline(userId: string): boolean;
}
