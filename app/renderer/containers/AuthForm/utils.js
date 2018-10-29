export function transformValidHost(host: string): URL {
  try {
    return new URL(host);
  } catch (err) {
    if (err instanceof TypeError) {
      try {
        if (/^[a-zA-Z0-9-]*$/.test(host)) {
          const atlassianUrl = `https://${host}.atlassian.net`;
          return new URL(atlassianUrl);
        } if (!host.match(/^(http:\/\/|https:\/\/)/)) {
          const protocolUrl = `https://${host}`;
          return new URL(protocolUrl);
        }
      } catch (err2) {
        return null;
      }
    }
    return null;
  }
}
