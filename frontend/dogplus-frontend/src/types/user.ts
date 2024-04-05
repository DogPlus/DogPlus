export interface UserData {
  username: string;
  email: string;
  password: string;
  registerAsServiceProvider: boolean;
  serviceProviderKey?: string; // The '?' makes it optional
}
