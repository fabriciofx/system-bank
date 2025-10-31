const api = 'https://aula-angular.bcorp.tec.br/api';
const urlAuth = `${api}/token/`;

type AuthTokens = {
  refresh: string;
  access: string;
};

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

// biome-ignore lint/suspicious/noExplicitAny: I don't know the return type
async function consulta(url: string, access: string): Promise<any> {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access}`
      }
    });
    if (response.ok) {
      return response.json();
    } else {
      return response.statusText;
    }
  } catch (error) {
    throw new Error(`Error: ${error}`);
  }
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const auth = await authenticate(urlAuth);
  if (auth) {
    const response = await consulta(args[0], auth.access);
    console.log(response);
  }
}

main();
