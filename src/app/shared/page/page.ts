export class Page {
  private readonly content: string

  constructor(content: string) {
    this.content = content;
  }

  isHtml(): boolean {
    return /<\/?[a-z][\w-]*\b[^>]*>/i.test(this.content);
  }
}
