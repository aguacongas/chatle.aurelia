class UserLoginInfo {
    loginProvider: string;
    providerKey: string;
}

class UserLogiAuthenticationDescriptionnInfo {
    authenticationScheme: string;
    droviderKey: string;
}

export class ManageLogins {
    currentLogins: Array<UserLoginInfo>;
    otherLogins: Array<UserLogiAuthenticationDescriptionnInfo>;    
}