import { Injectable } from '@nestjs/common';

// In-memory presence tracking. Multi-device aware — a user is offline only
// when their last socket disconnects. Compatible with a future Redis adapter
// because no socket object references are stored here, only IDs.
@Injectable()
export class PresenceService {
  private readonly sockets = new Map<string, Set<string>>();

  // Returns true if this is the user's first connection (just came online)
  add(userId: string, socketId: string): boolean {
    if (!this.sockets.has(userId)) this.sockets.set(userId, new Set());
    const set         = this.sockets.get(userId)!;
    const wasOffline  = set.size === 0;
    set.add(socketId);
    return wasOffline;
  }

  // Returns true if this was the user's last socket (just went offline)
  remove(userId: string, socketId: string): boolean {
    const set = this.sockets.get(userId);
    if (!set) return false;
    set.delete(socketId);
    if (set.size === 0) this.sockets.delete(userId);
    return set.size === 0;
  }

  isOnline(userId: string): boolean {
    return (this.sockets.get(userId)?.size ?? 0) > 0;
  }
}
