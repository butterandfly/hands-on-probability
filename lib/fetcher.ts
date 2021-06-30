// const fetcher = (...args: any[]) => fetch(...args).then(res => res.json());
// const fetcher = (url: string) => fetch(url).then(r => r.json())
export const fetcher = async (
  input: RequestInfo,
  init: RequestInit,
  ...args: any[]
) => {
  const res = await fetch(input, init);
  return res.json();
};