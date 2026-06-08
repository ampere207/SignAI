const DEFAULT_API_URL = "http://localhost:8000";

export function getApiBaseUrl() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

  if (!apiUrl) {
    return DEFAULT_API_URL;
  }

  return apiUrl.replace(/\/$/, "");
}