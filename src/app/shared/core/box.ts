export interface Box<T> {
  store(item: T): T;
  value(): T;
}

export class BoxOf<T> implements Box<T> {
  private readonly content: T[];

  constructor(item: T) {
    this.content = [ item ];
  }

  store(item: T): T {
    const old = this.content.pop()!;
    this.content.push(item);
    return old;
  }

  value(): T {
    return this.content[0];
  }
}

export class LateBox<T> implements Box<T> {
  private readonly content: T[];

  constructor() {
    this.content = [];
  }

  store(item: T): T {
    const old = this.content.pop();
    if (!old) {
      throw new Error('Box is empty!');
    }
    this.content.push(item);
    return old;
  }

  value(): T {
    const val = this.content[0];
    if (!val) {
      throw new Error('Box is empty!');
    }
    return val;
  }
}
