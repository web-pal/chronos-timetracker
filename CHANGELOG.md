<a name="2.2.0-alpha.1"></a>
# 2.2.0-alpha.1 (2017-11-06)


### Bug Fixes

* **Browsing Issues:** fix fetch additional worklogs logic ([7c67c43](https://github.com/web-pal/Chronos/commit/7c67c43))
* **Browsing Issues:** fixed wrong labels in sidebar ([0a037ba](https://github.com/web-pal/Chronos/commit/0a037ba))
* **Flow:** add missing board type ([8ff12e3](https://github.com/web-pal/Chronos/commit/8ff12e3))
* **Issue Detail View:** added padding between buttons in issue view heade ([112c9ad](https://github.com/web-pal/Chronos/commit/112c9ad))
* **Issue Detail View:** fix assign to me button crashes app when assignee is null ([dbeb287](https://github.com/web-pal/Chronos/commit/dbeb287))
* **Issue Detail View:** fix selected issue not updating if issues refreshed ([96ba7c5](https://github.com/web-pal/Chronos/commit/96ba7c5))
* **Issue Detail View:** fixed bug where issue status could not be seen ([dcde17c](https://github.com/web-pal/Chronos/commit/dcde17c))
* **Issue Detail View:** fixed hardcoded color for issue status ([a7bc4ec](https://github.com/web-pal/Chronos/commit/a7bc4ec))
* **package-json:** fix linter script ([17ba2db](https://github.com/web-pal/Chronos/commit/17ba2db))
* **Settings:** fix local settings not requested in OAuth login flow ([650b9cd](https://github.com/web-pal/Chronos/commit/650b9cd))
* **Tracking:** fix activity not caclulating ([fa3b306](https://github.com/web-pal/Chronos/commit/fa3b306))
* **Tracking:** fix DismissIdleTime typings ([04c151e](https://github.com/web-pal/Chronos/commit/04c151e))
* **Tracking:** fix idle time dismissing ([a004842](https://github.com/web-pal/Chronos/commit/a004842))
* **Updating:** fix automatic update checking ([a260d26](https://github.com/web-pal/Chronos/commit/a260d26))
* **Utility:** fix app crash if userData folder is not present in fs ([0619f7e](https://github.com/web-pal/Chronos/commit/0619f7e))


### Features

* **Authorization:** add human readable error on JWT check saga ([842663b](https://github.com/web-pal/Chronos/commit/842663b))
* **Authorization:** add human-readable errors for OAuth flow and Basic Auth flow ([a0e432d](https://github.com/web-pal/Chronos/commit/a0e432d))
* **Browsing Issues:** implement assign to me button ([2d4b070](https://github.com/web-pal/Chronos/commit/2d4b070))
* **Browsing Issues:** implement deleting worklogs ([fd97565](https://github.com/web-pal/Chronos/commit/fd97565))
* **Browsing Issues:** implement worklog history ([0c4d084](https://github.com/web-pal/Chronos/commit/0c4d084))
* **Browsing Issues:** implement worklog update feature ([d372004](https://github.com/web-pal/Chronos/commit/d372004))
* **Issue Detail View:** add error notify when issue transition fails ([b4b9a13](https://github.com/web-pal/Chronos/commit/b4b9a13))
* **Issue Detail View:** implement smooth scrolling and blinking worklog selected from recent tab ([379022a](https://github.com/web-pal/Chronos/commit/379022a))
* **Issue Detail View:** implement workflow changing feature ([667507d](https://github.com/web-pal/Chronos/commit/667507d))
* **Tracking:** don't upload less-than-a-minute worklogs ([66efe0f](https://github.com/web-pal/Chronos/commit/66efe0f))
* **Updating:** add Linux auto-update placeholder ([5a37d9d](https://github.com/web-pal/Chronos/commit/5a37d9d))
* **Utility:** add logging to uploadWorklog ([2bb76ba](https://github.com/web-pal/Chronos/commit/2bb76ba))
* CDESKTOP-70, CDESKTOP-80 jira issues ([22d75b1](https://github.com/web-pal/Chronos/commit/22d75b1))
* implement worklog modal validation ([6e826f6](https://github.com/web-pal/Chronos/commit/6e826f6))


### Performance Improvements

* **Utility:** fix high memory usage ([64b25d7](https://github.com/web-pal/Chronos/commit/64b25d7))



<a name="2.1.0"></a>
# 2.1.0 (2017-11-06)


### Bug Fixes

* **Browsing Issues:** fixed wrong labels in sidebar ([0a037ba](https://github.com/web-pal/Chronos/commit/0a037ba))
* **Flow:** add missing board type ([8ff12e3](https://github.com/web-pal/Chronos/commit/8ff12e3))
* **Issue Detail View:** added padding between buttons in issue view heade ([112c9ad](https://github.com/web-pal/Chronos/commit/112c9ad))
* **Issue Detail View:** fix selected issue not updating if issues refreshed ([96ba7c5](https://github.com/web-pal/Chronos/commit/96ba7c5))
* **Issue Detail View:** fixed bug where issue status could not be seen ([dcde17c](https://github.com/web-pal/Chronos/commit/dcde17c))
* **Issue Detail View:** fixed hardcoded color for issue status ([a7bc4ec](https://github.com/web-pal/Chronos/commit/a7bc4ec))
* **package-json:** fix linter script ([17ba2db](https://github.com/web-pal/Chronos/commit/17ba2db))
* **Settings:** fix local settings not requested in OAuth login flow ([650b9cd](https://github.com/web-pal/Chronos/commit/650b9cd))
* **Tracking:** fix activity not caclulating ([fa3b306](https://github.com/web-pal/Chronos/commit/fa3b306))
* **Tracking:** fix DismissIdleTime typings ([04c151e](https://github.com/web-pal/Chronos/commit/04c151e))
* **Tracking:** fix idle time dismissing ([a004842](https://github.com/web-pal/Chronos/commit/a004842))
* **Updating:** fix automatic update checking ([a260d26](https://github.com/web-pal/Chronos/commit/a260d26))
* **Utility:** fix app crash if userData folder is not present in fs ([0619f7e](https://github.com/web-pal/Chronos/commit/0619f7e))


### Features

* **Authorization:** add human readable error on JWT check saga ([842663b](https://github.com/web-pal/Chronos/commit/842663b))
* **Authorization:** add human-readable errors for OAuth flow and Basic Auth flow ([a0e432d](https://github.com/web-pal/Chronos/commit/a0e432d))
* **Issue Detail View:** add error notify when issue transition fails ([b4b9a13](https://github.com/web-pal/Chronos/commit/b4b9a13))
* **Issue Detail View:** implement workflow changing feature ([667507d](https://github.com/web-pal/Chronos/commit/667507d))
* **Tracking:** don't upload less-than-a-minute worklogs ([66efe0f](https://github.com/web-pal/Chronos/commit/66efe0f))
* **Updating:** add Linux auto-update placeholder ([5a37d9d](https://github.com/web-pal/Chronos/commit/5a37d9d))
* **Utility:** add logging to uploadWorklog ([2bb76ba](https://github.com/web-pal/Chronos/commit/2bb76ba))
* CDESKTOP-70, CDESKTOP-80 jira issues ([22d75b1](https://github.com/web-pal/Chronos/commit/22d75b1))


### Performance Improvements

* **Utility:** fix high memory usage ([64b25d7](https://github.com/web-pal/Chronos/commit/64b25d7))



<a name="2.1.0-beta.1"></a>
# [2.1.0-beta.1](https://github.com/web-pal/chronos-app-jira/compare/2.1.0-alpha.2...2.1.0-beta.1) (2017-10-27)


### Bug Fixes

* **Browsing Issues:** fix recent items not refreshing on project change ([eb37a78](https://github.com/web-pal/chronos-app-jira/commit/eb37a78))
* **Browsing Issues:** fixed wrong labels in sidebar ([317a0a8](https://github.com/web-pal/chronos-app-jira/commit/317a0a8))
* **Flow:** add missing board type ([45912ad](https://github.com/web-pal/chronos-app-jira/commit/45912ad))
* **Issue Detail View:** added padding between buttons in issue view heade ([377fd1c](https://github.com/web-pal/chronos-app-jira/commit/377fd1c))
* **Issue Detail View:** fix selected issue not updating if issues refreshed ([8d3e9c2](https://github.com/web-pal/chronos-app-jira/commit/8d3e9c2))
* **Issue Detail View:** fixed bug where issue status could not be seen ([f2bd048](https://github.com/web-pal/chronos-app-jira/commit/f2bd048))
* **Issue Detail View:** fixed hardcoded color for issue status ([981c515](https://github.com/web-pal/chronos-app-jira/commit/981c515))
* **package-json:** fix linter script ([b69ca4f](https://github.com/web-pal/chronos-app-jira/commit/b69ca4f))
* **Settings:** fix local settings not requested in OAuth login flow ([d49bb3f](https://github.com/web-pal/chronos-app-jira/commit/d49bb3f))
* **Tracking:** fix activity not caclulating ([d16ddeb](https://github.com/web-pal/chronos-app-jira/commit/d16ddeb))
* **Tracking:** fix DismissIdleTime typings ([769b6c9](https://github.com/web-pal/chronos-app-jira/commit/769b6c9))
* **Tracking:** fix idle time dismissing ([2e7bc7d](https://github.com/web-pal/chronos-app-jira/commit/2e7bc7d))
* **Utility:** fix app crash if userData folder is not present in fs ([289b90d](https://github.com/web-pal/chronos-app-jira/commit/289b90d))


### Features

* **Authorization:** add human readable error on JWT check saga ([1de05e4](https://github.com/web-pal/chronos-app-jira/commit/1de05e4))
* **Authorization:** add human-readable errors for OAuth flow and Basic Auth flow ([f750a02](https://github.com/web-pal/chronos-app-jira/commit/f750a02))
* **Issue Detail View:** add error notify when issue transition fails ([2b5b98f](https://github.com/web-pal/chronos-app-jira/commit/2b5b98f))
* **Issue Detail View:** implement workflow changing feature ([30377cd](https://github.com/web-pal/chronos-app-jira/commit/30377cd))
* **Tracking:** don't upload less-than-a-minute worklogs ([45e22b4](https://github.com/web-pal/chronos-app-jira/commit/45e22b4))
* **Updating:** add Linux auto-update placeholder ([5ed100a](https://github.com/web-pal/chronos-app-jira/commit/5ed100a))
* **Utility:** add logging to uploadWorklog ([35506ac](https://github.com/web-pal/chronos-app-jira/commit/35506ac))


### Performance Improvements

* **Utility:** fix high memory usage ([41d21ff](https://github.com/web-pal/chronos-app-jira/commit/41d21ff))



