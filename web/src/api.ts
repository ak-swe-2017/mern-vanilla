let accessToken: string | null = null;

export const authState = {
  get token() {
    return accessToken;
  },
  set token(v: string | null) {
    accessToken = v;
  },
  clear() {
    accessToken = null;
  },
};

async function refresh() {
  const res = await fetch("http://localhost:4000/auth/refresh", {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error("refresh failed");
  const body = await res.json();
  authState.token = body.accessToken;
  return body.accessToken as string;
}

export async function apiFetch<T = any>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers || {});
  if (authState.token)
    headers.set("Authorization", `Bearer ${authState.token}`);

  let res = await fetch(`http://localhost:4000${path}`, {
    ...init,
    headers,
    credentials: "include",
  });

  if (res.status === 401) {
    try {
      const newTok = await refresh();
      headers.set("Authorization", `Bearer ${newTok}`);
      res = await fetch(`http://localhost:4000${path}`, {
        ...init,
        headers,
        credentials: "include",
      });
    } catch {
      authState.clear();
      throw new Error("Unauthorized");
    }
  }

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as T;
}
