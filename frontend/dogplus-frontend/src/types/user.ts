export interface UserData {
  id: string;
  username: string;
  email: string;
  password: string;
  registerAsServiceProvider: boolean;
  role: UserRole;
  serviceProviderKey?: string;
}

export enum UserRole {
  User = 1,
  ServiceProvider = 2,
  Admin = 3,
}
