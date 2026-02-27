import { createHash } from 'node:crypto';

export const DETAILS_AUTH_COOKIE = 'oa_details_auth';
const DEFAULT_DETAILS_PASSWORD = 'KingJ@mes1928';

const sha256 = (value: string): string => createHash('sha256').update(value).digest('hex');

export const getDetailsPassword = (): string =>
  process.env.DETAILS_PASSWORD || DEFAULT_DETAILS_PASSWORD;

export const expectedDetailsCookieValue = (): string =>
  sha256(`details:${getDetailsPassword()}`);

export const isValidDetailsCookie = (cookieValue: string | undefined): boolean => {
  if (!cookieValue) return false;
  return cookieValue === expectedDetailsCookieValue();
};

