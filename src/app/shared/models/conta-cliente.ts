import { Cliente } from "./cliente";

export interface ContaCliente {
  id?: number;
  cliente: Cliente | undefined;
  numero: string;
  agencia: string;
  saldo: number;
}
