import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

export type Header = Record<string, string>;

export class Headers {
  private readonly content: Header[];

  constructor(...headers: Header[]) {
    this.content = headers;
  }

  add(header: Header): void {
    this.content.push(header);
  }

  all(): Record<string, string> {
    return Object.assign({}, ...this.content);
  }
}

export interface Request<T> {
  send(headers: Headers): Response<T>;
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

  constructor(client: HttpClient, url: string) {
    this.client = client;
    this.url = url;
  }

  send(headers: Headers = new Headers()): Response<T> {
    const response = this.client.get<T>(this.url, { headers: headers.all() });
    return new ObservableResponse<T>(response);
  }
}

export class Post<X, Y> implements Request<Y> {
  private readonly client: HttpClient;
  private readonly url: string;
  private readonly body: X;

  constructor(client: HttpClient, url: string, body: X) {
    this.client = client;
    this.url = url;
    this.body = body;
  }

  send(headers: Headers = new Headers()): Response<Y> {
    const response = this.client.post<Y>(
      this.url,
      this.body,
      { headers: headers.all() }
    );
    return new ObservableResponse<Y>(response);
  }
}

export class Auth<T> implements Request<T> {
  private readonly request: Request<T>;
  private readonly token: string;

  constructor(request: Request<T>, token: string) {
    this.request = request;
    this.token = token;
  }

  send(headers: Headers): Response<T> {
    headers.add({ 'Authorization': `Bearer ${this.token}` });
    return this.request.send(headers);
  }
}

export class ContentType<X, Y> implements Request<Y> {
  private readonly post: Post<X, Y>;
  private readonly type: string;

  constructor(post: Post<X, Y>, type = 'application/json') {
    this.post = post;
    this.type = type;
  }

  send(headers: Headers): Response<Y> {
    headers.add({ 'Content-Type': `${this.type}` });
    return this.post.send(headers);
  }
}
