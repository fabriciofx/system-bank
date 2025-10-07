const urlBase = 'https://aula-angular.bcorp.tec.br/api';
const urlAuth = `${urlBase}/token/`;

async function authenticate(url: string): Promise<any> {
  try {
    const auth = await fetch(
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
    if (auth.ok) {
      return auth.json();
    }
  } catch(error) {
    throw new Error("Error: " + error);
  }
}

async function clientesPaginated(
  access: string,
  refresh: string,
  page: number,
  size: number
): Promise<any> {
  const url = `${urlBase}/clientes/?page=${page}&pageSize=${size}`;
  try {
    const auth = await fetch(
      url,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access}`
        }
      }
    );
    if (auth.ok) {
      return auth.json();
    }
  } catch(error) {
    throw new Error("Error: " + error);
  }
}

async function main(): Promise<void> {
  const auth = await authenticate(urlAuth);
  const clientes = await clientesPaginated(auth.access, auth.refresh, 1, 10000);
  console.log(clientes);
}

main();
