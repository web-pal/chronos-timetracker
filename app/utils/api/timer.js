import fs from 'fs';
import { remote, ipcRenderer } from 'electron';
import mergeImages from 'merge-images';
import getScreen from 'user-media-screenshot';


export function makeScreenshot(screenshotTime, userKey, host) {
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
      const screenhotName = `${host}_${userKey}_${screenshotTime}_${Date.now()}`;
      mergeImages(
        imagesWithCords,
        { width: totalWidth, height: maxHeight, format: 'image/jpeg', quality: 0.9 },
      )
        .then(
          (merged) => {
            // Scren thumb
            const canvas = window.document.createElement('canvas');
            const context = canvas.getContext('2d');
            const img = new Image();
            img.src = merged;
            context.drawImage(img, 0, 0, 300, 150);
            const thumb = canvas.toDataURL('image/jpeg').replace(/^data:image\/jpeg;base64,/, '');
            const thumbImageDir = `${remote.getGlobal('appDir')}/screens/${screenhotName}_thumb.jpeg`;
            fs.writeFile(thumbImageDir, thumb, 'base64');

            // Screen
            const validImage = merged.replace(/^data:image\/jpeg;base64,/, '');
            const imageDir = `${remote.getGlobal('appDir')}/screens/${screenhotName}.jpeg`;
            fs.writeFile(imageDir, validImage, 'base64', (err) => {
              if (err) reject();

              remote.getGlobal('sharedObj').lastScreenshotPath = imageDir;
              remote.getGlobal('sharedObj').lastScreenshotThumbPath = thumbImageDir;
              remote.getGlobal('sharedObj').screenshotTime = screenshotTime;
              ipcRenderer.send('showScreenPreviewPopup');
              resolve();
            });
          },
        );
    });
  });
}
