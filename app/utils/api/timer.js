import fs from 'fs';
import { remote, ipcRenderer, desktopCapturer } from 'electron';
import mergeImages from 'merge-images';


function getScreen(callback) {
  const screenshots = [];

  function handleStream(stream, finalScreenshot) {
    // Create hidden video tag
    const video = document.createElement('video');
    video.style.cssText = 'position:absolute;top:-10000px;left:-10000px;';
    // Event connected to stream
    video.onloadedmetadata = () => {
      // Set video ORIGINAL height (screenshot)
      video.style.height = `${video.videoHeight}px`; // videoHeight
      video.style.width = `${video.videoWidth}px`; // videoWidth

      // Create canvas
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      // Draw video on canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      screenshots.push(canvas.toDataURL('image/jpeg'));

      if (callback) {
        // Save screenshot to jpg - base64
        if (finalScreenshot) {
          callback(screenshots);
        }
      } else {
        // console.log('Need callback!');
      }

      // Remove hidden video tag
      video.remove();
      try {
        // Destroy connect to stream
        stream.getTracks()[0].stop();
      } catch (e) {
        // console.log(e);
      }
    };
    video.src = URL.createObjectURL(stream);
    document.body.appendChild(video);
  }

  function handleError(e) {
    console.log(e);
  }

  desktopCapturer.getSources({ types: ['screen'] }, (error, sources) => {
    if (error) throw error;
    for (let i = 0; i < sources.length; i += 1) {
      const finalScreenshot = i === sources.length - 1;
      navigator.webkitGetUserMedia({
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: sources[i].id,
            minWidth: 1280,
            maxWidth: 4000,
            minHeight: 720,
            maxHeight: 4000,
          },
        },
      }, stream => handleStream(stream, finalScreenshot), handleError);
    }
  });
}


export function makeScreenshot(
  screenshotTime, userKey, host, showPreview, screenshotPreviewTime, nativeNotifications,
) {
  return new Promise((resolve, reject) => {
    getScreen((images) => {
      let xPointer = 0;
      let totalWidth = 0;
      let maxHeight = 0;
      const imagesWithCords = images.map((imageSrc) => {
        const image = new Image();
        image.src = imageSrc;
        const imageObj = {
          src: imageSrc,
          x: xPointer,
          y: 0,
        };
        xPointer = image.naturalWidth + xPointer;
        totalWidth += image.naturalWidth;
        maxHeight = image.naturalHeight > maxHeight ? image.naturalHeight : maxHeight;
        return imageObj;
      });
      const now = Date.now();
      const screenshotName = `${host}_${userKey}_${screenshotTime}_${now}`;
      mergeImages(
        imagesWithCords,
        {
          width: totalWidth,
          height: maxHeight,
          format: 'image/jpeg',
          quality: 0.9,
        },
      )
        .then(
          (merged) => {
            // Scren thumb
            const canvas = window.document.createElement('canvas');
            const context = canvas.getContext('2d');
            const img = new Image();
            img.onload = () => {
              context.drawImage(img, 0, 0, 300, 150);
              const thumb = canvas.toDataURL('image/jpeg').replace(/^data:image\/jpeg;base64,/, '');
              const thumbImageDir = `${remote.getGlobal('appDir')}/screens/${screenshotName}_thumb.jpeg`;
              fs.writeFile(thumbImageDir, thumb, 'base64');
              remote.getGlobal('sharedObj').lastScreenshotThumbPath = thumbImageDir;
            };
            img.src = merged;

            // Screen
            const validImage = merged.replace(/^data:image\/jpeg;base64,/, '');
            const imageDir = `${remote.getGlobal('appDir')}/screens/${screenshotName}.jpeg`;
            fs.writeFile(imageDir, validImage, 'base64', (err) => {
              if (err) reject();

              remote.getGlobal('sharedObj').lastScreenshotPath = imageDir;
              remote.getGlobal('sharedObj').screenshotTime = screenshotTime;
              remote.getGlobal('sharedObj').timestamp = now;
              remote.getGlobal('sharedObj').screenshotPreviewTime = screenshotPreviewTime;
              remote.getGlobal('sharedObj').nativeNotifications = nativeNotifications;

              if (showPreview) {
                ipcRenderer.send('show-screenshot-popup');
              } else {
                ipcRenderer.send('screenshot-accept');
              }
              resolve();
            });
          },
        );
    });
  });
}
