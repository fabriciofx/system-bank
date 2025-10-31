const api = 'https://aula-angular.bcorp.tec.br/api';
const urlAuth = `${api}/token/`;

type AuthTokens = {
  refresh: string;
  access: string;
};

async function authenticate(url: string): Promise<AuthTokens | string> {
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
    } else {
      return response.statusText;
    }
  } catch (error) {
    throw new Error(`Error: ${error}`);
  }
}
async function main(): Promise<void> {
  const auth = await authenticate(urlAuth);
  console.log(auth);
}

main();
