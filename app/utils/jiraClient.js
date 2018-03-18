import JiraClient from 'jira-connector';


class JiraClientWrapper {
  constructor() {
    this.client = null;
    this.basicAuth = this.basicAuth.bind(this);
    this.oauth = this.oauth.bind(this);
  }

  basicAuth({
    host,
    username,
    password,
    port,
    protocol,
    path_prefix,
  }) {
    const client = new JiraClient({
      host,
      path_prefix,
      port,
      protocol,
      rejectUnauthorized: false,
      basic_auth: {
        username,
        password,
      },
    });
    this.client = client;
  }


  oauth({ host, oauth }) {
    const client = new JiraClient({
      host,
      oauth,
    });
    this.client = client;
  }

  getOAuthUrl({ host, oauth: { consumerKey, privateKey } }, cb) { // eslint-disable-line
    return JiraClient.oauth_util.getAuthorizeURL({
      host,
      oauth: {
        consumer_key: consumerKey,
        private_key: privateKey,
      },
    }, cb);
  }

  getOAuthToken({ host, oauth }, cb) { // eslint-disable-line
    return JiraClient.oauth_util.swapRequestTokenWithAccessToken({
      host,
      oauth,
    }, cb);
  }
}

const jira = new JiraClientWrapper();

export default jira;
