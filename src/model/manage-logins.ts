class UserLoginInfo {
    loginProvider: string;
    providerKey: string;
}

export class UserLogiAuthenticationDescriptionnInfo {
    authenticationScheme: string;
    displayName: string;
}

export class ManageLogins {
    currentLogins: Array<UserLoginInfo>;
    otherLogins: Array<UserLogiAuthenticationDescriptionnInfo>;    
}