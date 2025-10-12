import { FormControl } from '@angular/forms';
import { Cpf } from './cpf';

describe('Cpf.validator', () => {
  it('should return null for empty value', () => {
    const control = new FormControl('');
    expect(Cpf.validator(control)).toEqual({ cpf: false });
  });

  it('should return false for invalid CPF', () => {
    const control = new FormControl('123.456.789-00');
    expect(Cpf.validator(control)).toEqual({ cpf: false });
  });

  it('should return true for valid CPF', () => {
    const control = new FormControl('529.982.247-25');
    expect(Cpf.validator(control)).toEqual({ cpf: true });
  });

  it('should ignore non-digit characters', () => {
    const control = new FormControl('529-982-247.25');
    expect(Cpf.validator(control)).toEqual({ cpf: true });
  });
});
