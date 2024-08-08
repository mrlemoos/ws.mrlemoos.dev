export function useAPIToken(): string {
  const apiToken = process.env.NITRO_API_TOKEN;
  return apiToken;
}
