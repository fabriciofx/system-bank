import Base64 from 'crypto-js/enc-base64.js';
import Utf8 from 'crypto-js/enc-utf8.js';
import HmacSHA256 from 'crypto-js/hmac-sha256.js';
import { Timestamp, TimestampFromDate } from '../core/timestamp';
import { RandomString } from './random';
import { Uuidv4 } from './uuidv4';

export class Jwt {
  private readonly message: string;
  private readonly subject: string;
  private readonly name: string;
  private readonly secret: string;
  private readonly timestamp: Timestamp;

  constructor(
    message: string = new RandomString(5).value(),
    subject: string = new Uuidv4().value(),
    name: string = new Uuidv4().value(),
    secret: string = new Uuidv4().value(),
    timestamp: Timestamp = new TimestampFromDate()
  ) {
    this.message = message;
    this.subject = subject;
    this.name = name;
    this.secret = secret;
    this.timestamp = timestamp;
  }

  value(): string {
    const header = new Base64Url({ alg: 'HS256', typ: 'JWT' }).encode();
    const payload = new Base64Url({
      sub: this.subject,
      name: this.name,
      iat: this.timestamp.value(),
      message: this.message
    }).encode();
    const data = `${header}.${payload}`;
    const hash = HmacSHA256(data, this.secret);
    const signature: string = Base64.stringify(hash)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    return `${data}.${signature}`;
  }
}

class Base64Url {
  private readonly content: object;

  constructor(content: object) {
    this.content = content;
  }

  encode(): string {
    return Base64.stringify(Utf8.parse(JSON.stringify(this.content)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }
}
