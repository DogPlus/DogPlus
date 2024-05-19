import { PublicUser } from "./user";

export interface FriendRequest {
  id: number;
  follower: PublicUser;
  followed: PublicUser;
  is_accepted: boolean;
  created_at: string;
}
