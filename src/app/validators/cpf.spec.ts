import { FormControl } from '@angular/forms';
import { Cpf } from './cpf';

const msg1 = "CPF inválido: verifique a quantidade de dígitos";
const msg2 = "CPF inválido: verifique se os dígitos estão corretos";

describe('Cpf.validator', () => {
  it(`deve retornar '${msg1}' se o valor for vazio`, () => {
    const control = new FormControl(
      '',
      { nonNullable: true, validators: [Cpf.validator] }
    );
    expect(control.errors).toEqual({ cpf: msg1 });
  });

  it(`deve retornar '${msg2}' se o CPF for inválido`, () => {
    const control = new FormControl(
      '123.456.789-00',
      { nonNullable: true, validators: [Cpf.validator] }
    );
    expect(control.errors).toEqual({ cpf: msg2 });
  });

  it("deve retornar null se o CPF for válido", () => {
    const control = new FormControl(
      '529.982.247-25',
      { nonNullable: true, validators: [Cpf.validator] }
    );
    expect(control.errors).toBeNull();
  });

  it("deve ignorar os caracteres que não são dígitos", () => {
    const control = new FormControl(
      '529-982-247.25',
      { nonNullable: true, validators: [Cpf.validator] }
    );
    expect(control.errors).toBeNull();
  });
});
