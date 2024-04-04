export interface UserData {
  email: string;
  password: string;
  registerAsServiceProvider: boolean;
  serviceProviderKey?: string; // The '?' makes it optional
}
