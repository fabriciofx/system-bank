const urlBase2 = 'https://aula-angular.bcorp.tec.br/api';
const urlAuth2 = `${urlBase2}/token/`;

async function authenticate2(url: string): Promise<any> {
  try {
    const response = await fetch(
      url,
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: 'admin',
          password: '12345678'
        })
      }
    );
    if (response.ok) {
      return response.json();
    } else {
      return response.statusText;
    }
  } catch(error) {
    throw new Error("Error: " + error);
  }
}

async function contasPaginated(
  access: string,
  refresh: string,
  page: number,
  size: number
): Promise<any> {
  const url = `${urlBase2}/contas/?page=${page}&pageSize=${size}`;
  try {
    const response = await fetch(
      url,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access}`
        }
      }
    );
    if (response.ok) {
      return response.json();
    } else {
      return response.statusText;
    }
  } catch(error) {
    throw new Error("Error: " + error);
  }
}

export interface Conta {
  id?: number;
  cliente: number;
  numero: string;
  agencia: string;
  saldo: number;
}

async function cadastra(access: string, conta: Conta) {
  try {
    const response = await fetch(
      `${urlBase2}/contas/`,
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access}`
        },
        body: JSON.stringify(conta)
      }
    );
    if (response.ok) {
      return response.json();
    } else {
      const text = await response.text();
      return `Erro ${response.statusText}: ${text}`;
    }
  } catch(error) {
    throw new Error("Error: " + error);
  }
}

async function main2(): Promise<void> {
  const auth = await authenticate2(urlAuth2);
  const conta = await cadastra(auth.access, {
    numero: '123457',
    cliente: 35,
    agencia: '123456',
    saldo: 1000
  });
  console.log(conta);
  const contas = await contasPaginated(auth.access, auth.refresh, 1, 10000);
  console.log(contas);
}

main2();
