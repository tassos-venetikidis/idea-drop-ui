let accessToken: string | null = null;

export function setStoredAccessToken(token: string | null) {
  accessToken = token;
}

export function getStoredAccessToken() {
  return accessToken;
}
