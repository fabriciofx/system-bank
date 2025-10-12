export interface Auth {
    username: string;
    password: string;
}

export interface AccessToken {
  access: string;
}

export interface AuthTokens extends AccessToken {
  refresh: string;
}
