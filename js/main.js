/*
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

'use strict';

const videoElement = document.querySelector('video');
//const snapshotButton = document.querySelector('button#snapshot');
//const filterSelect = document.querySelector('select#filter');
const videoSelect = document.querySelector('select#videoSource');

// Put variables in global scope to make them available to the browser console.
const video = window.video = document.querySelector('video');
// set video with invert filter
video.className =  "invert";

// init stream options
const constraints = {
  audio: false,
  video: true
};

function listVideoDevice(deviceInfos) {
  while (videoSelect.firstChild) {
    videoSelect.removeChild(select.firstChild);
  }
  for (let i = 0; i !== deviceInfos.length; ++i) {
    const deviceInfo = deviceInfos[i];
    const option = document.createElement('option');
    option.value = deviceInfo.deviceId;
    if (deviceInfo.kind === 'videoinput') {
      option.text = deviceInfo.label || `camera ${videoSelect.length + 1}`;
      videoSelect.appendChild(option);
    } else {
      console.log('Some other kind of source/device: ', deviceInfo);
    }
  }
}

// iniciar video
function gotStream(stream) {
  window.stream = stream; // make stream available to console
  videoElement.srcObject = stream;
  // Refresh button list in case labels have become available
  return navigator.mediaDevices.enumerateDevices();
}


// error handler
function handleError(error) {
  console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
}

function start() {
  if (window.stream) {
    window.stream.getTracks().forEach(track => {
      track.stop();
    });
  }
  const videoSource = videoSelect.value;
  const constraints = {
    video: {deviceId: videoSource ? {exact: videoSource} : undefined}
  };
  navigator.mediaDevices.getUserMedia(constraints).then(gotStream).then(listVideoDevice).catch(handleError);
}

// navigator function calls
navigator.mediaDevices.enumerateDevices().then(listVideoDevice).catch(handleError);

videoSelect.onchange = start;

start();