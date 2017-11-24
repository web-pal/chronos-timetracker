const { desktopCapturer } = require('electron');

function getScreen(callback) {
  this.handleStream = (stream) => {
    // Create hidden video tag
    const video = document.createElement('video');
    video.style.cssText = 'position:absolute;top:-10000px;left:-10000px;';
    // Event connected to stream
    video.onloadedmetadata = function onLoadMetaData() {
      // Set video ORIGINAL height (screenshot)
      video.style.height = `${this.videoHeight}px`; // videoHeight
      video.style.width = `${this.videoWidth}px`; // videoWidth

      // Create canvas
      const canvas = document.createElement('canvas');
      canvas.width = this.videoWidth;
      canvas.height = this.videoHeight;
      const ctx = canvas.getContext('2d');
      // Draw video on canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      if (callback) {
        // Save screenshot to jpg - base64
        callback(canvas.toDataURL('image/jpeg'));
      } else {
        // console.log('Need callback!');
      }

      // Remove hidden video tag
      video.remove();
      try {
        // Destroy connect to stream
        stream.getTracks()[0].stop();
      } catch (e) {} // eslint-disable-line
    };
    video.src = URL.createObjectURL(stream);
    document.body.appendChild(video);
  };

  this.handleError = (e) => {
    console.log(e);
  };

  desktopCapturer.getSources({ types: ['screen'] }, (error, sources) => {
    if (error) throw error;
    for (let i = 0; i < sources.length; i += 1) {
      if (/(Entire\sscreen|Screen\s1)/.test(sources[i].name)) {
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
        }, this.handleStream, this.handleError);
        return;
      }
    }
  });
}

module.exports = getScreen;
