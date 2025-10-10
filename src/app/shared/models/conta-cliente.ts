import { Text } from '../custom/text';
import { Cliente } from "./cliente";

export interface ContaCliente extends Text {
  id?: number;
  cliente: Cliente | undefined;
  numero: string;
  agencia: string;
  saldo: number;
}

export class ContaClienteDe implements ContaCliente {
  id!: number;
  cliente!: Cliente;
  numero!: string;
  agencia!: string;
  saldo!: number;

  constructor(json: any) {
    Object.assign(this, json);
  }

  asString(): string {
    return `${this.cliente.nome} (${this.numero})`;
  }
}
