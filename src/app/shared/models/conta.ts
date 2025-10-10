import { Text } from '../custom/text';

export interface Conta extends Text {
  id?: number;
  cliente: number;
  numero: string;
  agencia: string;
  saldo: number;
}

export class ContaDe implements Conta {
  id?: number;
  cliente!: number;
  numero!: string;
  agencia!: string;
  saldo!: number;

  constructor(json: any) {
    Object.assign(this, json);
  }

  asString(): string {
    return `${this.numero}`;
  }
}
