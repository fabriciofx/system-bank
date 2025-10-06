import { Page } from "../page/page";

export class SbError {
  private readonly error: any;

  constructor(error: any) {
    this.error = error;
  }

  menssages(): string[] {
    const errors = this.error?.error;
    const messages: string[] = [];
    for (const attr in errors) {
      if (errors.hasOwnProperty(attr)) {
        const msgs = errors[attr];
        if (Array.isArray(msgs)) {
          for (const msg of msgs) {
            messages.push(`${attr}: ${msg}`);
          }
        } else if (typeof msgs === 'string') {
          if (!new Page(msgs).is_html()) {
            messages.push(`${attr}: ${msgs}`);
          }
        }
      }
    }
    return messages;
  }

  html(): string {
    return `<ul style="text-align: left;">${this.menssages().map(msg => `<li>${msg}</li>`).join('')}</ul>`;
  }
}
