import request from 'request';
import JiraClient from 'jira-connector';
import {
  Cookie,
} from 'tough-cookie';

function parseToCookieJar(cookies, protocol, hostname) {
  const jar = request.jar();
  cookies.forEach((cookie) => {
    const jarCookie = new Cookie({
      ...cookie,
      key: cookie.name,
      secure: cookie.secure || false,
      httpOnly: cookie.httpOnly || false,
    });
    jar.setCookie(jarCookie.toString(), `${protocol}://${hostname}`);
  });
  console.log('cookie jar', jar);
  return jar;
}


class JiraClientWrapper {
  constructor() {
    this.client = null;
    this.auth = this.auth.bind(this);
  }

  auth({
    port,
    hostname,
    protocol,
    pathname,
    cookies,
  }) {
    const options = {
      protocol,
      host: hostname,
      port,
      path_prefix: `${pathname.replace(/\/$/, '')}/`,
      cookie_jar: parseToCookieJar(cookies, protocol, hostname),
    };
    this.client = new JiraClient(options);
  }
}

const jira = new JiraClientWrapper();

export default jira;
