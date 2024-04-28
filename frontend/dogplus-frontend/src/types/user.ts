import { ServiceData } from "./service";

export interface PublicUser {
  id: string;
  username: string;
  email: string;
  profile_image: string;
}

export interface UserData extends PublicUser {
  role: UserRole;
  isApproved?: boolean;
}


export interface UserCreationData {
  username: string;
  email: string;
  password: string;
  role: UserRole;
  registerAsServiceProvider: boolean;
  serviceProviderKey?: string;
}
export interface ServiceProviderData extends UserData {
  serviceProviderKey?: string;
  service?: ServiceData;
}

export enum UserRole {
  User = 1,
  ServiceProvider = 2,
  Admin = 3,
}
