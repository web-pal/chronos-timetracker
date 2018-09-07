import request from 'request';
import JiraClient from 'jira-connector';

const getCookieJar = (origin, token) => {
  const jar = request.jar();
  jar.setCookie(
    `cloud.session.token=${token}; path=/; domain=.atlassian.net;`,
    origin,
  );
  return jar;
};


class JiraClientWrapper {
  constructor() {
    this.client = null;
    this.auth = this.auth.bind(this);
  }
  auth({ host, token }) {
    const client = new JiraClient({
      host: host.hostname,
      cookie_jar: getCookieJar(host.origin, token),
    });
    this.client = client;
  }
}

const jira = new JiraClientWrapper();

export default jira;
