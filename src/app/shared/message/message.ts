import Swal from "sweetalert2";
import { SbError } from "../error/sb-error";

export interface Message {
  show(): void;
}

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
  private readonly error: SbError;

  constructor(title: string, message: string, error: SbError) {
    this.title = title;
    this.message = message;
    this.error = error;
  }

  show(): void {
    Swal.fire({
      icon: 'error',
      title: this.title,
      text: this.message,
      html: this.error.html()
    });
  }
}
