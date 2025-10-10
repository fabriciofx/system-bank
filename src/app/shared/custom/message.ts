import Swal from "sweetalert2";
import { ErrorReasons } from "./error-reasons";

export class SuccessMessage {
  private readonly title: string;
  private readonly message: string;

  constructor(title: string, message: string) {
    this.title = title;
    this.message = message;
  }

  show(): void {
    Swal.fire({
      icon: 'success',
      title: this.title,
      text: this.message,
      showConfirmButton: false,
      timer: 1500
    });
  }
}

export class ErrorMessage {
  private readonly title: string;
  private readonly message: string;
  private readonly reasons?: ErrorReasons;

  constructor(title: string, message: string, reasons?: ErrorReasons) {
    this.title = title;
    this.message = message;
    this.reasons = reasons;
  }

  show(): void {
    if (this.reasons) {
      Swal.fire({
        icon: 'error',
        title: this.title,
        html: `<p>${this.message}</p>${this.reasons.asHtml()}`
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: this.title,
        text: this.message
      });
    }
  }
}

export class ConfirmMessage {
  private readonly title: string;
  private readonly message: string;
  private readonly buttonText: string;

  constructor(title: string, message: string, buttonText: string) {
    this.title = title;
    this.message = message;
    this.buttonText = buttonText;
  }

  show(): Promise<any> {
    return Swal.fire({
      icon: 'warning',
      title: this.title,
      text: this.message,
      showCancelButton: true,
      confirmButtonColor: 'red',
      cancelButtonColor: 'grey',
      confirmButtonText: this.buttonText,
    });
  }
}
