const urlBase = 'https://aula-angular.bcorp.tec.br/api';
const urlAuth = `${urlBase}/token/`;

type AuthTokens = {
  refresh: string;
  access: string;
};

export interface Conta {
  id?: number;
  cliente: number;
  numero: string;
  agencia: string;
  saldo: number;
}

async function authenticate(url: string): Promise<AuthTokens | undefined> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'admin',
        password: '12345678'
      })
    });
    if (response.ok) {
      return response.json();
    }
  } catch (error) {
    throw new Error(`Error: ${error}`);
  }
}

async function contasPaginated(
  access: string,
  page: number,
  size: number
): Promise<Conta[] | undefined> {
  const url = `${urlBase}/contas/?page=${page}&pageSize=${size}`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access}`
      }
    });
    if (response.ok) {
      return response.json();
    }
  } catch (error) {
    throw new Error(`Error: ${error}`);
  }
}

async function cadastra(access: string, conta: Conta) {
  try {
    const response = await fetch(`${urlBase}/contas/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access}`
      },
      body: JSON.stringify(conta)
    });
    if (response.ok) {
      return response.json();
    } else {
      const text = await response.text();
      return `Erro ${response.statusText}: ${text}`;
    }
  } catch (error) {
    throw new Error(`Error: ${error}`);
  }
}

async function main(): Promise<void> {
  const auth = await authenticate(urlAuth);
  if (!auth) {
    return;
  }
  const conta = await cadastra(auth.access, {
    numero: '123457',
    cliente: 35,
    agencia: '123456',
    saldo: 1000
  });
  console.log(conta);
  const contas = await contasPaginated(auth.access, 1, 10000);
  console.log(contas);
}

main();
