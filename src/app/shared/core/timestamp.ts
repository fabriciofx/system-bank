export interface Timestamp {
  add(duration: string): Timestamp;
  value(): number;
}

export class TimestampOf {
  private readonly time: number;

  constructor(time: number) {
    this.time = time;
  }

  add(duration: string): Timestamp {
    const match = duration.match(/^(\d+)([smhd])$/);
    if (!match) {
      throw new Error('Invalid format. Use 1h, 30m, 45s, 2d etc.');
    }
    const value = parseInt(match[1], 10);
    const unit = match[2];
    let result;
    switch (unit) {
      case 's':
        result = new TimestampOf(this.time + value);
        break;
      case 'm':
        result = new TimestampOf(this.time + value * 60);
        break;
      case 'h':
        result = new TimestampOf(this.time + value * 3600);
        break;
      case 'd':
        result = new TimestampOf(this.time + value * 86400);
        break;
      default:
        throw new Error('Invalid unit.');
    }
    return result;
  }

  value(): number {
    return this.time;
  }
}

export class TimestampFromDate implements Timestamp {
  private readonly timestamp: Timestamp;

  constructor(date: Date = new Date()) {
    this.timestamp = new TimestampOf(Math.floor(date.getTime() / 1000));
  }

  add(duration: string): Timestamp {
    return this.timestamp.add(duration);
  }

  value(): number {
    return this.timestamp.value();
  }
}
