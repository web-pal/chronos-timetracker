import * as eff from 'redux-saga/effects';
import fs from 'fs';
import path from 'path';
import {
  remote,
  screen,
} from 'electron';
import mergeImages from 'merge-images';
import screenshot from 'screenshot-desktop';

import {
  actionTypes,
  screenshotsActions,
  timerActions,
  uiActions,
} from 'actions';
import * as selectors from 'selectors';
import {
  actionTypes as sharedActionTypes,
} from 'shared/actions';
import {
  windowsManagerSagas,
} from 'shared/sagas';
import {
  chronosApi,
  jiraApi,
} from 'api';
import {
  trackMixpanel,
} from 'utils/stat';
import {
  randomIntFromInterval,
} from 'utils/random';
import config from 'config';

import {
  calculateInactivityPeriod,
} from './helpers';
import {
  throwError,
} from './ui';
import store from '../store';

const { app } = remote.require('electron');
const exec = require('child_process').exec; // eslint-disable-line
const temp = require('temp');

function unlinkP(p) {
  return new Promise((resolve, reject) => {
    fs.unlink(p, (err) => {
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  });
}

function readFileP(p) {
  return new Promise((resolve, reject) => {
    fs.readFile(p, (err, img) => {
      if (err) {
        return reject(err);
      }
      return resolve(img);
    });
  });
}

function readAndUnlinkP(p) {
  return new Promise((resolve, reject) => {
    readFileP(p)
      .then((img) => {
        unlinkP(p)
          .then(() => resolve(img))
          .catch(reject);
      })
      .catch(reject);
  });
}


if (process.platform === 'darwin') {
  screenshot.darwinSnapshot = function darwinSnapshot(options = {}) {
    return new Promise((resolve, reject) => {
      const displayId = options.screen || 0;
      if (!Number.isInteger(displayId) || displayId < 0) {
        reject(new Error(`Invalid choice of displayId: ${displayId}`));
      } else {
        const format = options.format || 'jpg';
        let filename;
        let suffix;
        if (options.filename) {
          const ix = options.filename.lastIndexOf('.');
          suffix = ix >= 0 ? options.filename.slice(ix) : `.${format}`;
          filename = '"' + options.filename.replace(/"/g, '\\"') + '"' // eslint-disable-line
        } else {
          suffix = `.${format}`;
        }

        const tmpPaths = Array(displayId + 1)
          .fill(null)
          .map(() => temp.path({ suffix }));

        let pathsToDelete = [];
        if (options.filename) {
          tmpPaths[displayId] = filename;
        }
        pathsToDelete = tmpPaths.slice(displayId);

        const performCapture = (skipDisplay = false) => {
          exec(
            skipDisplay
              ? (
                `screencapture -x -t ${format} ${tmpPaths.slice(displayId).join(' ')}`
              ) : (
                `screencapture -D ${(displayId + 1)} -x -t ${format} ${tmpPaths.slice(displayId).join(' ')}`
              ),
            (err) => {
              if (err) {
                if (err.message.includes('illegal option -- D')) {
                  performCapture(true);
                } else {
                  reject(err);
                }
              } else if (options.filename) {
                resolve(path.resolve(options.filename));
              } else {
                fs.readFile(tmpPaths[displayId], (error, img) => {
                  if (error) {
                    reject(error);
                  } else {
                    Promise.all(pathsToDelete.map(unlinkP))
                      .then(() => resolve(img))
                      .catch(e => reject(e));
                  }
                });
              }
            },
          );
        };
        performCapture();
      }
    });
  };
}

if (
  process.platform === 'windows'
  || process.platform === 'win32'
) {
  const appPath = app.getAppPath();
  const libPath = (
    process.env.NODE_ENV === 'development'
      ? (
        path.join(
          appPath.split('node_modules')[0],
          'node_modules/screenshot-desktop/lib/win32',
        )
      ) : (
        path.join(
          appPath.split('app.asar')[0],
          'screenshot-desktop/',
        )
      )
  );


  screenshot.windowsSnapshot = function windowsSnapshot(options = {}) {
    return new Promise((resolve, reject) => {
      const displayName = options.screen;
      const format = options.format || 'jpg';
      const tmpPath = temp.path({
        suffix: `.${format}`,
      });
      const imgPath = path.resolve(options.filename || tmpPath);

      const displayChoice = displayName ? ` /d "${displayName}"` : '';

      exec(
        `"${path.join(libPath, 'screenCapture_1.3.2.bat')}" "${imgPath}" ${displayChoice}`,
        {
          cwd: libPath,
        },
        (err) => {
          if (err) {
            reject(err);
          } else {
            if (options.filename) { // eslint-disable-line
              resolve(imgPath);
            } else {
              readAndUnlinkP(tmpPath)
                .then(resolve)
                .catch(reject);
            }
          }
        },
      );
    });
  };

  screenshot.listDisplays = function listDisplays() {
    return new Promise((resolve, reject) => {
      exec(
        `"${path.join(libPath, 'screenCapture_1.3.2.bat')}" /list`,
        {
          cwd: libPath,
        },
        (err, stdout) => {
          if (err) {
            return reject(err);
          }
          return resolve(screenshot.parseDisplaysOutput(stdout));
        },
      );
    });
  };
}

function* ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  try {
    yield eff.cps(
      fs.access,
      dirname,
    );
  } catch (err) {
    yield eff.call(
      ensureDirectoryExistence,
      dirname,
    );
    yield eff.cps(
      fs.mkdir,
      dirname,
    );
  }
}

function loadImageWithDimension(buf) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const src = `data:image/jpeg;base64,${buf.toString('base64')}`;

    function fullFill() {
      if (img.naturalWidth) {
        const imageObj = {
          src,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
        };
        resolve(imageObj);
      } else {
        reject(new Error(`Failed to load image's URL: ${buf}`));
      }
      img.removeEventListener('error', fullFill);
      img.removeEventListener('load', fullFill);
    }

    img.addEventListener(
      'load',
      fullFill,
    );
    img.addEventListener(
      'error',
      fullFill,
    );
    img.src = src;
  });
}

function createImageThumb(src) {
  return new Promise((resolve, reject) => {
    const canvas = window.document.createElement('canvas');
    const context = canvas.getContext('2d');
    const img = new Image();

    function fullFill() {
      if (img.naturalWidth) {
        context.drawImage(img, 0, 0, 300, 150);
        const thumb = canvas.toDataURL('image/jpeg').replace(/^data:image\/jpeg;base64,/, '');
        resolve(thumb);
      } else {
        reject(new Error(`Failed to load image's URL: ${src}`));
      }
      img.removeEventListener('error', fullFill);
      img.removeEventListener('load', fullFill);
    }

    img.addEventListener(
      'load',
      fullFill,
    );
    img.addEventListener(
      'error',
      fullFill,
    );
    img.src = `file://${src}`;
  });
}

export function* uploadScreenshots({
  isCloud,
  filenameImage,
  filenameThumb,
  imagePath,
  imageThumbPath,
}) {
  const {
    image,
    imageThumb,
  } = yield eff.all({
    image: eff.cps(fs.readFile, imagePath),
    imageThumb: eff.cps(fs.readFile, imageThumbPath),
  });
  if (isCloud) {
    const {
      signImageRes,
      signThumbRes,
    } = yield eff.all({
      signImageRes: eff.call(
        chronosApi.signBucketUrl,
        {
          body: {
            filename: filenameImage,
          },
        },
      ),
      signThumbRes: eff.call(
        chronosApi.signBucketUrl,
        {
          body: {
            filename: filenameThumb,
          },
        },
      ),
    });

    yield eff.all([
      eff.call(
        chronosApi.uploadScreenshotOnS3Bucket,
        {
          url: signImageRes.url,
          image,
        },
      ),
      eff.call(
        chronosApi.uploadScreenshotOnS3Bucket,
        {
          url: signThumbRes.url,
          image: imageThumb,
        },
      ),
    ]);
  } else {
    yield eff.all([
      eff.call(
        jiraApi.uploadScreenshotOnSelfServer,
        {
          image,
          filename: filenameImage,
        },
      ),
      eff.call(
        jiraApi.uploadScreenshotOnSelfServer,
        {
          image: imageThumb,
          filename: filenameThumb,
        },
      ),
    ]);
  }
}

function* handleScreenshot({
  imagePath,
  imageThumbPath,
  filename,
  filenameThumb,
  keepScreenshot,
  dismissOnlyScreenshot,
  dismissTimeAndScreenshot,
  time,
  timestamp,
}) {
  yield eff.put(uiActions.setUiState({
    uploadScreenshotLoading: true,
  }));
  let isOffline = false;
  try {
    const screenshotsPeriod = yield eff.select(selectors.getUiState('screenshotsPeriod'));
    const screenshotsPeriodInSeconds = (
      screenshotsPeriod < 30
        ? 30
        : screenshotsPeriod
    );
    const nextPeriodNumber = (Math.floor(time / screenshotsPeriodInSeconds) + 1);
    if (
      keepScreenshot
      || dismissOnlyScreenshot
    ) {
      const screenshotTime = randomIntFromInterval(
        (nextPeriodNumber * screenshotsPeriodInSeconds) + 5,
        (screenshotsPeriodInSeconds * (nextPeriodNumber + 1) - 2),
      );
      yield eff.put(uiActions.setUiState({
        screenshotTime,
        screenshotTimeId: new Date().getTime(),
      }));
    }
    let signedScreenshotUrls = null;
    if (keepScreenshot) {
      const thumb = yield eff.call(
        createImageThumb,
        imagePath,
      );
      yield eff.cps(
        fs.writeFile,
        imageThumbPath,
        thumb,
        'base64',
      );
      const {
        protocol,
        hostname,
        port,
        pathname,
      } = yield eff.select(selectors.getUiState(['protocol', 'hostname', 'port', 'pathname']));
      const p = port ? `:${port}` : '';
      const rootApiUrl = `${protocol}://${hostname}${p}${pathname.replace(/\/$/, '')}`;
      const isCloud = hostname.endsWith('.atlassian.net');
      try {
        yield eff.call(
          uploadScreenshots,
          {
            isCloud,
            filenameImage: filename,
            filenameThumb,
            imagePath,
            imageThumbPath,
          },
        );
        signedScreenshotUrls = (
          isCloud
            ? (
              yield eff.call(
                chronosApi.signScreenshots,
                {
                  body: {
                    screenshots: [
                      filename,
                      filenameThumb,
                    ],
                  },
                },
              )
            ) : ({
              urls: [
                { url: `${rootApiUrl}/plugins/servlet/chronos/screenshots/${filename}` },
                { url: `${rootApiUrl}/plugins/servlet/chronos/screenshots/${filenameThumb}` },
              ],
            })
        );
      } catch (err) {
        if (err.isInternetConnectionIssue) {
          isOffline = true;
        } else {
          throw err;
        }
      }
      const screenshotViewerWindowId = yield eff.select(
        selectors.getUiState('screenshotViewerWindowId'),
      );
      yield eff.put(screenshotsActions.addScreenshot({
        imgUrl: (
          isOffline
            ? `file://${imagePath}`
            : signedScreenshotUrls.urls[0].url
        ),
        thumbUrl: (
          isOffline
            ? `file://${imageThumbPath}`
            : signedScreenshotUrls.urls[1].url
        ),
        filename,
        filenameThumb,
        time,
        timestamp,
        status: (
          isOffline
            ? 'offline'
            : 'success'
        ),
        ...(
          isOffline
            ? ({
              imagePath,
              imageThumbPath,
            }) : {}
        ),
      }, screenshotViewerWindowId));
      if (!isOffline) {
        yield eff.cps(
          fs.unlink,
          imageThumbPath,
        );
      }
    }
    if (dismissOnlyScreenshot) {
      const screenshotViewerWindowId = yield eff.select(
        selectors.getUiState('screenshotViewerWindowId'),
      );
      yield eff.put(screenshotsActions.addScreenshot({
        time,
        timestamp,
        status: 'dismissed',
      }, screenshotViewerWindowId));
    }
    if (dismissTimeAndScreenshot) {
      const newTime = (nextPeriodNumber - 1) * screenshotsPeriodInSeconds;
      const {
        fullyExpiredPeriods,
        startPeriodNumber,
      } = calculateInactivityPeriod({
        screenshotsPeriod,
        idleTimeInSceonds: time - newTime,
        time: newTime,
      });
      const currentPeriodNumber = nextPeriodNumber - 1;
      const expiredActivity = Array.from(Array(fullyExpiredPeriods).keys()).reduce(
        (acc, periodNumber) => ({
          ...acc,
          [periodNumber + startPeriodNumber]: 0,
        }),
        {
          [currentPeriodNumber]: 0,
          [currentPeriodNumber + 1]: 0,
        },
      );
      yield eff.put(uiActions.setUiState('activity', expiredActivity));
      yield eff.put(timerActions.setTime(newTime));
      const screenshotTime = randomIntFromInterval(
        ((nextPeriodNumber - 1) * screenshotsPeriodInSeconds) + 5,
        (screenshotsPeriodInSeconds * nextPeriodNumber) - 2,
      );
      yield eff.put(uiActions.setUiState({
        screenshotTime,
        screenshotTimeId: new Date().getTime(),
      }));
    }
    if (!isOffline) {
      yield eff.cps(
        fs.unlink,
        imagePath,
      );
    }
    yield eff.put(uiActions.setUiState({
      uploadScreenshotLoading: false,
    }));
    yield eff.put(screenshotsActions.uploadScreenshotFinished());
  } catch (err) {
    console.log(err);
    yield eff.put(uiActions.setUiState({
      uploadScreenshotLoading: false,
    }));
    yield eff.put(screenshotsActions.uploadScreenshotFinished());
    yield eff.call(throwError, err);
  }
}

export function* takeScreenshotRequest() {
  while (true) {
    const {
      isTest,
      time,
      timestamp,
    } = yield eff.take(actionTypes.TAKE_SCREENSHOT_REQUEST);
    try {
      yield eff.put(uiActions.setUiState({
        takeScreenshotLoading: true,
      }));
      trackMixpanel('Take screenshot request');
      const displays = yield eff.call(screenshot.listDisplays);
      const snapshotFunc = () => {
        switch (process.platform) {
          case 'darwin':
            return screenshot.darwinSnapshot;
          case 'win32':
          case 'windows':
            return screenshot.windowsSnapshot;
          default:
            return screenshot;
        }
      };
      const images = yield eff.all(
        displays.map(
          d => eff.call(
            snapshotFunc(),
            {
              screen: d.id,
            },
          ),
        ),
      );
      const dimensionImages = yield eff.all(images.map(
        i => eff.call(
          loadImageWithDimension,
          i,
        ),
      ));
      const {
        width,
        height,
        imgs,
      } = dimensionImages.reduce(
        (acc, i) => ({
          xPointer: acc.xPointer + i.naturalWidth,
          width: acc.width + i.naturalWidth,
          height: acc > i.naturalHeight ? acc : i.naturalHeight,
          imgs: [
            ...acc.imgs,
            {
              ...i,
              x: acc.xPointer,
              y: 0,
            },
          ],
        }),
        {
          width: 0,
          height: 0,
          xPointer: 0,
          imgs: [],
        },
      );
      const mergedImages = yield eff.call(
        mergeImages,
        imgs,
        {
          width,
          height,
          format: 'image/jpeg',
          quality: 0.9,
        },
      );
      const validImage = mergedImages.replace(/^data:image\/jpeg;base64,/, '');
      const userData = yield eff.select(selectors.getUserData);
      const filename = [
        `${timestamp}`,
        ...(
          isTest
            ? ([
              '_test_screenshot.jpeg',
            ]) : ([
              `_${userData.key || userData.name}`,
              `_${time}`,
              '.jpeg',
            ])
        ),
      ].join('');
      const filenameThumb = [
        `${timestamp}`,
        ...(
          isTest
            ? ([
              '_test_screenshot_thumb.jpeg',
            ]) : ([
              `_${userData.key || userData.name}`,
              `_${time}`,
              '_thumb.jpeg',
            ])
        ),
      ].join('');
      const imagePath = [
        `${app.getPath('userData')}/screens/`,
        filename,
      ].join('');
      const imageThumbPath = [
        `${app.getPath('userData')}/screens/`,
        filenameThumb,
      ].join('');

      yield eff.call(
        ensureDirectoryExistence,
        imagePath,
      );
      yield eff.cps(
        fs.writeFile,
        imagePath,
        validImage,
        'base64',
      );
      const showScreenshotPreview = yield eff.select(
        selectors.getUiState('showScreenshotPreview'),
      );
      if (
        showScreenshotPreview
        || isTest
      ) {
        const useNativeNotifications = yield eff.select(
          selectors.getUiState('useNativeNotifications'),
        );
        let showPopup = (
          !useNativeNotifications
          || isTest
        );
        let isSmall = true;
        if (
          useNativeNotifications
          && !isTest
        ) {
          const urlImage = `file://${imagePath}`;
          const notification = new Notification('Screenshot', {
            body: 'Screenshot just was taken, click to see details',
            icon: urlImage,
          });
          notification.onclick = () => {
            showPopup = true;
            isSmall = false;
            store.dispatch(screenshotsActions.nativeScreenshotNotificationClick());
          };
          yield eff.race([
            eff.take(actionTypes.NATIVE_SCREENSHOT_NOTIFICATION_CLICK),
            eff.delay(3000),
          ]);
        }
        if (showPopup) {
          const dispayWidth = screen.getPrimaryDisplay().bounds.width;
          const size = {
            height: (
              (
                isTest
                || !isSmall
              )
                ? 540
                : 300
            ),
            width: (
              (
                isTest
                || !isSmall
              )
                ? 640
                : 360
            ),
            ...(
              isTest || !isSmall
                ? {}
                : {
                  x: dispayWidth - 360,
                  y: 0,
                }
            ),
          };
          const win = yield eff.call(
            windowsManagerSagas.forkNewWindow,
            {
              url: (
                process.env.NODE_ENV === 'development'
                  ? 'http://localhost:3000/screenshotNotification.html'
                  : `file://${__dirname}/screenshotNotification.html`
              ),
              showOnReady: true,
              BrowserWindow: remote.BrowserWindow,
              options: {
                show: false,
                frame: false,
                resizable: false,
                ...size,
                alwaysOnTop: process.env.NODE_ENV === 'production',
                title: 'Screenshot notification popup',
                webPreferences: {
                  devTools: (
                    config.screenshotNotificationWindowDevtools
                    || process.env.DEBUG_PROD === 'true'
                  ),
                  webSecurity: false,
                },
              },
            },
          );
          const readyChannel = yield eff.call(
            windowsManagerSagas.createWindowChannel,
            {
              win,
              webContentsEvents: [
                'dom-ready',
              ],
            },
          );

          yield eff.take(readyChannel);
          const screenshotsPeriod = yield eff.select(selectors.getUiState('screenshotsPeriod'));
          const decisionTime = (
            screenshotsPeriod < 60
              ? 5
              : (
                yield eff.select(selectors.getUiState('screenshotDecisionTime'))
              )
          );
          yield eff.put(screenshotsActions.setNotificationScreenshot({
            isTest,
            screenshot: imagePath,
            decisionTime,
            scope: [win.id],
          }));
          const {
            keepScreenshot,
            dismissOnlyScreenshot,
            dismissTimeAndScreenshot,
          } = yield eff.race({
            currentWindowClose: eff.take(sharedActionTypes.WINDOW_BEFORE_UNLOAD),
            testScreenshotWindowClose: eff.take(actionTypes.TEST_SCREENSHOT_WINDOW_CLOSE),
            keepScreenshot: eff.take(actionTypes.KEEP_SCREENSHOT),
            dismissOnlyScreenshot: eff.take(actionTypes.DISMISS_ONLY_SCREENSHOT),
            dismissTimeAndScreenshot: eff.take(actionTypes.DISMISS_TIME_AND_SCREENSHOT),
          });
          win.destroy();
          yield eff.fork(
            handleScreenshot,
            {
              imagePath,
              imageThumbPath,
              filename,
              filenameThumb,
              keepScreenshot,
              dismissOnlyScreenshot,
              dismissTimeAndScreenshot,
              time,
              timestamp,
            },
          );
        } else {
          yield eff.fork(
            handleScreenshot,
            {
              imagePath,
              imageThumbPath,
              filename,
              filenameThumb,
              keepScreenshot: true,
              dismissOnlyScreenshot: false,
              dismissTimeAndScreenshot: false,
              time,
              timestamp,
            },
          );
        }
      } else {
        yield eff.fork(
          handleScreenshot,
          {
            imagePath,
            imageThumbPath,
            filename,
            filenameThumb,
            keepScreenshot: true,
            dismissOnlyScreenshot: false,
            dismissTimeAndScreenshot: false,
            time,
            timestamp,
          },
        );
      }
      yield eff.put(uiActions.setUiState({
        takeScreenshotLoading: false,
      }));
      yield eff.put(screenshotsActions.takeScreenshotFinished());
    } catch (err) {
      // TODO: what to do in that case?
      console.log(err);
      yield eff.put(uiActions.setUiState({
        takeScreenshotLoading: false,
      }));
      yield eff.put(screenshotsActions.takeScreenshotFinished());
      yield eff.call(throwError, err);
    }
  }
}

function* handleScreenshotsViewerWindowReady({
  readyChannel,
  waitFirstReady,
  win,
  issueId,
  worklogId,
}): Generator<*, *, *> {
  let isFirst = true;
  while (true) {
    if (
      isFirst
      && waitFirstReady
    ) {
      yield eff.take(readyChannel);
    }
    isFirst = false;

    const screenshotsPeriod = yield eff.select(selectors.getUiState('screenshotsPeriod'));
    const issue = (
      issueId
        ? (
          yield eff.select(selectors.getResourceItemById('issues', issueId))
        ) : (
          yield eff.select(selectors.getTrackingIssue)
        )
    );
    const {
      protocol,
      hostname,
      port,
      pathname,
    } = yield eff.select(selectors.getUiState(['protocol', 'hostname', 'port', 'pathname']));
    const p = port ? `:${port}` : '';
    const rootApiUrl = `${protocol}://${hostname}${p}${pathname.replace(/\/$/, '')}`;
    const isCloud = hostname.endsWith('.atlassian.net');
    if (issueId) {
      yield eff.put(screenshotsActions.setScreenshotsViewerState({
        isLoading: true,
        screenshotsPeriod,
      }, win.id));
      try {
        let worklogs = [];
        if (worklogId) {
          const worklog = yield eff.select(selectors.getResourceItemById('worklogs', worklogId));
          const { worklogs: worklogsServer } = yield eff.call(
            isCloud
              ? chronosApi.getScreenshots
              : jiraApi.getWorklogActivity,
            {
              ...(
                isCloud
                  ? {
                    body: {
                      issueId,
                      worklogId,
                    },
                  } : {
                    params: {
                      issueId,
                      worklogIds: [worklogId],
                    },
                  }
              ),
            },
          );
          worklogs = [{
            ...worklog,
            isUnfinished: false,
            screenshotsPeriod: (
              worklogsServer.length
                ? worklogsServer[0].screenshotsPeriod
                : screenshotsPeriod
            ),
            screenshots: (
              worklogsServer.length
                ? worklogsServer[0].screenshots
                : []
            ).map(
              s => (
                isCloud
                  ? s : ({
                    ...s,
                    imgUrl: `${rootApiUrl}/plugins/servlet/chronos/screenshots/${s.filename}`,
                    thumbUrl: `${rootApiUrl}/plugins/servlet/chronos/screenshots/${s.filenameThumb}`,
                  })
              ),
            ),
          }];
        } else {
          const issueWorklogs = yield eff.select(selectors.getIssueWorklogs(issueId));
          const { worklogs: worklogsServer } = yield eff.call(
            isCloud
              ? chronosApi.getScreenshots
              : jiraApi.getWorklogActivity,
            {
              ...(
                isCloud
                  ? {
                    body: {
                      issueId,
                    },
                  } : {
                    params: {
                      issueId,
                    },
                  }
              ),
            },
          );
          const screenshotsWorklogMap = (
            worklogsServer.reduce(
              (acc, w) => ({
                ...acc,
                [w.worklogId]: w,
              }),
              {},
            )
          );
          worklogs = (
            issueWorklogs.map(
              w => ({
                ...w,
                isUnfinished: false,
                screenshotsPeriod: (
                  screenshotsWorklogMap[w.id]?.length
                    ? screenshotsWorklogMap[w.id].screenshotsPeriod
                    : screenshotsPeriod
                ),
                screenshots: (
                  screenshotsWorklogMap[w.id]?.screenshots
                  || []
                ).map(
                  s => (
                    isCloud
                      ? s : ({
                        ...s,
                        imgUrl: `${rootApiUrl}/plugins/servlet/chronos/screenshots/${s.filename}`,
                        thumbUrl: `${rootApiUrl}/plugins/servlet/chronos/screenshots/${s.filenameThumb}`,
                      })
                  ),
                ),
              }),
            )
          );
        }
        const issuesWithScreenshotsActivity = [{
          id: issue.id,
          issue,
          worklogs,
        }];
        yield eff.put(screenshotsActions.setScreenshotsViewerState({
          currentIssue: null,
          currentScreenshots: [],
          isLoading: false,
          screenshotsPeriod,
          issuesWithScreenshotsActivity,
        }, win.id));
      } catch (err) {
        console.log(err);
        yield eff.put(screenshotsActions.setScreenshotsViewerState({
          isLoading: false,
          screenshotsPeriod,
        }, win.id));
      }
    } else {
      const screenshots = yield eff.select(selectors.getUiState('screenshots'));
      yield eff.put(screenshotsActions.setScreenshotsViewerState({
        currentIssue: issue,
        currentScreenshots: screenshots,
        issuesWithScreenshotsActivity: [],
        isLoading: false,
        screenshotsPeriod,
      }, win.id));
    }

    win.focus();
    yield eff.take(readyChannel);
  }
}

export function* handleScreenshotsViewerWindow(): Generator<*, *, *> {
  let win = null;
  let readyWinFork = null;
  while (true) {
    const {
      currentWindowClose,
      showWindow,
    } = yield eff.race({
      currentWindowClose: eff.take(sharedActionTypes.WINDOW_BEFORE_UNLOAD),
      showWindow: eff.take(actionTypes.SHOW_SCREENSHOTS_VIEWER_WINDOW),
    });
    if (
      currentWindowClose
      && win
      && !win.isDestroyed()
    ) {
      win.destroy();
    }
    if (showWindow) {
      trackMixpanel('Show screenshot viewer');
      if (
        !win
        || win.isDestroyed()
      ) {
        win = yield eff.call(
          windowsManagerSagas.forkNewWindow,
          {
            url: (
              process.env.NODE_ENV === 'development'
                ? 'http://localhost:3000/screenshotsViewer.html'
                : `file://${__dirname}/screenshotsViewer.html`
            ),
            showOnReady: true,
            BrowserWindow: remote.BrowserWindow,
            options: {
              show: true,
              title: 'Screenshots viewer popup',
              webPreferences: {
                webSecurity: false,
                devTools: (
                  config.screenshotsViewerWindowDevtools
                  || process.env.DEBUG_PROD === 'true'
                ),
              },
            },
          },
        );
        const readyChannel = yield eff.call(
          windowsManagerSagas.createWindowChannel,
          {
            win,
            webContentsEvents: [
              'dom-ready',
            ],
          },
        );
        if (readyWinFork) {
          yield eff.cancel(readyWinFork);
        }
        readyWinFork = yield eff.fork(
          handleScreenshotsViewerWindowReady,
          {
            readyChannel,
            waitFirstReady: true,
            win,
            issueId: showWindow?.issueId,
            worklogId: showWindow?.worklogId,
          },
        );
        yield eff.put(uiActions.setUiState({
          screenshotViewerWindowId: win.id,
        }));
      } else {
        const readyChannel = yield eff.call(
          windowsManagerSagas.createWindowChannel,
          {
            win,
            webContentsEvents: [
              'dom-ready',
            ],
          },
        );
        if (readyWinFork) {
          yield eff.cancel(readyWinFork);
        }
        readyWinFork = yield eff.fork(
          handleScreenshotsViewerWindowReady,
          {
            readyChannel,
            waitFirstReady: false,
            win,
            issueId: showWindow?.issueId,
            worklogId: showWindow?.worklogId,
          },
        );
      }
    }
  }
}

function* deleteScreenshot({
  timestamp,
  worklogId,
  issueId,
  isUnfinished,
}) {
  const screenshotViewerWindowId = yield eff.select(
    selectors.getUiState('screenshotViewerWindowId'),
  );
  if (isUnfinished) {
    const screenshots = yield eff.select(selectors.getUiState('screenshots'));
    yield eff.put(screenshotsActions.setScreenshots(
      screenshots.map(
        s => ({
          ...s,
          status: (
            s.timestamp === timestamp
              ? 'deleted'
              : s.status
          ),
        }),
      ),
      screenshotViewerWindowId,
    ));
  } else {
    const hostname = yield eff.select(selectors.getUiState('hostname'));
    const isCloud = hostname.endsWith('.atlassian.net');
    yield eff.put(screenshotsActions.deleteScreenshot({
      issueId,
      worklogId,
      timestamp,
      screenshotViewerWindowId,
    }));
    yield eff.call(
      isCloud
        ? chronosApi.deleteScreenshot
        : jiraApi.deleteScreenshot,
      {
        body: {
          issueId,
          worklogId,
          timestamp,
        },
      },
    );
  }
}

export function* takeDeleteScreenshotRequest() {
  yield eff.takeEvery(actionTypes.DELETE_SCREENSHOT_REQUEST, deleteScreenshot);
}
