export interface ServiceProvider {
    id: string;
    username: string;
    email: string;
    isApproved?: boolean; //this value doesnt affect the user, only admin/superuser, could be excluded
    serviceProviderKey?: string; //this value doesnt affect the user, only admin/superuser, could be excluded
    displayName?: string;
}