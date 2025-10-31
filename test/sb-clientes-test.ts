const urlBase = 'https://aula-angular.bcorp.tec.br/api';
const urlAuth = `${urlBase}/token/`;

type AuthTokens = {
  refresh: string;
  access: string;
};

type Cliente = {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  observacoes: string;
  ativo: boolean;
};

async function authenticate(url: string): Promise<AuthTokens | undefined> {
  try {
    const auth = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'admin',
        password: '12345678'
      })
    });
    if (auth.ok) {
      return auth.json();
    }
  } catch (error) {
    throw new Error(`Error: ${error}`);
  }
}

async function clientesPaginated(
  access: string,
  page: number,
  size: number
): Promise<Cliente[] | undefined> {
  const url = `${urlBase}/clientes/?page=${page}&pageSize=${size}`;
  try {
    const auth = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access}`
      }
    });
    if (auth.ok) {
      return auth.json();
    }
  } catch (error) {
    throw new Error(`Error: ${error}`);
  }
}

async function main(): Promise<void> {
  const auth = await authenticate(urlAuth);
  if (auth) {
    const clientes = await clientesPaginated(auth.access, 1, 10000);
    console.log(clientes);
  }
}

main();
