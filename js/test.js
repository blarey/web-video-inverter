'use strict';

const videoElement = document.querySelector('video');
const videoSelect = document.querySelector('select#videoSource');
const buttonTestChange = document.querySelector('button#testChangeStream');
videoElement.className =  "invert";
let videoStream;

getStream().then(getDevices).then(gotDevices);

videoSelect.addEventListener('change', () => {
    changeStream();
  });
buttonTestChange.addEventListener('click', () => {
    changeStream();
  });

changeStream();

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
  console.log("changeStream called");
  if (videoStream) {
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop());
  }
  const videoSource = videoSelect.value;
  const constraints = {
    audio: false,
    video: {deviceId: videoSource ? {exact: videoSource} : undefined}
  };
  videoStream = await navigator.mediaDevices.getUserMedia(constraints);
  videoElement.srcObject = null;
  videoElement.srcObject = videoStream;
  videoElement.play();
}

function gotStream(stream) {
  window.stream = stream; // make stream available to console
  videoSelect.selectedIndex = [...videoSelect.options].
    findIndex(option => option.text === stream.getVideoTracks()[0].label);
  videoElement.srcObject = stream;
  videoStream = stream;
}

function handleError(error) {
  console.error('Error: ', error);
}
