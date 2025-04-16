export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const AUTH_CONSTANTS = {
  TOKEN_EXPIRY: '24h',
  COOKIE_NAME: 'auth_token',
} as const;
