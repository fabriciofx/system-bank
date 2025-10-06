export class Page {
  private readonly content: string

  constructor(content: string) {
    this.content = content;
  }

  is_html(): boolean {
    return /<\/?[a-z][\w-]*\b[^>]*>/i.test(this.content);
  }
}
