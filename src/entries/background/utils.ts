function cleanUrl(url: string): string {
  return url.split(/[?#]/)[0];
}

/**
 * Checks whether the provided URL is valid for analysis with OSS Insight.
 * @param url the URL to check
 * @returns false if the URL is invalid, otherwise the correct redirection target
 */
export function sanitze(url: string | undefined): false | string {
  if (!url?.startsWith("https://github.com/")) return false;
  let remainder = url.split("https://github.com/")[1];

  // Base URL
  if (remainder.length === 0) return false;

  // Known invalid URLs
  const ignoredUrls = [
    "account",
    "codespaces",
    "issues",
    "new",
    "notifications",
    "pulls",
    "sponsors",
  ];
  if (ignoredUrls.some((ignore) => remainder.startsWith(ignore))) return false;

  // The users path usually redirects somewhere else, if it does not the second
  // part should be the user name
  if (remainder.startsWith("users")) return remainder.split("/")[1];

  // Most likely valid URLs where the first or the first two parts are interesting
  // any query parameters must be removed
  let parts = remainder.split("/");

  let result = "";
  if (parts.length === 1) result = parts[0];
  if (parts.length === 2) result = parts.join("/");
  if (parts.length >= 3) result = `${parts[0]}/${parts[1]}`;

  return cleanUrl(result);
}
