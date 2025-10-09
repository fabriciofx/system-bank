const urlBase3 = 'https://aula-angular.bcorp.tec.br/api';
const urlAuth3 = `${urlBase3}/token/`;

async function authenticate3(url: string): Promise<any> {
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

async function consulta(
  url: string,
  access: string
): Promise<any> {
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

async function main3(): Promise<void> {
  const args = process.argv.slice(2);
  const auth = await authenticate3(urlAuth3);
  const response = await consulta(args[0], auth.access);
  console.log(response);
}

main3();
