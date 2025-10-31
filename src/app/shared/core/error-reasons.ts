import { HttpErrorResponse } from '@angular/common/http';

export class ErrorReasons {
  private readonly error: HttpErrorResponse;

  constructor(error: HttpErrorResponse) {
    this.error = error;
  }

  reasons(): string[] {
    const others = this.error.error;
    const reasons: string[] = [];
    if (others.detail) {
      reasons.push(others.detail);
    } else {
      for (const attr in others) {
        if (Reflect.has(others, attr)) {
          const reason = others[attr];
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
    }
    return reasons;
  }

  asHtml(): string {
    return `<ul style="text-align: left;">
      ${this.reasons()
        .map((msg) => `<li>${msg}</li>`)
        .join('')}
      </ul>`;
  }
}

export class Reason {
  private readonly text: string;

  constructor(text: string) {
    this.text = text;
  }

  isHtml(): boolean {
    return /^(\s*<!DOCTYPE html>\s*)?<html[\s\S]*<\/html>\s*$/i.test(this.text);
  }
}
