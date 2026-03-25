// No hardcoded URL — requests go to same origin, Next.js rewrites proxy them to BFF
export async function apiFetch<T>(
  path: string,
  options?: RequestInit & { skipAuthRedirect?: boolean }
): Promise<T> {
  const { skipAuthRedirect, ...fetchOptions } = options || {};

  const res = await fetch(path, {
    ...fetchOptions,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...fetchOptions?.headers },
  });

  if (res.status === 401 && !skipAuthRedirect) {
    if (
      typeof window !== "undefined" &&
      !window.location.pathname.startsWith("/login") &&
      !window.location.pathname.startsWith("/register")
    ) {
      window.location.href = "/login";
    }
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json();
}
