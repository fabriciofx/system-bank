import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// biome-ignore lint/complexity/noStaticOnlyClass: It's a validator
export class Cpf {
  static validator: ValidatorFn = (
    control: AbstractControl<string>
  ): ValidationErrors | null => {
    const cpf = control.value?.replace(/\D/g, '');
    if (!cpf || cpf.length !== 11) {
      return { cpf: 'CPF inválido: verifique a quantidade de dígitos' };
    }
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf[i], 10) * (10 - i);
    }
    let check1 = (sum * 10) % 11;
    if (check1 === 10) {
      check1 = 0;
    }
    if (check1 !== parseInt(cpf[9], 10)) {
      return { cpf: 'CPF inválido: verifique se os dígitos estão corretos' };
    }
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf[i], 10) * (11 - i);
    }
    let check2 = (sum * 10) % 11;
    if (check2 === 10) {
      check2 = 0;
    }
    if (check2 !== parseInt(cpf[10], 10)) {
      return { cpf: 'CPF inválido: verifique se os dígitos estão corretos' };
    }
    return null;
  };
}
