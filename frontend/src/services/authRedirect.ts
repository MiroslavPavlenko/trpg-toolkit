export function getEmailRedirectUrl(
  origin = window.location.origin,
  baseUrl = import.meta.env.BASE_URL,
) {
  return new URL(`${baseUrl}login`, origin).toString();
}
