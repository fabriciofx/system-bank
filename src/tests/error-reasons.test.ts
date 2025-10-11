/// <reference types="jest" />
import { readFileSync } from "fs";
import { join } from "path";
import { Reason } from "../app/shared/custom/error-reasons";

describe('ErrorReasons', () => {
  it('Must check if text is an html page (with DOCTYPE)', () => {
    const html = readFileSync(
      join(__dirname, 'resources/error1.html'),
      'utf-8'
    );
    expect(new Reason(html).isHtml()).toBeTruthy();
  });

  it('Must check if text is an html page (without DOCTYPE)', () => {
    const html = readFileSync(
      join(__dirname, 'resources/error2.html'),
      'utf-8'
    );
    expect(new Reason(html).isHtml()).toBeTruthy();
  });

  it('Must check if text is not an html page', () => {
    expect(new Reason("hello world!").isHtml()).toBeFalsy();
  });
});
