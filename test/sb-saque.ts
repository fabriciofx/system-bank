const api = 'https://aula-angular.bcorp.tec.br/api';
const urlAuth = `${api}/token/`;

async function authenticate(url: string): Promise<any> {
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

async function saque(
  conta: number,
  valor: number,
  access: string
): Promise<any> {
  try {
    const url = `${api}/contas/${conta}/saque/`;
    console.log(`url: ${url}`);
    const response = await fetch(
      url,
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access}`
        },
        body: JSON.stringify({
          conta: conta,
          valor: valor
        })
      }
    );
    if (response.ok) {
      return response.json();
    } else {
      const text = await response.text();
      return `(${response.status}): ${response.statusText}: ${text}`;
    }
  } catch(error) {
    throw new Error("Error: " + error);
  }
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const auth = await authenticate(urlAuth);
  const response = await saque(Number(args[0]), Number(args[1]), auth.access);
  console.log(response);
}

main();
