export interface Auth {
    username: string;
    password: string;
}

export interface AuthTokens {
  refresh: string;
  access: string;
}
