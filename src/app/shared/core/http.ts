import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, Observable, switchMap, throwError } from "rxjs";
import { AuthTokens, Credentials } from "../models/auth";

export type Header = Record<string, string>;

export interface Headers {
  add(header: Header): void;
  records(): Record<string, string>;
}

export class Empty implements Headers {
  private readonly content: Header[];

  constructor() {
    this.content = [];
  }

  add(header: Header): void {
    this.content.push(header);
  }

  records(): Record<string, string> {
    return Object.assign({}, ...this.content);
  }
}

export class ContentType implements Headers {
  private readonly origin: Headers;
  private readonly type: string;

  constructor(headers: Headers, type = 'application/json') {
    this.origin = headers;
    this.type = type;
  }

  add(header: Header): void {
    this.origin.add(header);
  }

  records(): Record<string, string> {
    this.add({ 'Content-Type':  this.type });
    return this.origin.records();
  }
}

export class Authorization implements Headers {
  private readonly origin: Headers;
  private readonly tokens: AuthTokens;

  constructor(headers: Headers, tokens: AuthTokens) {
    this.origin = headers;
    this.tokens = tokens;
  }

  add(header: Header): void {
    this.origin.add(header);
  }

  records(): Record<string, string> {
    this.add({ 'Authorization': `Bearer ${this.tokens.access}` });
    return this.origin.records();
  }
}

export interface Request<T> {
  send(headers: Headers): Response<T>;
  http(): HttpClient;
}

export interface Response<T> {
  value(): Observable<T>;
}

export class ObservableResponse<T> implements Response<T> {
  private readonly result: Observable<T>;

  constructor(result: Observable<T>) {
    this.result = result;
  }

  value(): Observable<T> {
    return this.result;
  }
}

export class Get<T> implements Request<T> {
  private readonly client: HttpClient;
  private readonly url: string;

  constructor(
    client: HttpClient,
    url: string
  ) {
    this.client = client;
    this.url = url;
  }

  send(headers: Headers): Response<T> {
    const response = this.client.get<T>(
      this.url,
      { headers: headers.records() }
    );
    return new ObservableResponse<T>(response);
  }

  http(): HttpClient {
    return this.client;
  }
}

export class Post<X, Y> implements Request<Y> {
  private readonly client: HttpClient;
  private readonly url: string;
  private readonly body: X;

  constructor(
    client: HttpClient,
    url: string,
    body: X
  ) {
    this.client = client;
    this.url = url;
    this.body = body;
  }

  send(headers: Headers): Response<Y> {
    const response = this.client.post<Y>(
      this.url,
      this.body,
      { headers: headers.records() }
    );
    return new ObservableResponse<Y>(response);
  }

  http(): HttpClient {
    return this.client;
  }
}

export class Authenticated<T> implements Request<T> {
  private readonly origin: Request<T>;
  private readonly credentials: Credentials;
  private readonly url: string;

  constructor(
    origin: Request<T>,
    credentials: Credentials,
    url = 'https://aula-angular.bcorp.tec.br/api/token/'
  ) {
    this.origin = origin;
    this.credentials = credentials;
    this.url = url;
  }

  send(headers: Headers): Response<T> {
    const original = this.origin.send(headers).value();
    const authenticated = original.pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status !== 401) {
          return throwError(() => error);
        }
        const login = new Post<Credentials, AuthTokens>(
          this.origin.http(),
          this.url,
          this.credentials
        ).send(headers).value();
        return login.pipe(
          switchMap((tokens: AuthTokens) => {
            return this.origin.send(new Authorization(headers, tokens)).value();
          })
        );
      })
    );
    return new ObservableResponse(authenticated);
  }

  http(): HttpClient {
    return this.origin.http();
  }
}
