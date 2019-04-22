const path = require('path');
const fs = require('fs');

exports.default = async function afterPack(context) {
  if (process.platform === 'win32') {
    const libPath = (
      path.join(
        __dirname.split('node_modules')[0],
        'node_modules/screenshot-desktop/lib/win32',
      )
    );
    const screenshotDesktopPath = path.join(
      context.appOutDir,
      'resources/screenshot-desktop',
    );
    fs.mkdirSync(screenshotDesktopPath);

    fs.copyFileSync(
      path.join(libPath, 'screencapture_1.3.2.bat'),
      path.join(screenshotDesktopPath, 'screenCapture_1.3.2.bat'),
    );
    fs.copyFileSync(
      path.join(libPath, 'app.manifest'),
      path.join(screenshotDesktopPath, 'app.manifest'),
    );
  }
};
