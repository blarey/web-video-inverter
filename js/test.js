'use strict';

const videoElement = document.querySelector('video');
const videoSelect = document.querySelector('select#videoSource');
videoElement.className =  "invert";

getStream().then(getDevices).then(gotDevices);
videoSelect.onchange = changeStream();


function getDevices() {
  // AFAICT in Safari this only gets default devices until gUM is called :/
  return navigator.mediaDevices.enumerateDevices();
}

function gotDevices(deviceInfos) {
  window.deviceInfos = deviceInfos; // make available to console
  console.log('Available input and output devices:', deviceInfos);
  for (const deviceInfo of deviceInfos) {
    const option = document.createElement('option');
    option.value = deviceInfo.deviceId;
    if (deviceInfo.kind === 'videoinput') {
      option.text = deviceInfo.label || `Camera ${videoSelect.length + 1}`;
      videoSelect.appendChild(option);
    }
  }
  // select the last video device
  videoSelect.selectedIndex = videoSelect.options.length-1;
}

function getStream() {
  if (window.stream) {
    window.stream.getTracks().forEach(track => {
      track.stop();
    });
  }
  const videoSource = videoSelect.value;
  const constraints = {
    audio: false,
    video: {deviceId: videoSource ? {exact: videoSource} : undefined}
  };
  return navigator.mediaDevices.getUserMedia(constraints).
    then(gotStream).catch(handleError);
}

async function changeStream() {
  if (window.stream) {
    const videoSource = videoSelect.value;
    const constraints = {
      audio: false,
      video: {deviceId: videoSource ? {exact: videoSource} : undefined}
    };
    let videoTrack = window.stream.getVideoTracks()[0];
    window.stream.getTracks().forEach(track => {
      track.stop();
    });
    videoTrack.stop()
    window.stream = await navigator.mediaDevices.getUserMedia(constraints);
    videoElement.srcObject = null;
    videoElement.srcObject = window.stream;
    videoElement.play();
  }
}

function gotStream(stream) {
  window.stream = stream; // make stream available to console
  videoSelect.selectedIndex = [...videoSelect.options].
    findIndex(option => option.text === stream.getVideoTracks()[0].label);
  videoElement.srcObject = stream;
  return stream;
}

function handleError(error) {
  console.error('Error: ', error);
}