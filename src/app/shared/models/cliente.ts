import { Text } from '../custom/text';

export interface Cliente extends Text {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  senha: string;
  ativo: boolean;
  observacoes: string;
}

export class ClienteDe implements Cliente {
  id!: number;
  nome!: string;
  cpf!: string;
  email!: string;
  senha!: string;
  ativo!: boolean;
  observacoes!: string;

  constructor(json: any) {
    Object.assign(this, json);
  }

  asString(): string {
    return `${this.nome} (${this.cpf})`;
  }
}
