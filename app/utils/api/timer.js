import fs from 'fs';
import { remote, ipcRenderer } from 'electron';
import mergeImages from 'merge-images';
import getScreen from 'user-media-screenshot';


export function makeScreenshot(screenshotTime) {
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
      mergeImages(imagesWithCords, { width: totalWidth, height: maxHeight })
        .then(
          (merged) => {
            const validImage = merged.replace(/^data:image\/png;base64,/, '');
            const imageDir = `${remote.getGlobal('appDir')}/screens/${screenshotTime}_${Date.now()}.png`;
            fs.writeFile(imageDir, validImage, 'base64', (err) => {
              if (err) reject();

              remote.getGlobal('sharedObj').lastScreenshotPath = imageDir;
              remote.getGlobal('sharedObj').screenshotTime = screenshotTime;
              ipcRenderer.send('showScreenPreviewPopup');
              resolve();
            });
          },
        );
    });
  });
}
