export interface Random<T> {
  value(): T;
}

export class RandomString implements Random<string> {
  private readonly length: number;

  constructor(length: number) {
    this.length = length;
  }

  value(): string {
    // eslint-disable-next-line max-len
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const array = new Uint8Array(this.length);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => chars[byte % chars.length]).join('');
  }
}
