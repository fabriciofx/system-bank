export class ErrorReasons {
  private readonly error: any;

  constructor(error: any) {
    this.error = error;
  }

  content(): string[] {
    const error = this.error?.error;
    const reasons: string[] = [];
    for (const attr in error) {
      if (error.hasOwnProperty(attr)) {
        const reason = error[attr];
        if (Array.isArray(reason)) {
          for (const msg of reason) {
            reasons.push(`${attr}: ${msg}`);
          }
        } else if (typeof reason === 'string') {
          if (!new Reason(reason).isHtml()) {
            reasons.push(`${attr}: ${reason}`);
          }
        }
      }
    }
    return reasons;
  }

  asHtml(): string {
    return `<ul style="text-align: left;">${this.content().map(msg => `<li>${msg}</li>`).join('')}</ul>`;
  }
}

class Reason {
  private readonly text: string

  constructor(text: string) {
    this.text = text;
  }

  isHtml(): boolean {
    return /<\/?[a-z][\w-]*\b[^>]*>/i.test(this.text);
  }
}
