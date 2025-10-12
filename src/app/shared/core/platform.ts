import { isPlatformBrowser, isPlatformServer } from "@angular/common";
import { inject, Injectable, PLATFORM_ID } from "@angular/core";

export interface Platform {
  browser(): boolean;
  server(): boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DefaultPlatform implements Platform {
  private readonly platformId = inject(PLATFORM_ID);

  constructor() {
  }

  browser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  server(): boolean {
    return isPlatformServer(this.platformId);
  }
}

export class FakePlatform implements Platform {
  private readonly _browser: boolean;
  private readonly _server: boolean;

  constructor(browser: boolean, server: boolean) {
    this._browser = browser;
    this._server = server;
  }

  browser(): boolean {
    return this._browser;
  }

  server(): boolean {
    return this._server;
  }
}
