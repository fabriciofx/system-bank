import { Text } from '../core/text';
import { Cliente } from './cliente';

export interface ContaCliente extends Text {
  id?: number;
  cliente: Cliente | undefined;
  numero: string;
  agencia: string;
  saldo: string;
}

export class ContaClienteDe implements ContaCliente {
  id!: number;
  cliente!: Cliente;
  numero!: string;
  agencia!: string;
  saldo!: string;

  constructor(json: Partial<ContaCliente>) {
    Object.assign(this, json);
  }

  asString(): string {
    return `${this.cliente.nome} (${this.numero})`;
  }
}
