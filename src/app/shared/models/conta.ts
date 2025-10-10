import { Text } from '../custom/text';

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

  constructor(json: any) {
    Object.assign(this, json);
  }

  asString(): string {
    return `${this.numero}`;
  }
}
