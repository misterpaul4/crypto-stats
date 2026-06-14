export async function jsonFetch<T>(url: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, { headers: { accept: 'application/json' }, signal });
  if (!res.ok) throw new Error(`Request failed (${res.status}): ${url}`);
  return (await res.json()) as T;
}
