import request from 'request';
import JiraClient from 'jira-connector';

const getCookieJar = (origin, domain, cookie) => {
  const jar = request.jar();
  console.log(`${cookie.name}=${cookie.value}; path=/; domain=${domain};`);
  jar.setCookie(
    `${cookie.name}=${cookie.value}; path=/; domain=${domain};`,
    origin,
    {
      ignoreError: true,
    },
  );
  return jar;
};


class JiraClientWrapper {
  constructor() {
    this.client = null;
    this.auth = this.auth.bind(this);
  }

  auth({
    host,
    protocol,
    port,
    cookie,
  }) {
    const client = new JiraClient({
      host: host.hostname,
      protocol,
      port,
      cookie_jar: getCookieJar(host.origin, host.hostname, cookie),
    });
    this.client = client;
  }
}

const jira = new JiraClientWrapper();

export default jira;
