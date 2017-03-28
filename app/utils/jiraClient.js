import JiraClient from 'jira-connector';


class jiraClient {
  constructor() {
    this.client = null;
    this.auth = this.auth.bind(this);
  }

  auth(host, username, password) {
    const client = new JiraClient({
      host,
      basic_auth: {
        username,
        password,
      },
    });
    this.client = client;
  }
}

const jira = new jiraClient();

export default jira;
