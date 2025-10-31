const api = 'https://aula-angular.bcorp.tec.br/api';
const authApi = `${api}/token/`;
const refreshApi = `${api}/token/refresh/`;

type AuthTokens = {
  access: string;
  refresh: string;
};

async function authenticate(url: string): Promise<AuthTokens> {
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
      throw new Error(response.statusText);
    }
  } catch (error) {
    throw new Error(`Error: ${error}`);
  }
}

async function refresh(
  url: string,
  token: string
): Promise<{ refresh: string }> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refresh: token })
    });
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(response.statusText);
    }
  } catch (error) {
    throw new Error(`Error: ${error}`);
  }
}

async function main(): Promise<void> {
  const auth = await authenticate(authApi);
  console.log(auth);
  const response = await refresh(refreshApi, auth.refresh);
  console.log(response);
}

main();
