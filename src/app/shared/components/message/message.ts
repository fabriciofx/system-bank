import Swal, { SweetAlertResult } from 'sweetalert2';
import { ErrorReasons } from '../../core/error-reasons';

export interface Message<T> {
  show(): Promise<T>;
}

export class Answer {
  private readonly result: SweetAlertResult<boolean>;

  constructor(result: SweetAlertResult<boolean>) {
    this.result = result;
  }

  yes(): boolean {
    return this.result.isConfirmed;
  }

  no(): boolean {
    return this.result.isDismissed;
  }
}

export class SuccessMessage implements Message<void> {
  private readonly title: string;
  private readonly message: string;

  constructor(title: string, message: string) {
    this.title = title;
    this.message = message;
  }

  async show(): Promise<void> {
    await Swal.fire<void>({
      icon: 'success',
      title: this.title,
      text: this.message,
      showConfirmButton: false,
      timer: 2000
    });
  }
}

export class ErrorMessage implements Message<void> {
  private readonly title: string;
  private readonly message: string;
  private readonly reasons?: ErrorReasons;

  constructor(title: string, message: string, reasons?: ErrorReasons) {
    this.title = title;
    this.message = message;
    this.reasons = reasons;
  }

  async show(): Promise<void> {
    if (this.reasons) {
      await Swal.fire({
        icon: 'error',
        title: this.title,
        html: `<p>${this.message}</p>${this.reasons.asHtml()}`
      });
    } else {
      await Swal.fire({
        icon: 'error',
        title: this.title,
        text: this.message,
      });
    }
  }
}

export class ConfirmMessage implements Message<Answer> {
  private readonly title: string;
  private readonly message: string;
  private readonly buttonText: string;

  constructor(title: string, message: string, buttonText: string) {
    this.title = title;
    this.message = message;
    this.buttonText = buttonText;
  }

  async show(): Promise<Answer> {
    const result = await Swal.fire<boolean>({
      icon: 'warning',
      title: this.title,
      text: this.message,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonColor: 'grey',
      confirmButtonColor: 'red',
      confirmButtonText: this.buttonText,
    });
    return new Answer(result);
  }
}

export class YesNoMessage implements Message<Answer> {
  private readonly title: string;
  private readonly message: string;

  constructor(title: string, message: string) {
    this.title = title;
    this.message = message;
  }

  async show(): Promise<Answer> {
    const result = await Swal.fire<boolean>({
      icon: 'question',
      title: this.title,
      text: this.message,
      showCancelButton: true,
      cancelButtonColor: 'red',
      cancelButtonText: 'Não',
      showConfirmButton: true,
      confirmButtonColor: 'green',
      confirmButtonText: 'Sim',
    });
    return new Answer(result);
  }
}
