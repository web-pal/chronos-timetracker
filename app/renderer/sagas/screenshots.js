import * as eff from 'redux-saga/effects';
import fs from 'fs';
import path from 'path';
import {
  remote,
} from 'electron';
import mergeImages from 'merge-images';
import screenshot from 'screenshot-desktop';

import {
  actionTypes,
  screenshotsActions,
  timerActions,
  uiActions,
} from 'actions';
import {
  getUserData,
  getUiState,
} from 'selectors';
import {
  actionTypes as sharedActionTypes,
} from 'shared/actions';
import {
  windowsManagerSagas,
} from 'shared/sagas';
import {
  chronosApi,
} from 'api';
import {
  randomIntFromInterval,
} from 'utils/random';
import config from 'config';

import {
  throwError,
} from './ui';

const { app } = remote.require('electron');


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

// TODO: handle offline
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
  const screenshotsPeriod = (
    config.screenshotsPeriod < 30
      ? 30
      : config.screenshotsPeriod
  );
  const screenshotNumber = (Math.floor(time / screenshotsPeriod) + 1);
  if (
    keepScreenshot
    || dismissOnlyScreenshot
  ) {
    const screenshotTime = randomIntFromInterval(
      (screenshotNumber * screenshotsPeriod) + 5,
      screenshotsPeriod * (screenshotNumber + 1),
    );
    yield eff.put(uiActions.setUiState({
      screenshotTime,
    }));
  }
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
    const { url: uploadFileUrl } = yield eff.call(
      chronosApi.signBucketUrl,
      {
        body: {
          filename,
        },
      },
    );
    const image = yield eff.cps(fs.readFile, imagePath);
    yield eff.call(
      chronosApi.uploadScreenshotOnS3Bucket,
      {
        url: uploadFileUrl,
        image,
      },
    );

    const { url: uploadThumbFileUrl } = yield eff.call(
      chronosApi.signBucketUrl,
      {
        body: {
          filename: filenameThumb,
        },
      },
    );
    const imageThumb = yield eff.cps(fs.readFile, imageThumbPath);
    yield eff.call(
      chronosApi.uploadScreenshotOnS3Bucket,
      {
        url: uploadThumbFileUrl,
        image: imageThumb,
      },
    );
    yield eff.put(screenshotsActions.addScreenshot({
      filename,
      filenameThumb,
      time,
      timestamp,
      status: 'success',
    }));
    yield eff.cps(
      fs.unlink,
      imageThumbPath,
    );
  }
  if (dismissOnlyScreenshot) {
    yield eff.put(screenshotsActions.addScreenshot({
      time,
      timestamp,
      status: 'dismissed',
    }));
  }
  if (dismissTimeAndScreenshot) {
    yield eff.put(timerActions.setTime(
      (screenshotNumber - 1) * screenshotsPeriod,
    ));
    const screenshotTime = randomIntFromInterval(
      ((screenshotNumber - 1) * screenshotsPeriod) + 5,
      screenshotsPeriod * screenshotNumber,
    );
    yield eff.put(uiActions.setUiState({
      screenshotTime,
    }));
  }
  yield eff.cps(
    fs.unlink,
    imagePath,
  );
}

export function* takeScreenshotRequest() {
  while (true) {
    const {
      isTest,
      time,
    } = yield eff.take(actionTypes.TAKE_SCREENSHOT_REQUEST);
    try {
      yield eff.put(uiActions.setUiState({
        takeScreenshotLoading: true,
      }));
      const displays = yield eff.call(screenshot.listDisplays);
      const images = yield eff.all(
        displays.map(
          d => eff.call(
            screenshot,
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
      const timestamp = new Date().getTime();
      const userData = yield eff.select(getUserData);
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
      yield eff.put(uiActions.setUiState({
        takeScreenshotLoading: false,
      }));
      const decisionTime = (
        config.screenshotsPeriod < 60
          ? 5
          : (
            yield eff.select(getUiState('screenshotDecisionTime'))
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
    } catch (err) {
      console.log(err);
      yield eff.call(throwError, err);
    }
  }
}
