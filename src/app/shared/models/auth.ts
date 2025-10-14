export interface Credentials {
  username: string;
  password: string;
  valid(): boolean;
}

export interface AccessToken {
  access: string;
  valid(): boolean;
}

export interface RefreshToken {
  refresh: string;
  valid(): boolean;
}

export interface AuthTokens extends AccessToken, RefreshToken {
  valid(): boolean;
}

export class CredentialsOf implements Credentials {
  username: string;
  password: string;

  constructor({ username, password }: { username: string; password: string }) {
    this.username = username;
    this.password = password;
  }

  valid(): boolean {
    return !!this.username && !!this.password;
  }
}

export class AccessTokenOf implements AccessToken {
  access: string;

  constructor(access: string) {
    this.access = access;
  }

  valid(): boolean {
    return !!this.access;
  }
}

export class RefreshTokenOf implements RefreshToken {
  refresh: string;

  constructor(refresh: string) {
    this.refresh = refresh;
  }

  valid(): boolean {
    return !!this.refresh;
  }
}

export class AuthTokensOf implements AuthTokens {
  access: string;
  refresh: string;

  constructor(access: string, refresh: string) {
    this.access = access;
    this.refresh = refresh;
  }

  valid(): boolean {
    return !!this.access && !!this.refresh;
  }
}
