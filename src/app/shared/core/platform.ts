import { isPlatformBrowser, isPlatformServer } from "@angular/common";
import { InjectionToken, PLATFORM_ID } from "@angular/core";

export class Platform {
  private readonly platformId: InjectionToken<Object>;

  constructor(token: InjectionToken<Object> = PLATFORM_ID) {
    this.platformId = token;
  }

  browser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  server(): boolean {
    return isPlatformServer(this.platformId);
  }
}
