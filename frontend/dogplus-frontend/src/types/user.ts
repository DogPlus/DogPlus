import { ServiceData } from "./service";

export interface UserData {
  id: string;
  username: string;
  email: string;
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
