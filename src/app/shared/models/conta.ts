import { Text } from '../core/text';

export interface Conta extends Text {
  id?: number;
  cliente: number;
  numero: string;
  agencia: string;
  saldo: string;
}

export class ContaDe implements Conta {
  id?: number;
  cliente!: number;
  numero!: string;
  agencia!: string;
  saldo!: string;

  constructor(json: Partial<Conta>) {
    Object.assign(this, json);
  }

  asString(): string {
    return `${this.numero}`;
  }
}
