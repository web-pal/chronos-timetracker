<a name="2.5.17"></a>
## [2.5.17](https://github.com/web-pal/chronos-timetracker/compare/v2.5.16-a...v2.5.17) (2018-03-06)


### Bug Fixes

* can't add issue after first login ([c144fe0](https://github.com/web-pal/chronos-timetracker/commit/c144fe0))


### Features

* add/edit issue improvement ([e264f92](https://github.com/web-pal/chronos-timetracker/commit/e264f92))



<a name="2.5.16-a"></a>
## [2.5.16-a](https://github.com/web-pal/chronos-timetracker/compare/v2.5.15...v2.5.16-a) (2018-02-28)


### Bug Fixes

* can't add issue after first login ([c144fe0](https://github.com/web-pal/chronos-timetracker/commit/c144fe0))



<a name="2.5.15"></a>
## [2.5.15](https://github.com/web-pal/chronos-timetracker/compare/v2.5.14...v2.5.15) (2018-02-28)


### Bug Fixes

* **Browsing Issues:** issueForm too slow ([23d2765](https://github.com/web-pal/chronos-timetracker/commit/23d2765))
* version ([124dd08](https://github.com/web-pal/chronos-timetracker/commit/124dd08))


### Features

* flow-typing ([e4a26f3](https://github.com/web-pal/chronos-timetracker/commit/e4a26f3))



<a name="2.5.14"></a>
## [2.5.14](https://github.com/web-pal/chronos-timetracker/compare/v2.5.13...v2.5.14) (2018-02-27)


### Bug Fixes

* devtools opened in production ([f5455b5](https://github.com/web-pal/chronos-timetracker/commit/f5455b5))



<a name="2.5.13"></a>
## [2.5.13](https://github.com/web-pal/chronos-timetracker/compare/v2.5.12...v2.5.13) (2018-02-27)


### Bug Fixes

* new issue window didn't closed on windows ([bc50b17](https://github.com/web-pal/chronos-timetracker/commit/bc50b17))
* **Browsing Issues:** request timeout + infiniteloader improvment ([e1fd51e](https://github.com/web-pal/chronos-timetracker/commit/e1fd51e))


### Features

* new issue modal with Jira JS API ([d313feb](https://github.com/web-pal/chronos-timetracker/commit/d313feb))
* webview for create new issue ([5ad9555](https://github.com/web-pal/chronos-timetracker/commit/5ad9555))
* **Issue Detail View:** edit issue ([a31c77a](https://github.com/web-pal/chronos-timetracker/commit/a31c77a))



<a name="2.5.12"></a>
## [2.5.12](https://github.com/web-pal/chronos-timetracker/compare/v2.5.11...v2.5.12) (2018-02-22)


### Bug Fixes

* **Browsing Issues:** getProjectsForBoard is not a function, because of wrong jira-connector version ([79cf991](https://github.com/web-pal/chronos-timetracker/commit/79cf991))



<a name="2.5.11"></a>
## [2.5.11](https://github.com/web-pal/chronos-timetracker/compare/v2.5.9...v2.5.11) (2018-02-20)


### Bug Fixes

* **Browsing Issues:** extra fetch request ([a705116](https://github.com/web-pal/chronos-timetracker/commit/a705116))
* **Browsing Issues:** issuesFetching for header depends on sidebarType ([94cecb1](https://github.com/web-pal/chronos-timetracker/commit/94cecb1))
* **Issue Detail View:** critical bug during refetch tracking issue ([b4e97f6](https://github.com/web-pal/chronos-timetracker/commit/b4e97f6))
* **Tracking:** fix empty worklogs ([dd41d81](https://github.com/web-pal/chronos-timetracker/commit/dd41d81))


### Features

* **Issue Detail View:** render comments properly ([1964b07](https://github.com/web-pal/chronos-timetracker/commit/1964b07))
* **Tracking:** control remaining estimates ([ebda033](https://github.com/web-pal/chronos-timetracker/commit/ebda033)), closes [#73](https://github.com/web-pal/chronos-timetracker/issues/73)



<a name="2.5.9"></a>
## [2.5.9](https://github.com/web-pal/chronos-timetracker/compare/v2.5.7...v2.5.9) (2018-02-15)


### Bug Fixes

* **Authorization:** show linux error about libsecret ([aa26939](https://github.com/web-pal/chronos-timetracker/commit/aa26939)), closes [#70](https://github.com/web-pal/chronos-timetracker/issues/70)
* getPassword ([4dc66db](https://github.com/web-pal/chronos-timetracker/commit/4dc66db))
* **Browsing Issues:** do not clear issues if they don't have worklog object ([fe0685f](https://github.com/web-pal/chronos-timetracker/commit/fe0685f))
* **Browsing Issues:** normalize issues without worklog object ([ebe345a](https://github.com/web-pal/chronos-timetracker/commit/ebe345a))
* **Browsing Issues:** try to fetch statyses even if no issestypes ([116c963](https://github.com/web-pal/chronos-timetracker/commit/116c963))
* **Issue Detail View:** detailsView without required fields ([ce9613d](https://github.com/web-pal/chronos-timetracker/commit/ce9613d))



<a name="2.5.7"></a>
## [2.5.7](https://github.com/web-pal/chronos-timetracker/compare/v2.5.5...v2.5.7) (2018-02-12)


### Bug Fixes

* **Browsing Issues:** fetch additional boards ([6d23249](https://github.com/web-pal/chronos-timetracker/commit/6d23249)), closes [#69](https://github.com/web-pal/chronos-timetracker/issues/69) [#70](https://github.com/web-pal/chronos-timetracker/issues/70)



<a name="2.5.4"></a>
## [2.5.4](https://github.com/web-pal/chronos-timetracker/compare/v2.5.3...v2.5.4) (2018-02-09)


### Bug Fixes

* mention about update only once ([e01d7d6](https://github.com/web-pal/chronos-timetracker/commit/e01d7d6))
* **Authorization:** remove unsecure request on chronos backend ([ee43fdc](https://github.com/web-pal/chronos-timetracker/commit/ee43fdc))
* **Browsing Issues:** fetch additionaly project info for boards in rare case ([85d9d41](https://github.com/web-pal/chronos-timetracker/commit/85d9d41)), closes [#68](https://github.com/web-pal/chronos-timetracker/issues/68)


### Features

* env vars in docker container ([d3210ad](https://github.com/web-pal/chronos-timetracker/commit/d3210ad))
* **Browsing Issues:** ability to search projects by key ([ff30566](https://github.com/web-pal/chronos-timetracker/commit/ff30566)), closes [#67](https://github.com/web-pal/chronos-timetracker/issues/67)



<a name="2.5.3"></a>
## [2.5.3](https://github.com/web-pal/chronos-timetracker/compare/v2.5.2...v2.5.3) (2018-02-08)


### Bug Fixes

* **Authorization:** jira server auth fix ([667c77e](https://github.com/web-pal/chronos-timetracker/commit/667c77e))


### Features

* notification on delete, edit, add worklog ([f4a381f](https://github.com/web-pal/chronos-timetracker/commit/f4a381f))



<a name="2.5.2"></a>
## [2.5.2](https://github.com/web-pal/chronos-timetracker/compare/v2.5.1...v2.5.2) (2018-02-07)


### Bug Fixes

* **Browsing Issues:** clear recent list after change project ([c01870d](https://github.com/web-pal/chronos-timetracker/commit/c01870d))
* linux close window ([dda0fd5](https://github.com/web-pal/chronos-timetracker/commit/dda0fd5))
* mixpanel throw err ([da491e0](https://github.com/web-pal/chronos-timetracker/commit/da491e0))
* **Browsing Issues:** fix search input ([#64](https://github.com/web-pal/chronos-timetracker/issues/64)) ([52004e9](https://github.com/web-pal/chronos-timetracker/commit/52004e9))
* **Issue Detail View:** fix issue and timeline styles,add flow types ([#63](https://github.com/web-pal/chronos-timetracker/issues/63)) ([3da49c1](https://github.com/web-pal/chronos-timetracker/commit/3da49c1))
* **Tracking:** stuch after idle popup ([c5dfb17](https://github.com/web-pal/chronos-timetracker/commit/c5dfb17))



<a name="2.5.1"></a>
## [2.5.1](https://github.com/web-pal/chronos-timetracker/compare/v2.5.0...v2.5.1) (2018-02-06)


### Bug Fixes

* **Browsing Issues:** clear recent list after change project ([c01870d](https://github.com/web-pal/chronos-timetracker/commit/c01870d))
* **Issue Detail View:** fix issue and timeline styles,add flow types ([#63](https://github.com/web-pal/chronos-timetracker/issues/63)) ([3da49c1](https://github.com/web-pal/chronos-timetracker/commit/3da49c1))
* **Tracking:** stuch after idle popup ([c5dfb17](https://github.com/web-pal/chronos-timetracker/commit/c5dfb17))
* linux close window ([dda0fd5](https://github.com/web-pal/chronos-timetracker/commit/dda0fd5))
* mixpanel throw err ([da491e0](https://github.com/web-pal/chronos-timetracker/commit/da491e0))



<a name="2.5.0"></a>
# [2.5.0](https://github.com/web-pal/chronos-timetracker/compare/v2.4.7...v2.5.0) (2018-02-05)


### Bug Fixes

* **Authorization:** filter on onBeforeSendHeaders ([4b901c1](https://github.com/web-pal/chronos-timetracker/commit/4b901c1))
* **Authorization:** jira browser auth in first login ([0fae182](https://github.com/web-pal/chronos-timetracker/commit/0fae182))
* **Tracking:** clear worklogComment after save worklog ([74b8353](https://github.com/web-pal/chronos-timetracker/commit/74b8353)), closes [#56](https://github.com/web-pal/chronos-timetracker/issues/56)
* focus on just added worklog ([e14a128](https://github.com/web-pal/chronos-timetracker/commit/e14a128))
* recentIssues ([6c6dd3e](https://github.com/web-pal/chronos-timetracker/commit/6c6dd3e))
* refetch issues after transition done ([4339550](https://github.com/web-pal/chronos-timetracker/commit/4339550))
* remember issues filter ([e0e2dc7](https://github.com/web-pal/chronos-timetracker/commit/e0e2dc7)), closes [#18](https://github.com/web-pal/chronos-timetracker/issues/18)
* save timer before quit app ([ed8136c](https://github.com/web-pal/chronos-timetracker/commit/ed8136c))
* turn on mixpanel ([94c4ada](https://github.com/web-pal/chronos-timetracker/commit/94c4ada))
* white bg for NoWorklogsContainer ([93e514d](https://github.com/web-pal/chronos-timetracker/commit/93e514d))


### Features

* linux auto-updates ([cd47fd1](https://github.com/web-pal/chronos-timetracker/commit/cd47fd1))
* update electron-updater ([38e0e78](https://github.com/web-pal/chronos-timetracker/commit/38e0e78))



<a name="2.4.7"></a>
## [2.4.7](https://github.com/web-pal/chronos-timetracker/compare/v2.4.6...v2.4.7) (2018-01-19)


### Bug Fixes

* **Authorization:** jira browser auth in first login ([0fae182](https://github.com/web-pal/chronos-timetracker/commit/0fae182))
* turn on mixpanel ([94c4ada](https://github.com/web-pal/chronos-timetracker/commit/94c4ada))


### Features

* linux auto-updates ([cd47fd1](https://github.com/web-pal/chronos-timetracker/commit/cd47fd1))



<a name="2.4.6"></a>
## [2.4.6](https://github.com/web-pal/chronos-timetracker/compare/v2.4.4...v2.4.6) (2018-01-18)


### Bug Fixes

* dev initMixpanel ([a0f58cb](https://github.com/web-pal/chronos-timetracker/commit/a0f58cb))
* mixpanel init ([9713921](https://github.com/web-pal/chronos-timetracker/commit/9713921))
* store-credentials ([b1735c7](https://github.com/web-pal/chronos-timetracker/commit/b1735c7))
* **Authorization:** media for renderedFields ([3fae957](https://github.com/web-pal/chronos-timetracker/commit/3fae957)), closes [#21](https://github.com/web-pal/chronos-timetracker/issues/21)



<a name="2.4.4"></a>
## [2.4.4](https://github.com/web-pal/chronos-timetracker/compare/v2.4.3...v2.4.4) (2018-01-16)


### Bug Fixes

* **Browsing Issues:** fix worklog scroll ([#45](https://github.com/web-pal/chronos-timetracker/issues/45)) ([a4d8bf9](https://github.com/web-pal/chronos-timetracker/commit/a4d8bf9))
* **Authorization:** refactoring auth sagas


<a name="2.4.3"></a>
## [2.4.3](https://github.com/web-pal/chronos-timetracker/compare/v2.4.2...v2.4.3) (2018-01-15)


### Bug Fixes

* **Browsing Issues:** show button on Recent worklogs ([#40](https://github.com/web-pal/chronos-timetracker/issues/40)) ([4ee4b5b](https://github.com/web-pal/chronos-timetracker/commit/4ee4b5b)), closes [#28](https://github.com/web-pal/chronos-timetracker/issues/28)
* **Browsing Issues:** sort descending worklogs by date ([#42](https://github.com/web-pal/chronos-timetracker/issues/42)) ([2c512fb](https://github.com/web-pal/chronos-timetracker/commit/2c512fb)), closes [#25](https://github.com/web-pal/chronos-timetracker/issues/25)
* **Issue Detail View:** constantly highlight selected worklog from recent worklogs ([#39](https://github.com/web-pal/chronos-timetracker/issues/39)) ([73a33c3](https://github.com/web-pal/chronos-timetracker/commit/73a33c3)), closes [#27](https://github.com/web-pal/chronos-timetracker/issues/27)
* **Issue Detail View:** total logged not updated after loading worklog ([#37](https://github.com/web-pal/chronos-timetracker/issues/37)) ([eb66e86](https://github.com/web-pal/chronos-timetracker/commit/eb66e86)), closes [#14](https://github.com/web-pal/chronos-timetracker/issues/14)
* **Tracking:** autofocus on worklog comment input ([#38](https://github.com/web-pal/chronos-timetracker/issues/38)) ([076554f](https://github.com/web-pal/chronos-timetracker/commit/076554f)), closes [#15](https://github.com/web-pal/chronos-timetracker/issues/15)
* **Tracking:** clear worklog comment after log work action ([#41](https://github.com/web-pal/chronos-timetracker/issues/41)) ([17dfb29](https://github.com/web-pal/chronos-timetracker/commit/17dfb29)), closes [#17](https://github.com/web-pal/chronos-timetracker/issues/17)
* **Tracking:** worklog start time is saved as if it had started when we hit the stop button. ([#36](https://github.com/web-pal/chronos-timetracker/issues/36)) ([a1ec27b](https://github.com/web-pal/chronos-timetracker/commit/a1ec27b)), closes [#35](https://github.com/web-pal/chronos-timetracker/issues/35)



<a name="2.4.0"></a>
# [2.4.0](https://github.com/web-pal/chronos-app-jira/compare/2.3.4...2.4.0) (2017-11-29)


### Bug Fixes

* **Authorization:** fix jiraAuth method arguments ([9e1eb2a](https://github.com/web-pal/chronos-app-jira/commit/9e1eb2a))
* **Issue Detail View:** fix "no worklogs" markup ([0f9583e](https://github.com/web-pal/chronos-app-jira/commit/0f9583e))
* **Issue Detail View:** fix edit worklog button ([55d611e](https://github.com/web-pal/chronos-app-jira/commit/55d611e))
* popup styles ([e537768](https://github.com/web-pal/chronos-app-jira/commit/e537768))


### Features

* **Authorization:** ability to authorize for Jira servers ([1e3c5a1](https://github.com/web-pal/chronos-app-jira/commit/1e3c5a1))
* **Browsing Issues:** show only available statuses and issuetypes in filters ([444b9d7](https://github.com/web-pal/chronos-app-jira/commit/444b9d7))
* **Issue Detail View:** render Jira markdown in issue details ([b59f334](https://github.com/web-pal/chronos-app-jira/commit/b59f334))
* **Tracking:** repair socket ([1174588](https://github.com/web-pal/chronos-app-jira/commit/1174588))



<a name=""></a>
#  (2017-11-23)


### Bug Fixes

* fix storage flow types ([426d49f](https://github.com/web-pal/chronos-app-jira/commit/426d49f))



<a name="2.3.3"></a>
## [2.3.3](https://github.com/web-pal/chronos-app-jira/compare/2.3.1...2.3.3) (2017-11-22)


### Bug Fixes

* **Authorization:** fix oAuth authorization flow ([ef0d6ed](https://github.com/web-pal/chronos-app-jira/commit/ef0d6ed))


### Features

* **Authorization:** remove dependency on our backend ([f64827e](https://github.com/web-pal/chronos-app-jira/commit/f64827e))
* bring babel-minify back ([12c5565](https://github.com/web-pal/chronos-app-jira/commit/12c5565))



<a name="2.3.1"></a>
## [2.3.1](https://github.com/web-pal/chronos-app-jira/compare/2.3.0-alpha.2...2.3.1) (2017-11-21)


### Bug Fixes

* **Issue Detail View:** fix description width ([6d6371e](https://github.com/web-pal/chronos-app-jira/commit/6d6371e))
* **Tray:** fix start and stop buttons ([fb62f7e](https://github.com/web-pal/chronos-app-jira/commit/fb62f7e))
* add missing font ([d7e5224](https://github.com/web-pal/chronos-app-jira/commit/d7e5224))


### Features

* **Issue Detail View:** fill real data in Issue Report ([f5a14c4](https://github.com/web-pal/chronos-app-jira/commit/f5a14c4))



<a name="2.2.2"></a>
## [2.2.2](https://github.com/web-pal/chronos-app-jira/compare/2.2.1...2.2.2) (2017-11-13)


### Bug Fixes

* **Tracking:** fix bug when new worklog didn't add to recent if lauched tracking from search ([01e766c](https://github.com/web-pal/chronos-app-jira/commit/01e766c))


### Features

* **Browsing Issues:** ass link to Jira Software permission problem solution ([95b2b80](https://github.com/web-pal/chronos-app-jira/commit/95b2b80))
* **Issue Detail View:** implement comments ([b2ae983](https://github.com/web-pal/chronos-app-jira/commit/b2ae983))



<a name="2.2.0"></a>
# [2.2.0](https://github.com/web-pal/Chronos/compare/2.2.0-beta.1...2.2.0) (2017-11-07)


### Bug Fixes

* fixed flow errors and idle time ([b3f9b81](https://github.com/web-pal/Chronos/commit/b3f9b81))
* **Browsing Issues:** finally fix worklogs crashing ([891b60e](https://github.com/web-pal/Chronos/commit/891b60e))
* **Browsing Issues:** fix manual worklog adding when issue is gone bug ([5d7cc86](https://github.com/web-pal/Chronos/commit/5d7cc86))
* **Browsing Issues:** fix recent issues don't refetch on project change ([6857ae2](https://github.com/web-pal/Chronos/commit/6857ae2))
* **Browsing Issues:** fix worklog deleting ([1c6ed26](https://github.com/web-pal/Chronos/commit/1c6ed26))
* **Build:** fix terminal-notifier on production ([eccc0c3](https://github.com/web-pal/Chronos/commit/eccc0c3))
* **Socket:** fix socket connect ([07a9e0c](https://github.com/web-pal/Chronos/commit/07a9e0c))
* **Tracking:** fix app crash when issue don't have worklogs ([9879816](https://github.com/web-pal/Chronos/commit/9879816))
* **Tracking:** fix screenshot reject ([2bab117](https://github.com/web-pal/Chronos/commit/2bab117))
* **Tracking:** fix screenshots ([7e7fd6c](https://github.com/web-pal/Chronos/commit/7e7fd6c))



<a name="2.2.0-beta.1"></a>
# 2.2.0-beta.1 (2017-11-06)


### Bug Fixes

* **Authorization:** fix error messages ([49aa881](https://github.com/web-pal/Chronos/commit/49aa881))
* **Authorization:** fix sentry and mixpanel identifying + some refactoring ([dc33c87](https://github.com/web-pal/Chronos/commit/dc33c87))
* **Browsing Issues:** fix boards selection and fetching ([8303738](https://github.com/web-pal/Chronos/commit/8303738))
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
* **Tracking:** fix screenshots ([dd59a78](https://github.com/web-pal/Chronos/commit/dd59a78))
* **Updating:** fix automatic update checking ([a260d26](https://github.com/web-pal/Chronos/commit/a260d26))
* **Utility:** fix app crash if userData folder is not present in fs ([0619f7e](https://github.com/web-pal/Chronos/commit/0619f7e))


### Features

* **Authorization:** add human readable error on JWT check saga ([842663b](https://github.com/web-pal/Chronos/commit/842663b))
* **Authorization:** add human-readable errors for OAuth flow and Basic Auth flow ([a0e432d](https://github.com/web-pal/Chronos/commit/a0e432d))
* **Browsing Issues:** implement assign to me button ([2d4b070](https://github.com/web-pal/Chronos/commit/2d4b070))
* **Browsing Issues:** implement deleting worklogs ([fd97565](https://github.com/web-pal/Chronos/commit/fd97565))
* **Browsing Issues:** implement worklog history ([0c4d084](https://github.com/web-pal/Chronos/commit/0c4d084))
* **Browsing Issues:** implement worklog update feature ([d372004](https://github.com/web-pal/Chronos/commit/d372004))
* **Browsing Issues:** send notification when unable to load projects ([3481bee](https://github.com/web-pal/Chronos/commit/3481bee))
* **Issue Detail View:** add epic link to issue detail view ([58a991d](https://github.com/web-pal/Chronos/commit/58a991d))
* **Issue Detail View:** add error notify when issue transition fails ([b4b9a13](https://github.com/web-pal/Chronos/commit/b4b9a13))
* **Issue Detail View:** disable tab changing to worklogs if recent clicked ([58bec5b](https://github.com/web-pal/Chronos/commit/58bec5b))
* **Issue Detail View:** implement smooth scrolling and blinking worklog selected from recent tab ([379022a](https://github.com/web-pal/Chronos/commit/379022a))
* **Issue Detail View:** implement workflow changing feature ([667507d](https://github.com/web-pal/Chronos/commit/667507d))
* **Issue Detail View:** remove spinner from workflow dropdown menu ([1a9a4e5](https://github.com/web-pal/Chronos/commit/1a9a4e5))
* **Issue Detail View:** virtualize worklogs ([95eee26](https://github.com/web-pal/Chronos/commit/95eee26))
* **Tracking:** don't upload less-than-a-minute worklogs ([66efe0f](https://github.com/web-pal/Chronos/commit/66efe0f))
* **Tray:** remove logged today ([5b6c669](https://github.com/web-pal/Chronos/commit/5b6c669))
* **Updating:** add Linux auto-update placeholder ([5a37d9d](https://github.com/web-pal/Chronos/commit/5a37d9d))
* **Utility:** add logging to uploadWorklog ([2bb76ba](https://github.com/web-pal/Chronos/commit/2bb76ba))
* CDESKTOP-70, CDESKTOP-80 jira issues ([22d75b1](https://github.com/web-pal/Chronos/commit/22d75b1))
* implement worklog modal validation ([6e826f6](https://github.com/web-pal/Chronos/commit/6e826f6))


### Performance Improvements

* **Utility:** fix high memory usage ([64b25d7](https://github.com/web-pal/Chronos/commit/64b25d7))



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



