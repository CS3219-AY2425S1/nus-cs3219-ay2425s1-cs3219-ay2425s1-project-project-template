const USER_SERVICE_URL = process.env.NEXT_PUBLIC_USER_SERVICE_URL

type UserResponseData = {
  "id": string,
  "username": string,
  "email": string,
  "isAdmin": boolean,
  "createdAt": string,
}

function withDefaultHeaders(opts: RequestInit): RequestInit {
  return {
    ...opts,
    headers: {
      ...(opts.headers ?? {}),
      "Content-Type": "application/json"
    },
  }
}

export async function createUser(username: string, email: string, password: string): Promise<void> {
  const opts = withDefaultHeaders({
    method: "POST",
    body: JSON.stringify({
      username, email, password
    }),
  })
  const res = await fetch(`${USER_SERVICE_URL}users`, opts)

  if (!res.ok) {
    throw new Error(`User service responded with ${res.status}: ${await res.text()}`)
  }
}

export async function loginUser(email: string, password: string): Promise<string> {
  const opts = withDefaultHeaders({
    method: "POST",
    body: JSON.stringify({
      email, password
    })
  });
  const res = await fetch(`${USER_SERVICE_URL}auth/login`, opts);

  if (!res.ok) {
    throw new Error(`User service responded with ${res.status}: ${await res.text()}`);
  }

  const ret: { "data": { "accessToken": string } } = await res.json();
  return ret.data.accessToken;
}